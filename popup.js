// Globale Variablen
let currentBookmarks = [];
let editingBookmarkId = null;
let currentTags = new Set(); // Alle verfügbaren Tags
let activeTags = new Set(); // Aktuell aktive Filter-Tags
let tempTags = []; // Temporäre Tags während der Bearbeitung
let searchQuery = ''; // Aktuelle Suchanfrage
let sortBy = 'date-desc'; // Aktuelle Sortierung
let searchDebounceTimer = null; // Timer für Debounce
let currentTheme = 'light'; // Aktuelles Theme

// DOM Elemente
const saveCurrentBtn = document.getElementById('saveCurrentBtn');
const bookmarksList = document.getElementById('bookmarksList');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const confirmModal = document.getElementById('confirmModal');
const modalTitle = document.getElementById('modalTitle');
const bookmarkForm = document.getElementById('bookmarkForm');
const modalClose = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelBtn');
const confirmCancel = document.getElementById('confirmCancel');
const confirmDelete = document.getElementById('confirmDelete');
const messageDiv = document.getElementById('message');
const tagInput = document.getElementById('tagInput');
const addTagBtn = document.getElementById('addTagBtn');
const tagsContainer = document.getElementById('tagsContainer');
const tagFilterContainer = document.getElementById('tagFilterContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const sortSelect = document.getElementById('sortSelect');
const themeToggle = document.getElementById('themeToggle');

// Event Listeners initialisieren
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Theme laden
  loadTheme();

  // Bookmarks laden
  loadBookmarks();

  // Event Listeners
  saveCurrentBtn.addEventListener('click', handleSaveCurrentLink);
  bookmarkForm.addEventListener('submit', handleFormSubmit);
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  confirmCancel.addEventListener('click', closeConfirmModal);

  // Tag Event Listeners
  if (addTagBtn) addTagBtn.addEventListener('click', handleAddTag);
  if (tagInput) {
    tagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    });
  }

  // Such- und Sort-Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderBookmarks();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderBookmarks();
    });
  }

  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Modal schließen bei Klick außerhalb
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) closeConfirmModal();
  });
}

// Aktuellen Tab holen
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// Bookmarks aus Storage laden
async function loadBookmarks() {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    currentBookmarks = result.bookmarks || [];

    // Migration: Tags-Array für alte Bookmarks hinzufügen
    let needsUpdate = false;
    currentBookmarks = currentBookmarks.map(bookmark => {
      if (!bookmark.tags) {
        needsUpdate = true;
        return { ...bookmark, tags: [] };
      }
      return bookmark;
    });

    // Wenn Migration stattgefunden hat, speichern
    if (needsUpdate) {
      await chrome.storage.sync.set({ bookmarks: currentBookmarks });
    }

    // Alle verfügbaren Tags sammeln
    collectAllTags();

    renderBookmarks();
    renderTagFilters();
  } catch (error) {
    console.error('Fehler beim Laden der Bookmarks:', error);
    showMessage('Fehler beim Laden der Bookmarks', 'error');
  }
}

