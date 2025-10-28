// Hauptdatei - Importiert Module und koordiniert die UI

import { loadBookmarks, saveBookmarks, getCurrentTab } from './modules/storage.js';
import { TagsManager } from './modules/tags.js';
import { SearchManager } from './modules/search.js';
import { ExportImportManager } from './modules/exportImport.js';
import { ThemeManager } from './modules/theme.js';
import { KeyboardManager } from './modules/keyboard.js';
import {
  generateId,
  formatDate,
  escapeHtml,
  getFallbackFavicon,
  renderFavicon,
  renderTags,
  showMessage
} from './modules/utils.js';

// State
let currentBookmarks = [];
let editingBookmarkId = null;

// Manager Instanzen
const tagsManager = new TagsManager();
const searchManager = new SearchManager();
const exportImportManager = new ExportImportManager();
const themeManager = new ThemeManager();

// DOM Elemente
const elements = {
  saveCurrentBtn: document.getElementById('saveCurrentBtn'),
  bookmarksList: document.getElementById('bookmarksList'),
  emptyState: document.getElementById('emptyState'),
  modal: document.getElementById('modal'),
  confirmModal: document.getElementById('confirmModal'),
  importModal: document.getElementById('importModal'),
  modalTitle: document.getElementById('modalTitle'),
  bookmarkForm: document.getElementById('bookmarkForm'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearch'),
  sortSelect: document.getElementById('sortSelect'),
  themeToggle: document.getElementById('themeToggle'),
  settingsToggle: document.getElementById('settingsToggle'),
  settingsPanel: document.getElementById('settingsPanel'),
  tagInput: document.getElementById('tagInput'),
  addTagBtn: document.getElementById('addTagBtn'),
  tagsContainer: document.getElementById('tagsContainer'),
  tagFilterContainer: document.getElementById('tagFilterContainer')
};

// Initialization
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Theme laden
  await themeManager.init();

  // Bookmarks laden
  await loadData();

  // Event Listeners einrichten
  setupEventListeners();

  // Keyboard Shortcuts initialisieren
  const keyboardManager = new KeyboardManager({
    onEscape: handleEscapeKey,
    onNewLink: handleSaveCurrentLink,
    onFocusSearch: () => elements.searchInput?.focus(),
    onExport: handleExport,
    onToggleSettings: toggleSettings,
    isNavigationAllowed: () => !elements.modal.classList.contains('show'),
    onOpenSelected: (index) => {
      const items = document.querySelectorAll('.bookmark-item');
      const item = items[index];
      if (item) {
        handleOpenBookmark(item.dataset.id);
      }
    }
  });
  keyboardManager.init();
}

async function loadData() {
  try {
    currentBookmarks = await loadBookmarks();
    tagsManager.collectAllTags(currentBookmarks);
    renderBookmarks();
    renderTagFilters();
  } catch (error) {
    showMessage('Fehler beim Laden der Bookmarks', 'error');
  }
}

function setupEventListeners() {
  // Core Actions
  elements.saveCurrentBtn?.addEventListener('click', handleSaveCurrentLink);
  elements.bookmarkForm?.addEventListener('submit', handleFormSubmit);

  // Modals
  document.getElementById('modalClose')?.addEventListener('click', () => closeModal());
  document.getElementById('cancelBtn')?.addEventListener('click', () => closeModal());
  document.getElementById('confirmCancel')?.addEventListener('click', () => closeConfirmModal());

  // Tags
  elements.addTagBtn?.addEventListener('click', handleAddTag);
  elements.tagInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  });

  // Search & Sort
  elements.searchInput?.addEventListener('input', (e) => {
    searchManager.setSearchQuery(e.target.value, renderBookmarks);
    elements.clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
  });

  elements.clearSearchBtn?.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchManager.clearSearch();
    elements.clearSearchBtn.style.display = 'none';
    renderBookmarks();
  });

  elements.sortSelect?.addEventListener('change', (e) => {
    searchManager.setSortBy(e.target.value);
    renderBookmarks();
  });

  // Theme
  elements.themeToggle?.addEventListener('click', () => themeManager.toggle());

  // Settings
  elements.settingsToggle?.addEventListener('click', openSettings);
  document.getElementById('closeSettings')?.addEventListener('click', closeSettings);

  // Export/Import
  document.getElementById('exportBtn')?.addEventListener('click', handleExport);
  document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('importFile')?.click();
  });
  document.getElementById('importFile')?.addEventListener('change', handleImportFile);

  // Import Modal
  document.getElementById('importModalClose')?.addEventListener('click', closeImportModal);
  document.getElementById('importCancel')?.addEventListener('click', closeImportModal);
  document.getElementById('importReplace')?.addEventListener('click', () => handleImport('replace'));
  document.getElementById('importMerge')?.addEventListener('click', () => handleImport('merge'));
  document.getElementById('importUpdate')?.addEventListener('click', () => handleImport('update'));

  // Clear All
  document.getElementById('clearAllBtn')?.addEventListener('click', handleClearAll);

  // Modal Close on outside click
  elements.modal?.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
  });
  elements.confirmModal?.addEventListener('click', (e) => {
    if (e.target === elements.confirmModal) closeConfirmModal();
  });
}

