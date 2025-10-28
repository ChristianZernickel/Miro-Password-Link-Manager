// Background Script für Firefox (Manifest V2)

// Installation Event
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Miro Link Plugin installiert!');

    // Initialisiere Storage mit leerem Array
    browser.storage.sync.get(['bookmarks']).then((result) => {
      if (!result.bookmarks) {
        browser.storage.sync.set({ bookmarks: [] });
      }
    });
  } else if (details.reason === 'update') {
    console.log('Miro Link Plugin aktualisiert!');
  }

  // Context Menu Integration (Rechtsklick)
  browser.contextMenus.create({
    id: 'save-link',
    title: '🔖 Link in Miro speichern',
    contexts: ['link']
  });

  browser.contextMenus.create({
    id: 'save-page',
    title: '🔖 Seite in Miro speichern',
    contexts: ['page']
  });

  browser.contextMenus.create({
    id: 'save-selection',
    title: '🔖 "%s" in Miro speichern',
    contexts: ['selection']
  });
});

// Context Menu Click Handler
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    let url = '';
    let title = '';
    let description = '';

    switch (info.menuItemId) {
      case 'save-link':
        url = info.linkUrl;
        title = info.linkUrl.split('/').pop() || 'Link';
        // Firefox: executeScript für Prompt
        browser.tabs.executeScript(tab.id, {
          code: `
            (function() {
              const description = prompt(
                '🔖 Link speichern: ${title.replace(/'/g, "\\'")}\\n\\nPasswort/Hinweis eingeben:',
                ''
              );
              if (description !== null) {
                browser.runtime.sendMessage({
                  action: 'saveFromContextMenu',
                  data: { 
                    url: '${url.replace(/'/g, "\\'")}', 
                    title: '${title.replace(/'/g, "\\'")}', 
                    description 
                  }
                });
              }
            })();
          `
        });
        return;

      case 'save-page':
        url = tab.url;
        title = tab.title;
        browser.tabs.executeScript(tab.id, {
          code: `
            (function() {
              const description = prompt(
                '🔖 Seite speichern: ${title.replace(/'/g, "\\'")}\\n\\nPasswort/Hinweis eingeben:',
                ''
              );
              if (description !== null) {
                browser.runtime.sendMessage({
                  action: 'saveFromContextMenu',
                  data: { 
                    url: '${url.replace(/'/g, "\\'")}', 
                    title: '${title.replace(/'/g, "\\'")}', 
                    description 
                  }
                });
              }
            })();
          `
        });
        return;

      case 'save-selection':
        url = tab.url;
        title = tab.title;
        description = info.selectionText || '';
        browser.tabs.executeScript(tab.id, {
          code: `
            (function() {
              const description = prompt(
                '🔖 "${description.substring(0, 50).replace(/'/g, "\\'")}..." speichern\\n\\nPasswort/Text bearbeiten:',
                '${description.replace(/'/g, "\\'")}'
              );
              if (description !== null) {
                browser.runtime.sendMessage({
                  action: 'saveFromContextMenu',
                  data: { 
                    url: '${url.replace(/'/g, "\\'")}', 
                    title: '${title.replace(/'/g, "\\'")}', 
                    description 
                  }
                });
              }
            })();
          `
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

// Message Handler (für Kommunikation mit popup)
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getBookmarks') {
    browser.storage.sync.get(['bookmarks']).then((result) => {
      sendResponse({ bookmarks: result.bookmarks || [] });
    });
    return true;
  }

  if (request.action === 'saveBookmark') {
    browser.storage.sync.get(['bookmarks']).then((result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(request.bookmark);
      browser.storage.sync.set({ bookmarks }).then(() => {
        sendResponse({ success: true });
      });
    });
    return true;
  }

  // Handler für Context Menu Speichern mit Beschreibung
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
    browser.storage.sync.get(['bookmarks']).then((result) => {
      const bookmarks = result.bookmarks || [];
      bookmarks.push(newBookmark);
      browser.storage.sync.set({ bookmarks }).then(() => {
        // Notification anzeigen
        browser.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icons/icon48.png',
          title: 'Miro Links',
          message: `✓ "${title}" gespeichert`
        });
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

// Keyboard Shortcut Handler
if (browser.commands) {
  browser.commands.onCommand.addListener((command) => {
    if (command === 'save-current-page') {
      browser.browserAction.openPopup();
    }
  });
}

// Storage Änderungen überwachen (für Sync zwischen Geräten)
browser.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.bookmarks) {
    console.log('Bookmarks wurden synchronisiert');
  }
});

