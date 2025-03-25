browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'openSidePanel',
    title: 'Create Qr Code for this site',
    contexts: ['page'],
  });
  browser.contextMenus.create({
    id: 'openSidePanel1',
    title: 'Create Qr Code for selected text',
    contexts: ['selection'],
  });
  browser.contextMenus.create({
    id: 'openSidePanel2',
    title: 'Create Qr Code for selected link',
    contexts: ['link'],
  });
  browser.contextMenus.create({
    id: 'openSidePanel3',
    title: 'Create Qr Code for selected image or audio or video link',
    contexts: ['image', 'audio', 'video'],
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked');
  if (info.menuItemId === 'openSidePanel') {
    browser.storage.local.set({ qrurl: tab.url });
    browser.sidebarAction.open();
  }
  if (info.menuItemId === 'openSidePanel1') {
    browser.storage.local.set({ qrurl: info.selectionText });
    browser.sidebarAction.open();
  }
  if (info.menuItemId === 'openSidePanel2') {
    browser.storage.local.set({ qrurl: info.linkUrl });
    browser.sidebarAction.open();
  }
  if (info.menuItemId === 'openSidePanel3') {
    browser.storage.local.set({ qrurl: info.srcUrl });
    browser.sidebarAction.open();
  }
});

browser.browserAction.onClicked.addListener((tab) => {
  browser.tabs.create({ url: 'index.html' });
});