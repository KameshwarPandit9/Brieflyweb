import type { PageData, SummaryMode } from '../types';

const defaultApi = 'http://localhost:8000/api/v1';
export async function getApiBase() {
  const saved = await chrome.storage.local.get(['apiBase']);
  return (saved.apiBase as string | undefined || defaultApi).replace(/\/$/, '');
}
export async function summarize(page: PageData, mode: SummaryMode, language = 'English') {
  const base = await getApiBase();
  const response = await fetch(`${base}/summaries`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: page.title, url: page.url, text: page.text, headings: page.headings, mode, language }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || `Summary request failed (${response.status})`);
  return response.json() as Promise<{ summary: string; provider: string; grounded: boolean }>;
}
export async function checkUrl(url: string) {
  const base = await getApiBase();
  const response = await fetch(`${base}/security/url-checks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`URL check failed (${response.status})`);
  return response.json() as Promise<{ risk: string; factors: string[]; assessment: string }>;
}
export function saveEntry(entry: { title: string; url: string; summary: string; mode: SummaryMode }) {
  return new Promise<void>((resolve, reject) => chrome.storage.local.get(['library'], result => {
    const library = (result.library || []) as Array<Record<string, unknown>>;
    library.unshift({ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    chrome.storage.local.set({ library }, () => chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve());
  }));
}
export async function extractCurrentPage(): Promise<PageData> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith('http')) throw new Error('Open a regular http or https page first.');
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }).catch(() => { throw new Error('BrieflyWeb cannot read this restricted page. Open a regular website and try again.'); });
  const result = await chrome.tabs.sendMessage(tab.id, { type: 'BRIEFLY_EXTRACT_PAGE' }).catch(() => null);
  if (!result?.ok) throw new Error(result?.error || 'Page extraction is unavailable here. Reload the page and try again.');
  if (!result.page.text || result.page.text.length < 100) throw new Error('This page has too little readable text to summarize.');
  return result.page as PageData;
}