// Render Functions

function renderBookmarks() {
  if (currentBookmarks.length === 0) {
    elements.bookmarksList.innerHTML = '';
    elements.emptyState.classList.add('visible');
    return;
  }

  // Filter Pipeline
  let filtered = tagsManager.filterBookmarks(currentBookmarks);
  filtered = searchManager.filterBookmarks(filtered);

  if (filtered.length === 0) {
    elements.emptyState.classList.remove('visible');
    const msg = tagsManager.activeTags.size > 0 || searchManager.searchQuery
      ? '🔍 Keine Bookmarks gefunden.'
      : '📭 Noch keine Links gespeichert.';
    elements.bookmarksList.innerHTML = `<div class="no-results">${msg}</div>`;
    return;
  }

  elements.emptyState.classList.remove('visible');

  const sorted = searchManager.sortBookmarks(filtered);

  elements.bookmarksList.innerHTML = sorted.map(bookmark => `
    <div class="bookmark-item collapsed" data-id="${bookmark.id}">
      <div class="bookmark-header">
        <span class="bookmark-expand-indicator">▶</span>
        ${renderFavicon(bookmark)}
        <div class="bookmark-info">
          <div class="bookmark-title">${escapeHtml(bookmark.title)}</div>
          <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
        </div>
        <div class="bookmark-actions">
          <button class="icon-btn edit-btn" data-id="${bookmark.id}">✏️</button>
          <button class="icon-btn delete-btn" data-id="${bookmark.id}">🗑️</button>
        </div>
      </div>
      ${renderTags(bookmark.tags)}
      <div class="bookmark-description">${escapeHtml(bookmark.description)}</div>
      <div class="bookmark-date">${formatDate(bookmark.createdAt)}</div>
    </div>
  `).join('');

  // Attach event listeners
  document.querySelectorAll('.bookmark-item').forEach(item => {
    // Click auf Expand-Indicator -> Aufklappen
    item.querySelector('.bookmark-expand-indicator')?.addEventListener('click', (e) => {
      e.stopPropagation(); // Verhindert Bubble zum bookmark-item
      item.classList.toggle('collapsed');
      item.classList.toggle('expanded');
    });

    // Click auf Bookmark (außer Buttons) -> Link öffnen
    item.addEventListener('click', (e) => {
      // Ignoriere Clicks auf Buttons und Expand-Indicator
      if (!e.target.closest('.icon-btn') && !e.target.closest('.bookmark-expand-indicator')) {
        handleOpenBookmark(item.dataset.id);
      }
    });
  });

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

function renderTagFilters() {
  if (!elements.tagFilterContainer) return;

  if (tagsManager.currentTags.size === 0) {
    elements.tagFilterContainer.style.display = 'none';
    return;
  }

  elements.tagFilterContainer.style.display = 'flex';

  const sortedTags = Array.from(tagsManager.currentTags).sort();

  let html = '<div class="tag-filters-label">Filter:</div>';

  if (tagsManager.activeTags.size > 0) {
    html += '<button class="tag-filter-chip clear-filter" id="clearTagFilter">✕ Alle anzeigen</button>';
  }

  html += sortedTags.map(tag => {
    const isActive = tagsManager.activeTags.has(tag);
    return `<button class="tag-filter-chip ${isActive ? 'active' : ''}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
  }).join('');

  elements.tagFilterContainer.innerHTML = html;

  // Event listeners
  elements.tagFilterContainer.querySelectorAll('.tag-filter-chip[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      tagsManager.toggleTagFilter(btn.dataset.tag);
      renderBookmarks();
      renderTagFilters();
    });
  });

  document.getElementById('clearTagFilter')?.addEventListener('click', () => {
    tagsManager.clearFilters();
    renderBookmarks();
    renderTagFilters();
  });
}

function renderTempTags() {
  if (!elements.tagsContainer) return;

  if (tagsManager.tempTags.length === 0) {
    elements.tagsContainer.innerHTML = '<div class="tags-empty">Noch keine Tags hinzugefügt</div>';
    return;
  }

  elements.tagsContainer.innerHTML = tagsManager.tempTags.map(tag => `
    <span class="tag-chip">
      <span class="tag-text">${escapeHtml(tag)}</span>
      <button type="button" class="tag-remove" data-tag="${escapeHtml(tag)}">&times;</button>
    </span>
  `).join('');

  elements.tagsContainer.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      tagsManager.removeTag(btn.dataset.tag);
      renderTempTags();
    });
  });
}

// Action Handlers

async function handleSaveCurrentLink() {
  try {
    const tab = await getCurrentTab();
    if (!tab?.url) {
      showMessage('Keine gültige URL gefunden', 'error');
      return;
    }

    editingBookmarkId = null;
    tagsManager.resetTempTags();

    document.getElementById('modalTitle').textContent = 'Link speichern';
    document.getElementById('bookmarkUrl').value = tab.url;
    document.getElementById('bookmarkTitle').value = tab.title || '';
    document.getElementById('bookmarkDescription').value = '';
    elements.tagInput.value = '';

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
    showMessage('Fehler beim Abrufen der URL', 'error');
  }
}

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
    const faviconPreview = document.getElementById('faviconPreview');
    const favicon = faviconPreview?.style.display !== 'none'
      ? faviconPreview.src
      : getFallbackFavicon(url);

    if (editingBookmarkId) {
      const index = currentBookmarks.findIndex(b => b.id === editingBookmarkId);
      if (index !== -1) {
        currentBookmarks[index] = {
          ...currentBookmarks[index],
          title,
          description,
          tags: [...tagsManager.tempTags],
          favicon: favicon || currentBookmarks[index].favicon,
          updatedAt: Date.now()
        };
      }
      showMessage('✓ Bookmark aktualisiert', 'success');
    } else {
      currentBookmarks.push({
        id: generateId(),
        url,
        title,
        description,
        tags: [...tagsManager.tempTags],
        favicon,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      showMessage('✓ Bookmark gespeichert', 'success');
    }

    await saveBookmarks(currentBookmarks);
    tagsManager.collectAllTags(currentBookmarks);
    renderBookmarks();
    renderTagFilters();
    closeModal();
  } catch (error) {
    showMessage('Fehler beim Speichern', 'error');
  }
}

function handleAddTag() {
  if (!elements.tagInput) return;

  try {
    tagsManager.addTag(elements.tagInput.value);
    renderTempTags();
    elements.tagInput.value = '';
    elements.tagInput.focus();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function handleOpenBookmark(bookmarkId) {
  const bookmark = currentBookmarks.find(b => b.id === bookmarkId);
  if (!bookmark) return;

  try {
    await navigator.clipboard.writeText(bookmark.description);
    await chrome.tabs.create({ url: bookmark.url });
    showMessage('✓ Link geöffnet & Beschreibung kopiert', 'success');
  } catch (error) {
    showMessage('Fehler beim Öffnen des Links', 'error');
  }
}

function handleEditBookmark(bookmarkId) {
  const bookmark = currentBookmarks.find(b => b.id === bookmarkId);
  if (!bookmark) return;

  editingBookmarkId = bookmarkId;
  tagsManager.setTempTags(bookmark.tags);

  document.getElementById('modalTitle').textContent = 'Link bearbeiten';
  document.getElementById('bookmarkUrl').value = bookmark.url;
  document.getElementById('bookmarkTitle').value = bookmark.title;
  document.getElementById('bookmarkDescription').value = bookmark.description;
  elements.tagInput.value = '';

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

function handleDeleteBookmark(bookmarkId) {
  elements.confirmModal.classList.add('show');

  const confirmHandler = async () => {
    try {
      currentBookmarks = currentBookmarks.filter(b => b.id !== bookmarkId);
      await saveBookmarks(currentBookmarks);
      tagsManager.collectAllTags(currentBookmarks);
      renderBookmarks();
      renderTagFilters();
      showMessage('✓ Bookmark gelöscht', 'success');
    } catch (error) {
      showMessage('Fehler beim Löschen', 'error');
    }

    closeConfirmModal();
    document.getElementById('confirmDelete').removeEventListener('click', confirmHandler);
  };

  document.getElementById('confirmDelete').addEventListener('click', confirmHandler);
}

// Settings

function openSettings() {
  updateStatistics();
  elements.settingsPanel?.classList.add('show');
}

function closeSettings() {
  elements.settingsPanel?.classList.remove('show');
}

function toggleSettings() {
  if (elements.settingsPanel?.classList.contains('show')) {
    closeSettings();
  } else {
    openSettings();
  }
}

function updateStatistics() {
  const statBookmarks = document.getElementById('statBookmarks');
  const statTags = document.getElementById('statTags');

  if (statBookmarks) statBookmarks.textContent = currentBookmarks.length;
  if (statTags) statTags.textContent = tagsManager.currentTags.size;
}

// Export/Import

function handleExport() {
  try {
    const result = exportImportManager.exportBookmarks(
      currentBookmarks,
      tagsManager.currentTags
    );
    showMessage('✓ Bookmarks exportiert', 'success');
    closeSettings();
  } catch (error) {
    showMessage('Fehler beim Export', 'error');
  }
}

async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const result = await exportImportManager.readImportFile(file);
    document.getElementById('importCount').textContent = result.count;
    elements.importModal.classList.add('show');
  } catch (error) {
    showMessage('Fehler beim Lesen der Datei', 'error');
  }

  e.target.value = '';
}

async function handleImport(mode) {
  try {
    currentBookmarks = exportImportManager.importBookmarks(currentBookmarks, mode);
    await saveBookmarks(currentBookmarks);

    tagsManager.collectAllTags(currentBookmarks);
    renderBookmarks();
    renderTagFilters();

    const message = mode === 'replace'
      ? '✓ Bookmarks importiert (ersetzt)'
      : '✓ Import abgeschlossen';

    showMessage(message, 'success');
    closeImportModal();
    closeSettings();
  } catch (error) {
    showMessage(error.message || 'Fehler beim Import', 'error');
  }
}

async function handleClearAll() {
  const confirmed = confirm(
    '⚠️ ACHTUNG: Alle Bookmarks werden unwiderruflich gelöscht!\n\n' +
    'Möchtest du vorher exportieren?'
  );

  if (!confirmed) return;

  const reallyConfirmed = confirm(
    'Wirklich ALLE Daten löschen?\n\n' +
    'Diese Aktion kann nicht rückgängig gemacht werden!'
  );

  if (!reallyConfirmed) return;

  try {
    currentBookmarks = [];
    await saveBookmarks([]);
    tagsManager.collectAllTags([]);
    renderBookmarks();
    renderTagFilters();
    showMessage('✓ Alle Daten gelöscht', 'success');
    closeSettings();
  } catch (error) {
    showMessage('Fehler beim Löschen', 'error');
  }
}

// Modal Controls

function openModal() {
  elements.modal?.classList.add('show');
}

function closeModal() {
  elements.modal?.classList.remove('show');
  editingBookmarkId = null;
  tagsManager.resetTempTags();
  document.getElementById('bookmarkForm')?.reset();
  if (elements.tagsContainer) elements.tagsContainer.innerHTML = '';

  const faviconPreview = document.getElementById('faviconPreview');
  if (faviconPreview) faviconPreview.style.display = 'none';
}

function closeConfirmModal() {
  elements.confirmModal?.classList.remove('show');
}

function closeImportModal() {
  elements.importModal?.classList.remove('show');
  exportImportManager.reset();
}

function handleEscapeKey() {
  if (elements.modal?.classList.contains('show')) {
    closeModal();
  } else if (elements.importModal?.classList.contains('show')) {
    closeImportModal();
  } else if (elements.confirmModal?.classList.contains('show')) {
    closeConfirmModal();
  } else if (elements.settingsPanel?.classList.contains('show')) {
    closeSettings();
  } else if (elements.searchInput?.value) {
    elements.searchInput.value = '';
    searchManager.clearSearch();
    elements.clearSearchBtn.style.display = 'none';
    renderBookmarks();
    elements.searchInput.blur();
  }
}