// Bookmarks anzeigen
function renderBookmarks() {
  if (currentBookmarks.length === 0) {
    bookmarksList.innerHTML = '';
    emptyState.classList.add('visible');
    return;
  }

  // Nach Tags filtern
  let filteredBookmarks = filterBookmarksByTags(currentBookmarks);

  // Nach Suchbegriff filtern
  if (searchQuery) {
    filteredBookmarks = filterBookmarksBySearch(filteredBookmarks);
  }

  if (filteredBookmarks.length === 0) {
    emptyState.classList.remove('visible');
    const noResultsMsg = activeTags.size > 0 || searchQuery
      ? '🔍 Keine Bookmarks gefunden. Versuche andere Filter oder Suchbegriffe.'
      : '📭 Noch keine Links gespeichert.';
    bookmarksList.innerHTML = `<div class="no-results">${noResultsMsg}</div>`;
    return;
  }

  emptyState.classList.remove('visible');

  // Sortieren
  const sortedBookmarks = sortBookmarks(filteredBookmarks);

  bookmarksList.innerHTML = sortedBookmarks.map(bookmark => `
    <div class="bookmark-item collapsed" data-id="${bookmark.id}">
      <div class="bookmark-header">
        <span class="bookmark-expand-indicator">▶</span>
        ${renderFavicon(bookmark)}
        <div class="bookmark-info">
          <div class="bookmark-title">${escapeHtml(bookmark.title)}</div>
          <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
        </div>
        <div class="bookmark-actions">
          <button class="icon-btn edit-btn" data-id="${bookmark.id}" title="Bearbeiten">✏️</button>
          <button class="icon-btn delete-btn" data-id="${bookmark.id}" title="Löschen">🗑️</button>
        </div>
      </div>
      ${renderBookmarkTags(bookmark.tags)}
      <div class="bookmark-description">${escapeHtml(bookmark.description)}</div>
      <div class="bookmark-date">${formatDate(bookmark.createdAt)}</div>
    </div>
  `).join('');

  // Event Listeners für Bookmark-Items
  document.querySelectorAll('.bookmark-item').forEach(item => {
    const bookmarkId = item.dataset.id;

    // Klick auf Header oder Expand-Indikator zum Aufklappen
    const header = item.querySelector('.bookmark-header');

    // Toggle expand/collapse beim Klick auf Header-Bereich (aber nicht auf Buttons)
    header.addEventListener('click', (e) => {
      if (!e.target.closest('.icon-btn')) {
        e.stopPropagation();
        item.classList.toggle('collapsed');
        item.classList.toggle('expanded');
      }
    });

    // Klick auf Beschreibung/Body zum Öffnen des Bookmarks
    const description = item.querySelector('.bookmark-description');
    if (description) {
      description.addEventListener('click', (e) => {
        e.stopPropagation();
        handleOpenBookmark(bookmarkId);
      });
    }
  });

  // Event Listeners für Buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleEditBookmark(btn.dataset.id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteBookmark(btn.dataset.id);
    });
  });
}

// Aktuellen Link speichern
async function handleSaveCurrentLink() {
  try {
    const tab = await getCurrentTab();

    if (!tab || !tab.url) {
      showMessage('Keine gültige URL gefunden', 'error');
      return;
    }

    // Modal öffnen mit aktueller URL
    editingBookmarkId = null;
    tempTags = [];
    modalTitle.textContent = 'Link speichern';
    document.getElementById('bookmarkUrl').value = tab.url;
    document.getElementById('bookmarkTitle').value = tab.title || '';
    document.getElementById('bookmarkDescription').value = '';
    if (tagInput) tagInput.value = '';

    // Favicon erfassen
    const favicon = tab.favIconUrl || getFallbackFavicon(tab.url);
    const faviconPreview = document.getElementById('faviconPreview');
    if (faviconPreview && favicon) {
      faviconPreview.src = favicon;
      faviconPreview.style.display = 'inline-block';
    }

    renderTempTags();
    document.getElementById('bookmarkDescription').focus();

    openModal();
  } catch (error) {
    console.error('Fehler beim Abrufen des aktuellen Tabs:', error);
    showMessage('Fehler beim Abrufen der URL', 'error');
  }
}

// Bookmark öffnen
async function handleOpenBookmark(bookmarkId) {
  const bookmark = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmark) return;

  try {
    // Beschreibung in Zwischenablage kopieren
    await navigator.clipboard.writeText(bookmark.description);

    // Link in neuem Tab öffnen
    await chrome.tabs.create({ url: bookmark.url });

    showMessage('✓ Link geöffnet & Beschreibung kopiert', 'success');
  } catch (error) {
    console.error('Fehler beim Öffnen des Bookmarks:', error);
    showMessage('Fehler beim Öffnen des Links', 'error');
  }
}

