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
  clearAllModal: document.getElementById('clearAllModal'),
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

  // Passwort Toggle im Modal
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordTextarea = document.getElementById('bookmarkDescription');
  let isPasswordVisible = false;

  if (togglePasswordBtn && passwordTextarea) {
    togglePasswordBtn.addEventListener('click', () => {
      isPasswordVisible = !isPasswordVisible;

      if (isPasswordVisible) {
        passwordTextarea.style.filter = 'none';
        passwordTextarea.style.webkitTextSecurity = 'none';
        togglePasswordBtn.textContent = '🙈';
        togglePasswordBtn.classList.remove('hidden');
      } else {
        passwordTextarea.style.filter = 'blur(5px)';
        passwordTextarea.style.webkitTextSecurity = 'disc';
        togglePasswordBtn.textContent = '👁️';
        togglePasswordBtn.classList.add('hidden');
      }
    });

    // Initial obfuskieren
    passwordTextarea.style.filter = 'blur(5px)';
    passwordTextarea.style.webkitTextSecurity = 'disc';
    togglePasswordBtn.classList.add('hidden');

    // Bei Focus automatisch anzeigen
    passwordTextarea.addEventListener('focus', () => {
      if (!isPasswordVisible) {
        togglePasswordBtn.click();
      }
    });
  }

  // Modals
  document.getElementById('modalClose')?.addEventListener('click', () => closeModal());
  document.getElementById('cancelBtn')?.addEventListener('click', () => closeModal());
  document.getElementById('confirmCancel')?.addEventListener('click', () => closeConfirmModal());
  // Clear All Modal
  document.getElementById('clearAllCancel')?.addEventListener('click', () => closeClearAllModal());
  document.getElementById('clearAllConfirm')?.addEventListener('click', handleConfirmClearAll);
  document.getElementById('clearAllExport')?.addEventListener('click', handleExportBeforeClear);


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
  elements.clearAllModal?.addEventListener('click', (e) => {
    if (e.target === elements.clearAllModal) closeClearAllModal();
  });
    if (e.target === elements.modal) closeModal();
  });
  elements.confirmModal?.addEventListener('click', (e) => {
    if (e.target === elements.confirmModal) closeConfirmModal();
  });
}

// Render Functions

