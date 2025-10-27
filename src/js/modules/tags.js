// Tags Modul - Verwaltet Tag-Funktionalität

export class TagsManager {
  constructor() {
    this.currentTags = new Set();
    this.activeTags = new Set();
    this.tempTags = [];
  }

  // Alle Tags aus Bookmarks sammeln
  collectAllTags(bookmarks) {
    this.currentTags = new Set();
    bookmarks.forEach(bookmark => {
      if (bookmark.tags && Array.isArray(bookmark.tags)) {
        bookmark.tags.forEach(tag => this.currentTags.add(tag));
      }
    });
    return this.currentTags;
  }

  // Tag hinzufügen
  addTag(tagValue) {
    const tag = tagValue.trim().toLowerCase();

    // Validierung
    if (!tag) {
      throw new Error('Tag darf nicht leer sein');
    }

    if (tag.length < 2 || tag.length > 20) {
      throw new Error('Tag muss zwischen 2 und 20 Zeichen lang sein');
    }

    if (!/^[a-zäöüß0-9\-_]+$/.test(tag)) {
      throw new Error('Tag darf nur Buchstaben, Zahlen, - und _ enthalten');
    }

    if (this.tempTags.includes(tag)) {
      throw new Error('Tag bereits hinzugefügt');
    }

    if (this.tempTags.length >= 5) {
      throw new Error('Maximal 5 Tags pro Bookmark');
    }

    this.tempTags.push(tag);
    return this.tempTags;
  }

  // Tag entfernen
  removeTag(tag) {
    this.tempTags = this.tempTags.filter(t => t !== tag);
    return this.tempTags;
  }

  // Temp Tags setzen
  setTempTags(tags) {
    this.tempTags = tags ? [...tags] : [];
    return this.tempTags;
  }

  // Temp Tags zurücksetzen
  resetTempTags() {
    this.tempTags = [];
  }

  // Tag-Filter umschalten
  toggleTagFilter(tag) {
    if (this.activeTags.has(tag)) {
      this.activeTags.delete(tag);
    } else {
      this.activeTags.add(tag);
    }
    return this.activeTags;
  }

  // Filter zurücksetzen
  clearFilters() {
    this.activeTags.clear();
  }

  // Bookmarks nach Tags filtern (AND-Verknüpfung)
  filterBookmarks(bookmarks) {
    if (this.activeTags.size === 0) {
      return bookmarks;
    }

    return bookmarks.filter(bookmark => {
      if (!bookmark.tags || bookmark.tags.length === 0) {
        return false;
      }
      return Array.from(this.activeTags).every(tag => bookmark.tags.includes(tag));
    });
  }
}

