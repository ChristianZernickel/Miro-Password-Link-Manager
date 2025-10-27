// Storage Modul - Verwaltet alle Chrome Storage Operationen

export async function loadBookmarks() {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    let bookmarks = result.bookmarks || [];

    // Migration: Tags-Array für alte Bookmarks hinzufügen
    let needsUpdate = false;
    bookmarks = bookmarks.map(bookmark => {
      if (!bookmark.tags) {
        needsUpdate = true;
        return { ...bookmark, tags: [] };
      }
      return bookmark;
    });

    if (needsUpdate) {
      await saveBookmarks(bookmarks);
    }

    return bookmarks;
  } catch (error) {
    console.error('Fehler beim Laden der Bookmarks:', error);
    throw error;
  }
}

export async function saveBookmarks(bookmarks) {
  try {
    await chrome.storage.sync.set({ bookmarks });
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern der Bookmarks:', error);
    throw error;
  }
}

export async function loadTheme() {
  try {
    const result = await chrome.storage.local.get(['theme']);
    let theme = result.theme || 'light';

    if (!result.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }

    return theme;
  } catch (error) {
    console.error('Fehler beim Laden des Themes:', error);
    return 'light';
  }
}

export async function saveTheme(theme) {
  try {
    await chrome.storage.local.set({ theme });
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern des Themes:', error);
    throw error;
  }
}

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

