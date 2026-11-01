import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, ShieldCheck, Sparkles, Settings2, PanelRightOpen } from 'lucide-react';
import { checkUrl, extractCurrentPage, saveEntry, summarize } from '../services/api';
import type { PageData, SummaryMode } from '../types';
import './style.css';

function App() {
  const [page, setPage] = useState<PageData | null>(null);
  const [mode, setMode] = useState<SummaryMode>('short');
  const [summary, setSummary] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [risk, setRisk] = useState<{risk:string;factors:string[]}|null>(null);
  useEffect(() => { extractCurrentPage().then(setPage).catch(e => setError(e.message)); }, []);
  async function runSummary() {
    setBusy(true); setError(''); setMessage(''); setSummary('');
    try { const p = page || await extractCurrentPage(); setPage(p); const result = await summarize(p, mode); setSummary(result.summary); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not summarize this page.'); }
    finally { setBusy(false); }
  }
  async function save() {
    if (!page || !summary) return;
    await saveEntry({ title: page.title, url: page.url, summary, mode }); setMessage('Saved to your local library.');
  }
  function openPanel() { chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab?.id && chrome.sidePanel.open({ tabId: tab.id })); }
  async function runSafety() { if (!page) return; setError(''); setRisk(null); try { setRisk(await checkUrl(page.url)); } catch (e) { setError(e instanceof Error ? e.message : 'Could not check the URL.'); } }
  return <main>
    <header><div className="brand"><div className="mark"><Sparkles size={17}/></div><div><b>BrieflyWeb</b><small>Understand the web</small></div></div><button className="icon" title="Settings" onClick={() => { const api = prompt('BrieflyWeb API URL', 'http://localhost:8000/api/v1'); if (api) chrome.storage.local.set({apiBase: api}); }}><Settings2 size={17}/></button></header>
    <section className="context"><div className="eyebrow">CURRENT PAGE</div><strong>{page?.title || (error ? 'Page unavailable' : 'Reading page…')}</strong>{page && <a href={page.url} title={page.url}>{new URL(page.url).hostname}</a>}</section>
    <section className="actions"><label htmlFor="mode">Summary format</label><select id="mode" value={mode} onChange={e => setMode(e.target.value as SummaryMode)}><option value="short">Short summary</option><option value="detailed">Detailed summary</option><option value="bullets">Bullet points</option><option value="takeaways">Important takeaways</option><option value="simple">Simplified explanation</option><option value="study">Study notes</option></select><button className="primary" onClick={runSummary} disabled={busy || !page}>{busy ? 'Summarizing…' : <><Sparkles size={16}/> Summarize page</>}</button><div className="row"><button className="secondary" onClick={openPanel}><PanelRightOpen size={15}/> Open library</button><button className="secondary" onClick={runSafety} disabled={!page}><ShieldCheck size={15}/> Site safety</button></div></section>
    {error && <p className="error" role="alert">{error}</p>}{risk && <section className="result"><div className="result-head"><b>Heuristic assessment: {risk.risk}</b><span className="text">Not a reputation check</span></div><ul>{risk.factors.map((factor,i)=><li key={i}>{factor}</li>)}</ul></section>}{summary && <section className="result"><div className="result-head"><b>Summary</b><button className="text" onClick={() => navigator.clipboard.writeText(summary)}>Copy</button></div><p>{summary}</p><button className="secondary save" onClick={save}><BookOpen size={15}/> Save to library</button></section>}{message && <p className="notice">{message}</p>}
    <footer>Page text is sent to your configured local backend when you summarize.</footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
