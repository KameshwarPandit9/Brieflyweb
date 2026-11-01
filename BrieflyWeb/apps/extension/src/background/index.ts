chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'briefly-summarize', title: 'Summarize with BrieflyWeb', contexts: ['page', 'selection'] });
});
chrome.contextMenus.onClicked.addListener(async (_info, tab) => {
  if (!tab?.id) return;
  await chrome.sidePanel.open({ tabId: tab.id });
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'BRIEFLY_GET_ACTIVE_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => sendResponse({ tab: tabs[0] }));
    return true;
  }
});
