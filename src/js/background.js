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

  // Context Menu Integration (Rechtsklick)
  chrome.contextMenus.create({
    id: 'save-link',
    title: '🔖 Link in Miro speichern',
    contexts: ['link']
  });

  chrome.contextMenus.create({
    id: 'save-page',
    title: '🔖 Seite in Miro speichern',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'save-selection',
    title: '🔖 "%s" in Miro speichern',
    contexts: ['selection']
  });
});

// Context Menu Click Handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    let url = '';
    let title = '';
    let description = '';

    switch (info.menuItemId) {
      case 'save-link':
        url = info.linkUrl;
        title = info.linkUrl.split('/').pop() || 'Link';
        // Öffne Popup mit Script für Beschreibungs-Eingabe
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (linkUrl, linkTitle) => {
            const description = prompt(
              `🔖 Link speichern: ${linkTitle}\n\nBeschreibung eingeben:`,
              ''
            );
            if (description !== null) {
              chrome.runtime.sendMessage({
                action: 'saveFromContextMenu',
                data: { url: linkUrl, title: linkTitle, description }
              });
            }
          },
          args: [url, title]
        });
        return; // Früher Return, da async über Message

      case 'save-page':
        url = tab.url;
        title = tab.title;
        // Öffne Popup für Beschreibungs-Eingabe
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (pageUrl, pageTitle) => {
            const description = prompt(
              `🔖 Seite speichern: ${pageTitle}\n\nBeschreibung eingeben:`,
              ''
            );
            if (description !== null) {
              chrome.runtime.sendMessage({
                action: 'saveFromContextMenu',
                data: { url: pageUrl, title: pageTitle, description }
              });
            }
          },
          args: [url, title]
        });
        return;

      case 'save-selection':
        url = tab.url;
        title = tab.title;
        description = info.selectionText || '';
        // Bei Selection Text als Default-Beschreibung verwenden
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (pageUrl, pageTitle, defaultDesc) => {
            const description = prompt(
              `🔖 "${defaultDesc.substring(0, 50)}..." speichern\n\nBeschreibung bearbeiten:`,
              defaultDesc
            );
            if (description !== null) {
              chrome.runtime.sendMessage({
                action: 'saveFromContextMenu',
                data: { url: pageUrl, title: pageTitle, description }
              });
            }
          },
          args: [url, title, description]
        });
        return;

      default:
        return;
    }

  } catch (error) {
    console.error('Fehler beim Speichern via Context Menu:', error);
  }
});

// Hilfsfunktion: Fallback-Favicon generieren
function getFallbackFavicon(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return null;
  }
}

// Keyboard Shortcut Handler
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'save-current-page') {
    chrome.action.openPopup();
  }
});

// Message Handler (für Kommunikation mit popup)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarks') {
    chrome.storage.sync.get(['bookmarks'], (result) => {
      sendResponse({ bookmarks: result.bookmarks || [] });
    });
    return true;
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

  // Neuer Handler für Context Menu Speichern mit Beschreibung
  if (request.action === 'saveFromContextMenu') {
    const { url, title, description } = request.data;

    // Generiere ID
    const bookmarkId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    // Favicon abrufen (vom Tab, falls verfügbar)
    const favicon = sender.tab?.favIconUrl || getFallbackFavicon(url);

    // Erstelle neues Bookmark
    const newBookmark = {
      id: bookmarkId,
      url,
      title,
      description,
      tags: [],
      favicon,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Speichern
    chrome.storage.sync.get(['bookmarks'], (result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(newBookmark);
      chrome.storage.sync.set({ bookmarks }, () => {
        // Notification anzeigen
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icons/icon48.png',
          title: 'Miro Links',
          message: `✓ "${title}" gespeichert`,
          priority: 1
        });
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

