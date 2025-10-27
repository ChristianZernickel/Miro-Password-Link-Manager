// Background Service Worker für Chrome Extension

// Installation Event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Miro Link Plugin installiert!');

    // Initialisiere Storage mit leerem Array
    chrome.storage.sync.get(['bookmarks'], (result) => {
      if (!result.bookmarks) {
        chrome.storage.sync.set({ bookmarks: [] });
      }
    });
  } else if (details.reason === 'update') {
    console.log('Miro Link Plugin aktualisiert!');
  }
});

// Optional: Context Menu Integration (Rechtsklick)
// Kommentiere dies ein, wenn du Context Menu unterstützen möchtest
/*
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveLinkWithDescription',
    title: 'Link mit Miro speichern',
    contexts: ['link']
  });

  chrome.contextMenus.create({
    id: 'savePageWithDescription',
    title: 'Diese Seite mit Miro speichern',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveLinkWithDescription') {
    // Link-URL aus Context Menu
    const url = info.linkUrl;
    // Öffne Popup oder sende Nachricht
    chrome.action.openPopup();
  } else if (info.menuItemId === 'savePageWithDescription') {
    // Aktuelle Seite
    chrome.action.openPopup();
  }
});
*/

// Optional: Keyboard Shortcut Handler
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'save-current-page') {
    // Öffne das Popup
    chrome.action.openPopup();
  }
});

// Message Handler (falls benötigt)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarks') {
    chrome.storage.sync.get(['bookmarks'], (result) => {
      sendResponse({ bookmarks: result.bookmarks || [] });
    });
    return true; // Für asynchrone Antwort
  }

  if (request.action === 'saveBookmark') {
    chrome.storage.sync.get(['bookmarks'], (result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(request.bookmark);
      chrome.storage.sync.set({ bookmarks }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

// Storage Änderungen überwachen (für Sync zwischen Geräten)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.bookmarks) {
    console.log('Bookmarks wurden synchronisiert');
  }
});

