const globalFlag = window as typeof window & { __brieflyWebListener?: boolean };
if (!globalFlag.__brieflyWebListener) chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'BRIEFLY_EXTRACT_PAGE') return;
  try {
    const doc = document.cloneNode(true) as Document;
    doc.querySelectorAll('script,style,noscript,nav,header,footer,aside,form,button,[hidden],[aria-hidden="true"]').forEach(el => el.remove());
    doc.querySelectorAll('[role="navigation"],[role="banner"],[role="contentinfo"],.advertisement,.ads,.cookie,.sidebar').forEach(el => el.remove());
    const main = doc.querySelector('article,main,[role="main"]') || doc.body;
    const text = (main?.textContent || '').replace(/\s+/g, ' ').trim();
    sendResponse({ ok: true, page: {
      title: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || document.title,
      url: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || location.href,
      text: text.slice(0, 100_000),
      headings: Array.from(document.querySelectorAll('h1,h2,h3')).map(h => h.textContent?.trim()).filter((v): v is string => Boolean(v)).slice(0, 40),
    } });
  } catch { sendResponse({ ok: false, error: 'This page could not be read. Try a regular article page.' }); }
  return true;
});
globalFlag.__brieflyWebListener = true;
