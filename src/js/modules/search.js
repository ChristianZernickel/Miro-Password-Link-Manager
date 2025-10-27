// Search Modul - Verwaltet Such- und Sortierfunktionalität

export class SearchManager {
  constructor() {
    this.searchQuery = '';
    this.sortBy = 'date-desc';
    this.debounceTimer = null;
  }

  // Suchbegriff setzen mit Debounce
  setSearchQuery(query, callback, debounceMs = 300) {
    const trimmedQuery = query.trim().toLowerCase();

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.searchQuery = trimmedQuery;
      if (callback) callback();
    }, debounceMs);
  }

  // Suchbegriff direkt setzen
  setSearchQueryImmediate(query) {
    this.searchQuery = query.trim().toLowerCase();
  }

  // Suche zurücksetzen
  clearSearch() {
    this.searchQuery = '';
  }

  // Sortierung setzen
  setSortBy(sortBy) {
    this.sortBy = sortBy;
  }

  // Bookmarks nach Suchbegriff filtern
  filterBookmarks(bookmarks) {
    if (!this.searchQuery) {
      return bookmarks;
    }

    return bookmarks.filter(bookmark => {
      const title = bookmark.title.toLowerCase();
      const url = bookmark.url.toLowerCase();
      const description = bookmark.description.toLowerCase();
      const tags = bookmark.tags ? bookmark.tags.join(' ').toLowerCase() : '';

      return title.includes(this.searchQuery) ||
             url.includes(this.searchQuery) ||
             description.includes(this.searchQuery) ||
             tags.includes(this.searchQuery);
    });
  }

  // Bookmarks sortieren
  sortBookmarks(bookmarks) {
    const sorted = [...bookmarks];

    switch (this.sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'date-asc':
        return sorted.sort((a, b) => a.createdAt - b.createdAt);
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'de'));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'de'));
      default:
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
  }

  // Komplette Filter-Pipeline
  applyFiltersAndSort(bookmarks) {
    let filtered = this.filterBookmarks(bookmarks);
    return this.sortBookmarks(filtered);
  }
}

