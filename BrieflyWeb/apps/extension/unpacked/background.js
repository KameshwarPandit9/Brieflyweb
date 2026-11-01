function enableActionPanel(){chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:false}).catch(()=>{})}
chrome.action.onClicked.addListener(tab=>{if(tab?.windowId!=null)chrome.sidePanel.open({windowId:tab.windowId}).catch(()=>{})})
function installSelectionMenu(){chrome.contextMenus.removeAll(()=>{chrome.contextMenus.create({id:'brieflyweb-ask',title:'Ask with BrieflyWeb',contexts:['all']},()=>void chrome.runtime.lastError);chrome.contextMenus.create({id:'brieflyweb-explain-selection',title:'Explain selected text with BrieflyWeb',contexts:['selection']},()=>void chrome.runtime.lastError)})}
chrome.runtime.onInstalled.addListener(()=>{enableActionPanel();installSelectionMenu()});
chrome.runtime.onStartup.addListener(()=>{enableActionPanel();installSelectionMenu()});

chrome.contextMenus.onClicked.addListener((info,tab)=>{
  if(!tab?.id)return;
  if(info.menuItemId==='brieflyweb-explain-selection'){
    if(!info.selectionText?.trim())return;
    chrome.sidePanel.open({tabId:tab.id}).catch(()=>{});
    chrome.storage.session.set({[`pending-selection:${tab.id}`]:{text:info.selectionText.trim().slice(0,500),createdAt:Date.now()}}).catch(()=>{});
    return;
  }
  if(info.menuItemId==='brieflyweb-ask'){
    const text=info.selectionText?.trim().slice(0,500)||'';
    chrome.sidePanel.open({tabId:tab.id}).catch(()=>{});
    const key=text?`pending-ask:${tab.id}`:`pending-open:${tab.id}`;
    chrome.storage.session.set({[key]:{text,createdAt:Date.now()}}).catch(()=>{});
  }
});

chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(message?.type!=='brieflyweb:page-ready'||!sender.tab?.id||!message.page)return;
  const url=sender.url||sender.tab.url||'';
  if(!/^https?:\/\//i.test(url))return;
  const page=message.page;
  if(typeof page.text!=='string')return;
  chrome.storage.session.set({[`page:${sender.tab.id}`]:page}).then(()=>respond({ok:true})).catch(()=>respond({ok:false}));
  return true;
});

chrome.tabs.onRemoved.addListener(tabId=>chrome.storage.session.remove([`page:${tabId}`,`pending-selection:${tabId}`,`pending-ask:${tabId}`,`pending-open:${tabId}`]).catch(()=>{}));
