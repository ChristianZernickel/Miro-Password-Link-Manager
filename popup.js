// Globale Variablen
let currentBookmarks = [];
let editingBookmarkId = null;

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

// Event Listeners initialisieren
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Bookmarks laden
  loadBookmarks();

  // Event Listeners
  saveCurrentBtn.addEventListener('click', handleSaveCurrentLink);
  bookmarkForm.addEventListener('submit', handleFormSubmit);
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  confirmCancel.addEventListener('click', closeConfirmModal);

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
    renderBookmarks();
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

  emptyState.classList.remove('visible');

  // Sortiere nach Erstellungsdatum (neueste zuerst)
  const sortedBookmarks = [...currentBookmarks].sort((a, b) => b.createdAt - a.createdAt);

  bookmarksList.innerHTML = sortedBookmarks.map(bookmark => `
    <div class="bookmark-item collapsed" data-id="${bookmark.id}">
      <div class="bookmark-header">
        <span class="bookmark-expand-indicator">▶</span>
        <div class="bookmark-info">
          <div class="bookmark-title">${escapeHtml(bookmark.title)}</div>
          <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
        </div>
        <div class="bookmark-actions">
          <button class="icon-btn edit-btn" data-id="${bookmark.id}" title="Bearbeiten">✏️</button>
          <button class="icon-btn delete-btn" data-id="${bookmark.id}" title="Löschen">🗑️</button>
        </div>
      </div>
      <div class="bookmark-description">${escapeHtml(bookmark.description)}</div>
      <div class="bookmark-date">${formatDate(bookmark.createdAt)}</div>
    </div>
  `).join('');

  // Event Listeners für Bookmark-Items
  document.querySelectorAll('.bookmark-item').forEach(item => {
    const bookmarkId = item.dataset.id;

    // Klick auf Header oder Expand-Indikator zum Aufklappen
    const header = item.querySelector('.bookmark-header');
    const expandIndicator = item.querySelector('.bookmark-expand-indicator');
    const bookmarkInfo = item.querySelector('.bookmark-info');

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
    modalTitle.textContent = 'Link speichern';
    document.getElementById('bookmarkUrl').value = tab.url;
    document.getElementById('bookmarkTitle').value = tab.title || '';
    document.getElementById('bookmarkDescription').value = '';
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
  modalTitle.textContent = 'Link bearbeiten';
  document.getElementById('bookmarkUrl').value = bookmark.url;
  document.getElementById('bookmarkTitle').value = bookmark.title;
  document.getElementById('bookmarkDescription').value = bookmark.description;

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
      renderBookmarks();
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
    if (editingBookmarkId) {
      // Bearbeiten
      const index = currentBookmarks.findIndex(b => b.id === editingBookmarkId);
      if (index !== -1) {
        currentBookmarks[index] = {
          ...currentBookmarks[index],
          title,
          description,
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
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      currentBookmarks.push(newBookmark);
      showMessage('✓ Bookmark gespeichert', 'success');
    }

    await chrome.storage.sync.set({ bookmarks: currentBookmarks });
    renderBookmarks();
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
  bookmarkForm.reset();
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

