chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Create Qr Code for this site',
    contexts: ['page'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel1',
    title: 'Create Qr Code for selected text',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel2',
    title: 'Create Qr Code for selected link',
    contexts: ['link'],
  });
  chrome.contextMenus.create({
    id: 'openSidePanel3',
    title: 'Create Qr Code for selected image or audio or video link',
    contexts: ['image', 'audio', 'video'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked');
  if (info.menuItemId === 'openSidePanel') {
    chrome.storage.local.set({ qrurl: tab.url });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel1') {
    chrome.storage.local.set({ qrurl: info.selectionText });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel2') {
    chrome.storage.local.set({ qrurl: info.linkUrl });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
  if (info.menuItemId === 'openSidePanel3') {
    chrome.storage.local.set({ qrurl: info.srcUrl });
    chrome.sidePanel.setOptions({
      tabId: tab?.id || -1,
      path: 'index.html',
      enabled: true,
    });
    chrome.sidePanel.open({ tabId: tab?.id || -1 });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'index.html' });
});