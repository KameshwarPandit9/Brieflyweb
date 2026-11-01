(() => {
  if (!/^https?:\/\//i.test(location.href)) return;
  try {
    const copy = document.cloneNode(true);
    copy.querySelectorAll('script,style,noscript,nav,header,footer,aside,form,button,[hidden],[aria-hidden="true"],[role="navigation"],[role="banner"],[role="contentinfo"]').forEach(node => node.remove());
    const root = copy.querySelector('article,main,[role="main"]') || copy.body;
    const text = (root?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100000);
    const page = {
      title: copy.querySelector('meta[property="og:title"]')?.content || document.title,
      url: document.querySelector('link[rel="canonical"]')?.href || location.href,
      tabUrl: location.href,
      text,
      headings: [...copy.querySelectorAll('h1,h2,h3')].map(node => node.textContent.trim()).filter(Boolean).slice(0, 40),
      capturedAt: Date.now()
    };
    chrome.runtime.sendMessage({ type: 'brieflyweb:page-ready', page }, () => void chrome.runtime.lastError);
  } catch (error) {
    // Page capture is best-effort and stays local until a user requests a feature.
  }
})();