// Bookmark bearbeiten
function handleEditBookmark(bookmarkId) {
  const bookmark = currentBookmarks.find(b => b.id === bookmarkId);

  if (!bookmark) return;

  editingBookmarkId = bookmarkId;
  tempTags = bookmark.tags ? [...bookmark.tags] : [];
  modalTitle.textContent = 'Link bearbeiten';
  document.getElementById('bookmarkUrl').value = bookmark.url;
  document.getElementById('bookmarkTitle').value = bookmark.title;
  document.getElementById('bookmarkDescription').value = bookmark.description;
  if (tagInput) tagInput.value = '';

  // Favicon anzeigen
  const faviconPreview = document.getElementById('faviconPreview');
  if (faviconPreview) {
    const favicon = bookmark.favicon || getFallbackFavicon(bookmark.url);
    if (favicon) {
      faviconPreview.src = favicon;
      faviconPreview.style.display = 'inline-block';
    }
  }

  renderTempTags();

  openModal();
}

// Bookmark löschen (mit Bestätigung)
function handleDeleteBookmark(bookmarkId) {
  // Bestätigungs-Modal öffnen
  confirmModal.classList.add('show');

  // Einmaliger Event Listener für Bestätigung
  const confirmHandler = async () => {
    try {
      currentBookmarks = currentBookmarks.filter(b => b.id !== bookmarkId);
      await chrome.storage.sync.set({ bookmarks: currentBookmarks });
      collectAllTags();
      renderBookmarks();
      renderTagFilters();
      showMessage('✓ Bookmark gelöscht', 'success');
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      showMessage('Fehler beim Löschen', 'error');
    }

    closeConfirmModal();
    confirmDelete.removeEventListener('click', confirmHandler);
  };

  confirmDelete.addEventListener('click', confirmHandler);
}