// Sichere Funktion zum Erstellen eines Bookmark-Elements (vermeidet innerHTML)
function createBookmarkElement(bookmark) {
  const item = document.createElement('div');
  item.className = 'bookmark-item collapsed';
  item.dataset.id = bookmark.id;

  // Header
  const header = document.createElement('div');
  header.className = 'bookmark-header';

  const expandIndicator = document.createElement('span');
  expandIndicator.className = 'bookmark-expand-indicator';
  expandIndicator.textContent = '▶';

  // Favicon (innerHTML ist OK hier, da renderFavicon bereits escaped)
  const faviconContainer = document.createElement('div');
  faviconContainer.innerHTML = renderFavicon(bookmark);

  const info = document.createElement('div');
  info.className = 'bookmark-info';

  const title = document.createElement('div');
  title.className = 'bookmark-title';
  title.textContent = bookmark.title; // Sicher mit textContent

  const url = document.createElement('div');
  url.className = 'bookmark-url';
  url.textContent = bookmark.url; // Sicher mit textContent

  info.appendChild(title);
  info.appendChild(url);

  const actions = document.createElement('div');
  actions.className = 'bookmark-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn edit-btn';
  editBtn.dataset.id = bookmark.id;
  editBtn.textContent = '✏️';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon-btn delete-btn';
  deleteBtn.dataset.id = bookmark.id;
  deleteBtn.textContent = '🗑️';

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  header.appendChild(expandIndicator);
  header.appendChild(faviconContainer.firstChild);
  header.appendChild(info);
  header.appendChild(actions);

  // Tags (innerHTML ist OK hier, da renderTags bereits escaped)
  const tagsContainer = document.createElement('div');
  tagsContainer.innerHTML = renderTags(bookmark.tags);

  // Description (obfuscated)
  const description = document.createElement('div');
  description.className = 'bookmark-description obfuscated';
  description.dataset.password = bookmark.description; // Escaped durch data-Attribut
  description.textContent = '••••••••••••'; // Sicher mit textContent

  // Date
  const date = document.createElement('div');
  date.className = 'bookmark-date';
  date.textContent = formatDate(bookmark.createdAt); // Sicher mit textContent

  // Zusammenbauen
  item.appendChild(header);
  if (tagsContainer.firstChild) {
    item.appendChild(tagsContainer.firstChild);
  }
  item.appendChild(description);
  item.appendChild(date);

  return item;
}

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

    // Sichere DOM-Erstellung statt innerHTML
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results';
    noResultsDiv.textContent = msg;
    elements.bookmarksList.innerHTML = '';
    elements.bookmarksList.appendChild(noResultsDiv);
    return;
  }

  elements.emptyState.classList.remove('visible');

  const sorted = searchManager.sortBookmarks(filtered);

  // Sichere DOM-Erstellung statt innerHTML
  elements.bookmarksList.innerHTML = '';
  sorted.forEach(bookmark => {
    const bookmarkElement = createBookmarkElement(bookmark);
    elements.bookmarksList.appendChild(bookmarkElement);
  });

  // Attach event listeners
  document.querySelectorAll('.bookmark-item').forEach(item => {
    // Click auf Expand-Indicator -> Aufklappen
    item.querySelector('.bookmark-expand-indicator')?.addEventListener('click', (e) => {
      e.stopPropagation(); // Verhindert Bubble zum bookmark-item
      item.classList.toggle('collapsed');
      item.classList.toggle('expanded');
    });

    // Passwort-Anzeige Toggle in aufgeklappten Bookmarks
    const descriptionEl = item.querySelector('.bookmark-description');
    if (descriptionEl) {
      descriptionEl.addEventListener('click', (e) => {
        // Nur togglen wenn obfuskiert
        if (descriptionEl.classList.contains('obfuscated')) {
          e.stopPropagation(); // Verhindert Link-Öffnen

          // Lade echtes Passwort aus data-Attribut
          const realPassword = descriptionEl.getAttribute('data-password');
          descriptionEl.textContent = realPassword;

          descriptionEl.classList.remove('obfuscated');
          descriptionEl.classList.add('revealed');

          // Nach 3 Sekunden automatisch wieder verstecken
          setTimeout(() => {
            if (descriptionEl.classList.contains('revealed')) {
              descriptionEl.textContent = '••••••••••••'; // Zurück zu Platzhalter
              descriptionEl.classList.remove('revealed');
              descriptionEl.classList.add('obfuscated');
            }
          }, 3000);
        }
      });
    }

    // Click auf Bookmark (außer Buttons) -> Link öffnen
    item.addEventListener('click', (e) => {
      // Ignoriere Clicks auf Buttons, Expand-Indicator und Passwort
      if (!e.target.closest('.icon-btn') &&
          !e.target.closest('.bookmark-expand-indicator') &&
          !e.target.closest('.bookmark-description')) {
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

  // Sichere DOM-Erstellung für Tag-Filter
  elements.tagFilterContainer.innerHTML = '';

  // Label erstellen
  if (sortedTags.length > 0) {
    const label = document.createElement('span');
    label.className = 'tag-filters-label';
    label.textContent = 'Filter:';
    elements.tagFilterContainer.appendChild(label);
  }

  // Tag-Buttons erstellen
  sortedTags.forEach(tag => {
    const isActive = tagsManager.activeTags.has(tag);
    const btn = document.createElement('button');
    btn.className = `tag-filter-chip ${isActive ? 'active' : ''}`;
    btn.dataset.tag = tag;
    btn.textContent = tag; // Sicher mit textContent

    btn.addEventListener('click', () => {
      tagsManager.toggleTagFilter(tag);
      renderBookmarks();
      renderTagFilters();
    });

    elements.tagFilterContainer.appendChild(btn);
  });

  // Clear button wenn Filter aktiv
  if (tagsManager.activeTags.size > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'tag-filter-chip clear-filter';
    clearBtn.textContent = '✕ Filter zurücksetzen';
    clearBtn.addEventListener('click', () => {
      tagsManager.clearAllFilters();
      renderBookmarks();
      renderTagFilters();
    });
    elements.tagFilterContainer.appendChild(clearBtn);
  }

  document.getElementById('clearTagFilter')?.addEventListener('click', () => {
    tagsManager.clearFilters();
    renderBookmarks();
    renderTagFilters();
  });
}

function renderTempTags() {
  if (!elements.tagsContainer) return;

  if (tagsManager.tempTags.length === 0) {
    // Sichere DOM-Erstellung statt innerHTML
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'tags-empty';
    emptyDiv.textContent = 'Noch keine Tags hinzugefügt';
    elements.tagsContainer.innerHTML = '';
    elements.tagsContainer.appendChild(emptyDiv);
    return;
  }

  // Sichere DOM-Erstellung für Tag-Chips
  elements.tagsContainer.innerHTML = '';

  tagsManager.tempTags.forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';

    const text = document.createElement('span');
    text.className = 'tag-text';
    text.textContent = tag; // Sicher mit textContent

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'tag-remove';
    removeBtn.dataset.tag = tag;
    removeBtn.innerHTML = '&times;'; // HTML-Entity ist sicher

    removeBtn.addEventListener('click', () => {
      tagsManager.removeTag(tag);
      renderTempTags();
    });

    chip.appendChild(text);
    chip.appendChild(removeBtn);
    elements.tagsContainer.appendChild(chip);
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
    showMessage('✓ Link geöffnet & Passwort kopiert', 'success');
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
    exportImportManager.exportBookmarks(
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
    // Importiere die Bookmarks mit dem gewählten Modus
    const importedBookmarks = exportImportManager.importBookmarks(currentBookmarks, mode);

    // Speichere die Bookmarks in Chrome Storage
    await saveBookmarks(importedBookmarks);

    // Lade die Bookmarks neu aus dem Storage (zur Verifizierung)
    currentBookmarks = await loadBookmarks();

    // Aktualisiere Tags und UI
    tagsManager.collectAllTags(currentBookmarks);
    renderBookmarks();
    renderTagFilters();
    updateStatistics();

    const message = mode === 'replace'
      ? `✓ ${currentBookmarks.length} Bookmarks importiert (ersetzt)`
      : `✓ Import abgeschlossen - ${currentBookmarks.length} Bookmarks gesamt`;

    showMessage(message, 'success');
    closeImportModal();
    closeSettings();
  } catch (error) {
    console.error('Import-Fehler:', error);
    showMessage(error.message || 'Fehler beim Import', 'error');
  }
}

async function handleClearAll() {
  // Öffne das Clear All Modal
  elements.clearAllModal?.classList.add('show');
}

async function handleConfirmClearAll() {
  try {
    // Lösche alle Bookmarks
    currentBookmarks = [];
    await saveBookmarks([]);

    // Aktualisiere UI
    tagsManager.collectAllTags([]);
    renderBookmarks();
    renderTagFilters();

    showMessage('✓ Alle Daten gelöscht', 'success');
    closeClearAllModal();
    closeSettings();
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    showMessage('Fehler beim Löschen der Daten', 'error');
  }
}

function handleExportBeforeClear() {
  // Exportiere erst die Daten
  try {
    exportImportManager.exportBookmarks(
      currentBookmarks,
      tagsManager.currentTags
    );
    showMessage('✓ Bookmarks exportiert', 'success');
  } catch (error) {
    showMessage('Fehler beim Export', 'error');
  }

  // Schließe das Modal ohne zu löschen
  closeClearAllModal();
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

function closeClearAllModal() {
  elements.clearAllModal?.classList.remove('show');
}

function handleEscapeKey() {
  if (elements.modal?.classList.contains('show')) {
    closeModal();
  } else if (elements.importModal?.classList.contains('show')) {
    closeImportModal();
  } else if (elements.confirmModal?.classList.contains('show')) {
    closeConfirmModal();
  } else if (elements.clearAllModal?.classList.contains('show')) {
    closeClearAllModal();
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


