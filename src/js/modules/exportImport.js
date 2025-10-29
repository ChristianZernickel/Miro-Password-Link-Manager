// Export/Import Modul

export class ExportImportManager {
  constructor() {
    this.importData = null;
  }

  // Daten exportieren
  exportBookmarks(bookmarks, tags) {
    try {
      const exportData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        bookmarks: bookmarks,
        metadata: {
          totalBookmarks: bookmarks.length,
          totalTags: tags.size,
          tags: Array.from(tags)
        }
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `miro-bookmarks-${timestamp}.json`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
      return { success: true, filename };
    } catch (error) {
      console.error('Fehler beim Export:', error);
      throw error;
    }
  }

  // Import-Datei lesen
  async readImportFile(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
        throw new Error('Ungültige Datei-Struktur');
      }

      this.importData = data.bookmarks;
      return {
        success: true,
        count: this.importData.length,
        data: this.importData
      };
    } catch (error) {
      console.error('Fehler beim Lesen der Datei:', error);
      throw error;
    }
  }

  // Import durchführen
  importBookmarks(currentBookmarks, mode) {
    if (!this.importData || this.importData.length === 0) {
      throw new Error('Keine Daten zum Importieren');
    }

    let newBookmarks = [];

    switch (mode) {
      case 'replace':
        // Alle löschen und neu importieren
        newBookmarks = this.importData.map(b => ({
          id: b.id || this.generateId(),
          url: b.url,
          title: b.title,
          description: b.description || '',
          tags: Array.isArray(b.tags) ? b.tags : [],
          favicon: b.favicon || null,
          createdAt: b.createdAt || Date.now(),
          updatedAt: b.updatedAt || Date.now()
        }));
        break;

      case 'merge':
        // Zusammenführen, Duplikate überspringen
        newBookmarks = [...currentBookmarks];
        const existingUrls = new Set(currentBookmarks.map(b => b.url));

        this.importData.forEach(bookmark => {
          if (!existingUrls.has(bookmark.url)) {
            newBookmarks.push({
              id: this.generateId(),
              url: bookmark.url,
              title: bookmark.title,
              description: bookmark.description || '',
              tags: Array.isArray(bookmark.tags) ? bookmark.tags : [],
              favicon: bookmark.favicon || null,
              createdAt: bookmark.createdAt || Date.now(),
              updatedAt: Date.now()
            });
          }
        });
        break;

      case 'update':
        // Zusammenführen, Duplikate aktualisieren
        const urlMap = new Map(currentBookmarks.map(b => [b.url, b]));

        this.importData.forEach(bookmark => {
          const existing = urlMap.get(bookmark.url);
          if (existing) {
            Object.assign(existing, {
              title: bookmark.title,
              description: bookmark.description || existing.description,
              tags: Array.isArray(bookmark.tags) ? bookmark.tags : (existing.tags || []),
              favicon: bookmark.favicon || existing.favicon,
              updatedAt: Date.now()
            });
          } else {
            currentBookmarks.push({
              id: this.generateId(),
              url: bookmark.url,
              title: bookmark.title,
              description: bookmark.description || '',
              tags: Array.isArray(bookmark.tags) ? bookmark.tags : [],
              favicon: bookmark.favicon || null,
              createdAt: bookmark.createdAt || Date.now(),
              updatedAt: Date.now()
            });
          }
        });
        newBookmarks = currentBookmarks;
        break;

      default:
        throw new Error('Ungültiger Import-Modus');
    }

    // Reset import data
    this.importData = null;

    console.log(`Import erfolgreich: ${newBookmarks.length} Bookmarks`);
    return newBookmarks;
  }

  // ID generieren
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Import-Daten zurücksetzen
  reset() {
    this.importData = null;
  }
}