// Form Submit Handler
async function handleFormSubmit(e) {
  e.preventDefault();

  const url = document.getElementById('bookmarkUrl').value;
  const title = document.getElementById('bookmarkTitle').value.trim();
  const description = document.getElementById('bookmarkDescription').value.trim();

  if (!url || !title || !description) {
    showMessage('Bitte alle Felder ausfüllen', 'error');
    return;
  }

  try {
    // Favicon erfassen
    const faviconPreview = document.getElementById('faviconPreview');
    const favicon = faviconPreview && faviconPreview.style.display !== 'none'
      ? faviconPreview.src
      : getFallbackFavicon(url);

    if (editingBookmarkId) {
      // Bearbeiten
      const index = currentBookmarks.findIndex(b => b.id === editingBookmarkId);
      if (index !== -1) {
        currentBookmarks[index] = {
          ...currentBookmarks[index],
          title,
          description,
          tags: [...tempTags],
          favicon: favicon || currentBookmarks[index].favicon,
          updatedAt: Date.now()
        };
      }
      showMessage('✓ Bookmark aktualisiert', 'success');
    } else {
      // Neu erstellen
      const newBookmark = {
        id: generateId(),
        url,
        title,
        description,
        tags: [...tempTags],
        favicon,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      currentBookmarks.push(newBookmark);
      showMessage('✓ Bookmark gespeichert', 'success');
    }

    await chrome.storage.sync.set({ bookmarks: currentBookmarks });
    collectAllTags();
    renderBookmarks();
    renderTagFilters();
    closeModal();
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    showMessage('Fehler beim Speichern', 'error');
  }
}

// Modal öffnen
function openModal() {
  modal.classList.add('show');
  document.getElementById('bookmarkDescription').focus();
}

// Modal schließen
function closeModal() {
  modal.classList.remove('show');
  editingBookmarkId = null;
  tempTags = [];
  bookmarkForm.reset();
  if (tagsContainer) tagsContainer.innerHTML = '';
  const faviconPreview = document.getElementById('faviconPreview');
  if (faviconPreview) faviconPreview.style.display = 'none';
}

// Bestätigungs-Modal schließen
function closeConfirmModal() {
  confirmModal.classList.remove('show');
}

// Nachricht anzeigen
function showMessage(text, type = 'success') {
  messageDiv.textContent = text;
  messageDiv.className = `message show ${type}`;

  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

// Hilfsfunktionen

// Eindeutige ID generieren
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Datum formatieren
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Weniger als 1 Minute
  if (diff < 60000) {
    return 'Gerade eben';
  }

  // Weniger als 1 Stunde
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  }

  // Weniger als 24 Stunden
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  }

  // Weniger als 7 Tage
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Vor ${days} Tag${days !== 1 ? 'en' : ''}`;
  }

  // Standard-Datumsformat
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// HTML escapen (XSS-Schutz)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Tag-Management Funktionen

// Alle Tags aus Bookmarks sammeln
function collectAllTags() {
  currentTags = new Set();
  currentBookmarks.forEach(bookmark => {
    if (bookmark.tags && Array.isArray(bookmark.tags)) {
      bookmark.tags.forEach(tag => currentTags.add(tag));
    }
  });
}

// Tag hinzufügen (im Modal)
function handleAddTag() {
  if (!tagInput) return;

  const tagValue = tagInput.value.trim().toLowerCase();

  // Validierung
  if (!tagValue) {
    showMessage('Tag darf nicht leer sein', 'error');
    return;
  }

  if (tagValue.length < 2 || tagValue.length > 20) {
    showMessage('Tag muss zwischen 2 und 20 Zeichen lang sein', 'error');
    return;
  }

  if (!/^[a-zäöüß0-9\-_]+$/.test(tagValue)) {
    showMessage('Tag darf nur Buchstaben, Zahlen, - und _ enthalten', 'error');
    return;
  }

  if (tempTags.includes(tagValue)) {
    showMessage('Tag bereits hinzugefügt', 'error');
    return;
  }

  if (tempTags.length >= 5) {
    showMessage('Maximal 5 Tags pro Bookmark', 'error');
    return;
  }

  // Tag hinzufügen
  tempTags.push(tagValue);
  renderTempTags();
  tagInput.value = '';
  tagInput.focus();
}

// Temporäre Tags im Modal anzeigen
function renderTempTags() {
  if (!tagsContainer) return;

  if (tempTags.length === 0) {
    tagsContainer.innerHTML = '<div class="tags-empty">Noch keine Tags hinzugefügt</div>';
    return;
  }

  tagsContainer.innerHTML = tempTags.map(tag => `
    <span class="tag-chip">
      <span class="tag-text">${escapeHtml(tag)}</span>
      <button type="button" class="tag-remove" data-tag="${escapeHtml(tag)}">&times;</button>
    </span>
  `).join('');

  // Event Listeners für Remove-Buttons
  tagsContainer.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      tempTags = tempTags.filter(t => t !== tag);
      renderTempTags();
    });
  });
}

// Tag-Filter rendern
function renderTagFilters() {
  if (!tagFilterContainer) return;

  if (currentTags.size === 0) {
    tagFilterContainer.style.display = 'none';
    return;
  }

  tagFilterContainer.style.display = 'flex';

  const sortedTags = Array.from(currentTags).sort();

  let html = '<div class="tag-filters-label">Filter:</div>';

  if (activeTags.size > 0) {
    html += '<button class="tag-filter-chip clear-filter" id="clearTagFilter">✕ Alle anzeigen</button>';
  }

  html += sortedTags.map(tag => {
    const isActive = activeTags.has(tag);
    return `
      <button class="tag-filter-chip ${isActive ? 'active' : ''}" data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)}
      </button>
    `;
  }).join('');

  tagFilterContainer.innerHTML = html;

  // Event Listeners für Filter-Chips
  tagFilterContainer.querySelectorAll('.tag-filter-chip[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      toggleTagFilter(tag);
    });
  });

  // Clear Filter Button
  const clearBtn = tagFilterContainer.querySelector('#clearTagFilter');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activeTags.clear();
      renderBookmarks();
      renderTagFilters();
    });
  }
}

// Tag-Filter umschalten
function toggleTagFilter(tag) {
  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
  }
  renderBookmarks();
  renderTagFilters();
}

// Bookmarks nach Tags filtern
function filterBookmarksByTags(bookmarks) {
  if (activeTags.size === 0) {
    return bookmarks;
  }

  return bookmarks.filter(bookmark => {
    if (!bookmark.tags || bookmark.tags.length === 0) {
      return false;
    }
    // AND-Verknüpfung: Bookmark muss alle aktiven Tags haben
    return Array.from(activeTags).every(tag => bookmark.tags.includes(tag));
  });
}

// Tags in Bookmark-Anzeige rendern
function renderBookmarkTags(tags) {
  if (!tags || tags.length === 0) {
    return '';
  }

  return `
    <div class="bookmark-tags">
      ${tags.map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
    </div>
  `;
}

// Favicon-Funktionen

// Suche und Sortierung

// Such-Handler mit Debounce
function handleSearch(e) {
  const value = e.target.value.trim();

  // Clear-Button anzeigen/verstecken
  if (clearSearchBtn) {
    clearSearchBtn.style.display = value ? 'block' : 'none';
  }

  // Debounce
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    searchQuery = value.toLowerCase();
    renderBookmarks();
  }, 300);
}

// Bookmarks nach Suchbegriff filtern
function filterBookmarksBySearch(bookmarks) {
  if (!searchQuery) {
    return bookmarks;
  }

  return bookmarks.filter(bookmark => {
    const title = bookmark.title.toLowerCase();
    const url = bookmark.url.toLowerCase();
    const description = bookmark.description.toLowerCase();
    const tags = bookmark.tags ? bookmark.tags.join(' ').toLowerCase() : '';

    return title.includes(searchQuery) ||
           url.includes(searchQuery) ||
           description.includes(searchQuery) ||
           tags.includes(searchQuery);
  });
}

// Bookmarks sortieren
function sortBookmarks(bookmarks) {
  const sorted = [...bookmarks];

  switch (sortBy) {
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

// Fallback-Favicon generieren (Google Favicon Service)
function getFallbackFavicon(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    return null;
  }
}

// Favicon HTML rendern
function renderFavicon(bookmark) {
  const favicon = bookmark.favicon || getFallbackFavicon(bookmark.url);

  if (!favicon) {
    // Fallback: Ersten Buchstaben als Avatar
    const initial = bookmark.title.charAt(0).toUpperCase();
    return `<div class="favicon-placeholder">${escapeHtml(initial)}</div>`;
  }

  return `<img src="${favicon}" class="bookmark-favicon" alt="Icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="favicon-placeholder" style="display:none;">${escapeHtml(bookmark.title.charAt(0).toUpperCase())}</div>`;
}

// Theme-Management

// Theme laden
async function loadTheme() {
  try {
    const result = await chrome.storage.local.get(['theme']);
    currentTheme = result.theme || 'light';

    // System-Theme erkennen falls kein gespeichertes Theme
    if (!result.theme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }

    applyTheme(currentTheme);
  } catch (error) {
    console.error('Fehler beim Laden des Themes:', error);
  }
}

// Theme anwenden
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  currentTheme = theme;

  // Icon aktualisieren
  if (themeToggle) {
    const icon = themeToggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// Theme umschalten
async function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  try {
    await chrome.storage.local.set({ theme: newTheme });
    applyTheme(newTheme);

    // Sanfte Animation
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      themeToggle.style.transform = '';
    }, 300);
  } catch (error) {
    console.error('Fehler beim Speichern des Themes:', error);
  }
}

