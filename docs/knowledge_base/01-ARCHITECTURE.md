# Code-Architektur - Knowledge Base

## Module-System

### Übersicht

Das Miro Link Plugin verwendet ein modulares ES6-Module-System:

```
src/js/
├── popup.js           # Haupt-Koordinator
├── background.js      # Service Worker (Chrome) / Background Script (Firefox)
└── modules/
    ├── storage.js     # Storage-Operationen
    ├── tags.js        # Tag-Management
    ├── search.js      # Suche & Sortierung
    ├── exportImport.js # Export/Import
    ├── theme.js       # Theme-Management
    ├── keyboard.js    # Keyboard Shortcuts
    └── utils.js       # Hilfsfunktionen
```

---

## Module im Detail

### 1. storage.js (~77 Zeilen)

**Pattern:** Pure Functions  
**Verantwortung:** Abstraktion der Browser Storage API

```javascript
// Exports
export async function loadBookmarks()
export async function saveBookmarks(bookmarks)
export async function loadTheme()
export async function saveTheme(theme)
export async function getCurrentTab()

// Implementierung (Chrome)
export async function loadBookmarks() {
  return new Promise((resolve) => {
    chrome.storage.sync.get('bookmarks', (result) => {
      resolve(result.bookmarks || []);
    });
  });
}

// Implementierung (Firefox)
export async function loadBookmarks() {
  const result = await browser.storage.sync.get('bookmarks');
  return result.bookmarks || [];
}
```

**Key Points:**
- Promise-basierte API
- Einheitliche Schnittstelle für Chrome/Firefox
- Fehlerbehandlung in aufrufendem Code
- Storage Key: `'bookmarks'` für Bookmark-Array

---

### 2. tags.js (~96 Zeilen)

**Pattern:** ES6 Class  
**Verantwortung:** Tag-Verwaltung und Filterung

```javascript
export class TagsManager {
  constructor() {
    this.currentTags = new Set();     // Alle verfügbaren Tags
    this.activeTags = new Set();      // Aktive Filter-Tags
    this.tempTags = [];               // Tags im Formular
  }

  // Tag-Sammlung aus Bookmarks
  collectAllTags(bookmarks) {
    this.currentTags.clear();
    bookmarks.forEach(bookmark => {
      bookmark.tags?.forEach(tag => this.currentTags.add(tag));
    });
  }

  // Tag-Validierung
  validateTag(tag) {
    if (tag.length < 2 || tag.length > 20) return false;
    if (!/^[a-z0-9_-]+$/.test(tag)) return false;
    return true;
  }

  // Tag hinzufügen (max 5)
  addTag(tag) {
    const normalized = tag.toLowerCase().trim();
    if (!this.validateTag(normalized)) return false;
    if (this.tempTags.includes(normalized)) return false;
    if (this.tempTags.length >= 5) return false;
    
    this.tempTags.push(normalized);
    return true;
  }

  // Tag entfernen
  removeTag(tag) {
    this.tempTags = this.tempTags.filter(t => t !== tag);
  }

  // Filter-Toggle
  toggleTagFilter(tag) {
    if (this.activeTags.has(tag)) {
      this.activeTags.delete(tag);
    } else {
      this.activeTags.add(tag);
    }
  }

  // Bookmarks nach Tags filtern (AND-Verknüpfung)
  filterByTags(bookmarks) {
    if (this.activeTags.size === 0) return bookmarks;
    
    return bookmarks.filter(bookmark => {
      const bookmarkTags = bookmark.tags || [];
      return Array.from(this.activeTags).every(tag => 
        bookmarkTags.includes(tag)
      );
    });
  }

  // Filter zurücksetzen
  clearTagFilters() {
    this.activeTags.clear();
  }
}
```

**Key Points:**
- **Max 5 Tags** pro Bookmark
- **Validierung:** 2-20 Zeichen, lowercase, `[a-z0-9_-]`
- **AND-Filter:** Alle aktiven Tags müssen matchen
- **Set für Performance:** Keine Duplikate

---

### 3. search.js (~82 Zeilen)

**Pattern:** ES6 Class  
**Verantwortung:** Suche und Sortierung

```javascript
export class SearchManager {
  constructor() {
    this.searchQuery = '';
    this.sortBy = 'date-desc'; // date-desc, date-asc, title-asc, title-desc
  }

  // Suche in allen relevanten Feldern
  search(bookmarks, query) {
    if (!query || query.trim() === '') return bookmarks;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return bookmarks.filter(bookmark => {
      const title = (bookmark.title || '').toLowerCase();
      const url = (bookmark.url || '').toLowerCase();
      const password = (bookmark.password || '').toLowerCase();
      const tags = (bookmark.tags || []).join(' ').toLowerCase();
      
      return title.includes(lowerQuery) ||
             url.includes(lowerQuery) ||
             password.includes(lowerQuery) ||
             tags.includes(lowerQuery);
    });
  }

  // Sortierung
  sort(bookmarks, sortBy = this.sortBy) {
    const sorted = [...bookmarks]; // Kopie für Immutability
    
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      
      case 'date-asc':
        return sorted.sort((a, b) => a.createdAt - b.createdAt);
      
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      
      default:
        return sorted;
    }
  }
}
```

**Key Points:**
- **Case-insensitive** Suche
- **Multi-Field:** Titel, URL, Passwort, Tags
- **4 Sortierungen:** Datum (neu/alt), Titel (A-Z/Z-A)
- **Immutable:** Gibt neue Arrays zurück
- **Debounce:** 300ms im UI-Code

---

### 4. exportImport.js (~159 Zeilen)

**Pattern:** ES6 Class  
**Verantwortung:** Daten-Export und -Import

```javascript
export class ExportImportManager {
  constructor() {
    this.exportMode = 'full'; // 'full', 'links-only', 'encrypted'
  }

  // Export als JSON
  exportBookmarks(bookmarks, allTags) {
    const data = {
      version: '2.3.0',
      exportDate: new Date().toISOString(),
      bookmarks: this.prepareBookmarksForExport(bookmarks),
      tags: Array.from(allTags)
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `miro-links-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  // Bookmarks vorbereiten je nach Modus
  prepareBookmarksForExport(bookmarks) {
    switch (this.exportMode) {
      case 'links-only':
        return bookmarks.map(b => ({
          ...b,
          password: '' // Passwörter entfernen
        }));
      
      case 'encrypted':
        // TODO: Implementierung
        return bookmarks;
      
      case 'full':
      default:
        return bookmarks;
    }
  }

  // Import-Datei lesen
  async readImportFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const validated = this.validateImportData(data);
          resolve(validated);
        } catch (error) {
          reject(new Error('Ungültige JSON-Datei'));
        }
      };
      
      reader.onerror = () => reject(new Error('Fehler beim Lesen'));
      reader.readAsText(file);
    });
  }

  // Daten validieren
  validateImportData(data) {
    if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
      throw new Error('Keine Bookmarks gefunden');
    }
    
    const validBookmarks = data.bookmarks.filter(b => {
      return b.id && b.title && b.url; // Pflichtfelder
    });
    
    return {
      count: validBookmarks.length,
      bookmarks: validBookmarks,
      version: data.version
    };
  }

  // Bookmarks mergen (Duplikate nach URL)
  mergeBookmarks(existing, imported) {
    const existingUrls = new Set(existing.map(b => b.url));
    const newBookmarks = imported.filter(b => !existingUrls.has(b.url));
    
    return [...existing, ...newBookmarks];
  }
}
```

**Key Points:**
- **3 Export-Modi:** Full, Links-only, Encrypted (TODO)
- **Validierung:** JSON-Struktur + Pflichtfelder
- **Duplikat-Erkennung:** Nach URL
- **FileReader API:** Asynchrones Lesen
- **Blob/Download:** Browser-Download-Mechanismus

---

### 5. theme.js (~90 Zeilen)

**Pattern:** ES6 Class  
**Verantwortung:** Dark Mode Management

```javascript
export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  }

  // Initialisierung
  async init() {
    // Gespeichertes Theme laden
    const savedTheme = await this.loadSavedTheme();
    
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      // System-Präferenz verwenden
      this.currentTheme = this.prefersDark.matches ? 'dark' : 'light';
    }
    
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  // Theme anwenden
  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.updateToggleButton();
  }

  // Theme wechseln
  async toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    await this.saveTheme(newTheme);
  }

  // System-Theme-Änderungen lauschen
  setupSystemThemeListener() {
    this.prefersDark.addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        // Nur wenn User keine Präferenz gesetzt hat
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Theme speichern
  async saveTheme(theme) {
    localStorage.setItem('theme', theme);
    // Optional: Auch in chrome.storage.sync
  }

  // Toggle-Button aktualisieren
  updateToggleButton() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', 
        `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`
      );
    }
  }
}
```

**Key Points:**
- **Auto-Detection:** System-Theme mit `prefers-color-scheme`
- **Persistenz:** localStorage (schnell) + optional chrome.storage
- **Live-Updates:** MediaQuery-Listener
- **CSS Variables:** `data-theme="dark"` Attribut
- **Accessibility:** aria-label Updates

---

### 6. keyboard.js (~170 Zeilen)

**Pattern:** ES6 Class  
**Verantwortung:** Keyboard Shortcuts

```javascript
export class KeyboardManager {
  constructor(callbacks) {
    this.callbacks = callbacks; // onEscape, onNewLink, etc.
    this.shortcuts = new Map();
    this.setupShortcuts();
  }

  // Shortcuts definieren
  setupShortcuts() {
    this.shortcuts.set('Escape', this.callbacks.onEscape);
    this.shortcuts.set('Control+n', this.callbacks.onNewLink);
    this.shortcuts.set('Control+f', this.callbacks.onFocusSearch);
    this.shortcuts.set('Control+e', this.callbacks.onExport);
    this.shortcuts.set('Control+,', this.callbacks.onToggleSettings);
    
    // Zahlen 1-9 für schnellen Zugriff
    for (let i = 1; i <= 9; i++) {
      this.shortcuts.set(`Control+${i}`, () => {
        if (this.callbacks.isNavigationAllowed?.()) {
          this.callbacks.onOpenSelected?.(i - 1);
        }
      });
    }
  }

  // Event Listener initialisieren
  init() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyPress(e);
    });
  }

  // Key-Press Handler
  handleKeyPress(e) {
    // Nicht in Input-Feldern
    if (e.target.tagName === 'INPUT' || 
        e.target.tagName === 'TEXTAREA') {
      // Außer Escape
      if (e.key !== 'Escape') return;
    }

    const key = this.getKeyCombo(e);
    const callback = this.shortcuts.get(key);
    
    if (callback) {
      e.preventDefault();
      callback();
    }
  }

  // Key-Kombination als String
  getKeyCombo(e) {
    const parts = [];
    if (e.ctrlKey || e.metaKey) parts.push('Control');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    parts.push(e.key);
    return parts.join('+');
  }
}
```

**Key Points:**
- **Callback-Pattern:** Flexibel erweiterbar
- **Modifier-Keys:** Ctrl/Cmd, Shift, Alt
- **Input-Check:** Shortcuts nicht in Formularfeldern
- **Escape:** Funktioniert überall
- **Numbered Access:** Ctrl+1-9 für schnellen Zugriff

---

### 7. utils.js (~95 Zeilen)

**Pattern:** Pure Functions  
**Verantwortung:** Wiederverwendbare Hilfsfunktionen

```javascript
// Eindeutige ID generieren
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Datum formatieren
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// HTML escapen (XSS-Schutz)
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fallback-Favicon generieren
export function getFallbackFavicon(title) {
  const letter = title.charAt(0).toUpperCase();
  const hue = title.charCodeAt(0) * 137.508; // Golden angle
  
  return `
    <div class="favicon-fallback" 
         style="background: linear-gradient(135deg, 
                hsl(${hue}, 70%, 50%), 
                hsl(${hue + 30}, 70%, 60%));">
      ${letter}
    </div>
  `;
}

// Favicon rendern
export function renderFavicon(bookmark) {
  if (bookmark.favicon) {
    return `<img src="${bookmark.favicon}" 
                 class="favicon" 
                 onerror="this.style.display='none';" 
                 alt="">`;
  }
  return getFallbackFavicon(bookmark.title);
}

// Tags als HTML rendern
export function renderTags(tags) {
  if (!tags || tags.length === 0) return '';
  
  return tags.map(tag => 
    `<span class="tag-badge">${escapeHtml(tag)}</span>`
  ).join('');
}

// User-Feedback Message
export function showMessage(text, type = 'info') {
  const container = document.getElementById('messageContainer');
  if (!container) return;
  
  const message = document.createElement('div');
  message.className = `message message-${type}`;
  message.textContent = text;
  
  container.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('fade-out');
    setTimeout(() => message.remove(), 300);
  }, 3000);
}
```

**Key Points:**
- **generateId():** Timestamp + Random für Eindeutigkeit
- **formatDate():** Lokalisiertes deutsches Format
- **escapeHtml():** XSS-Schutz durch textContent
- **Favicon-Fallback:** Gradient-Avatar mit erstem Buchstaben
- **showMessage():** Toast-Notifications (3 Sek.)

---

## popup.js - Haupt-Koordinator (~836 Zeilen)

### Struktur

```javascript
// 1. Imports (Zeile 1-17)
import { loadBookmarks, saveBookmarks } from './modules/storage.js';
import { TagsManager } from './modules/tags.js';
// ...

// 2. State (Zeile 19-21)
let currentBookmarks = [];
let editingBookmarkId = null;

// 3. Manager-Instanzen (Zeile 23-27)
const tagsManager = new TagsManager();
const searchManager = new SearchManager();
// ...

// 4. DOM-Elemente (Zeile 29-49)
const elements = {
  saveCurrentBtn: document.getElementById('saveCurrentBtn'),
  bookmarksList: document.getElementById('bookmarksList'),
  // ...
};

// 5. Initialisierung (Zeile 51-80)
document.addEventListener('DOMContentLoaded', init);
async function init() { /* ... */ }

// 6. Daten-Funktionen (Zeile 82-95)
async function loadData() { /* ... */ }

// 7. Event Listeners (Zeile 97-200)
function setupEventListeners() { /* ... */ }

// 8. Render-Funktionen (Zeile 202-480)
function renderBookmarks() { /* ... */ }
function renderTagFilters() { /* ... */ }
function renderTempTags() { /* ... */ }

// 9. Action-Handler (Zeile 482-700)
async function handleSaveCurrentLink() { /* ... */ }
async function handleFormSubmit(e) { /* ... */ }
async function handleOpenBookmark(id) { /* ... */ }
// ...

// 10. Modal-Funktionen (Zeile 702-836)
function openModal() { /* ... */ }
function closeModal() { /* ... */ }
// ...
```

### Wichtige Funktionen

#### renderBookmarks()
```javascript
function renderBookmarks() {
  // 1. Daten vorbereiten
  let filtered = [...currentBookmarks];
  
  // 2. Tag-Filter anwenden
  filtered = tagsManager.filterByTags(filtered);
  
  // 3. Suche anwenden
  filtered = searchManager.search(filtered, searchManager.searchQuery);
  
  // 4. Sortieren
  const sorted = searchManager.sort(filtered, searchManager.sortBy);
  
  // 5. Empty-State prüfen
  if (sorted.length === 0) {
    showEmptyState();
    return;
  }
  
  // 6. HTML generieren
  const html = sorted.map(bookmark => `
    <div class="bookmark-item" data-id="${bookmark.id}">
      ${renderFavicon(bookmark)}
      <div class="bookmark-content">
        <div class="bookmark-title">${escapeHtml(bookmark.title)}</div>
        <div class="bookmark-url">${escapeHtml(bookmark.url)}</div>
        <div class="bookmark-password obfuscated" 
             data-password="${escapeHtml(bookmark.password)}">
          ••••••••••••
        </div>
        ${renderTags(bookmark.tags)}
      </div>
      <div class="bookmark-actions">
        <button class="edit-btn" data-id="${bookmark.id}">✏️</button>
        <button class="delete-btn" data-id="${bookmark.id}">🗑️</button>
      </div>
    </div>
  `).join('');
  
  // 7. DOM aktualisieren
  elements.bookmarksList.innerHTML = html;
  
  // 8. Event Listeners
  attachBookmarkEventListeners();
}
```

---

## Best Practices

### 1. Immutability
```javascript
// ❌ Schlecht: Mutiert Array
bookmarks.sort((a, b) => a.title.localeCompare(b.title));

// ✅ Gut: Kopiert Array
const sorted = [...bookmarks].sort((a, b) => a.title.localeCompare(b.title));
```

### 2. Fehlerbehandlung
```javascript
// ✅ Immer Try-Catch bei async
try {
  await saveBookmarks(bookmarks);
  showMessage('✓ Gespeichert', 'success');
} catch (error) {
  console.error('Save error:', error);
  showMessage('Fehler', 'error');
}
```

### 3. XSS-Schutz
```javascript
// ❌ Schlecht: Direkt in HTML
element.innerHTML = `<div>${userInput}</div>`;

// ✅ Gut: Escaped
element.innerHTML = `<div>${escapeHtml(userInput)}</div>`;

// ✅ Noch besser: textContent
element.textContent = userInput;
```

### 4. Modulare Exports
```javascript
// ✅ Named Exports (bevorzugt)
export function loadBookmarks() { }
export function saveBookmarks() { }

// ✅ Class Export
export class TagsManager { }

// ❌ Default Export (vermeiden für bessere IDE-Unterstützung)
export default TagsManager;
```

---

## Performance-Tipps

1. **Debounce bei Suche** (300ms)
2. **Set statt Array** für Tag-Filter
3. **Virtual Scrolling** bei 100+ Bookmarks (TODO)
4. **requestAnimationFrame** für Animationen
5. **CSS statt JS** für Transitions

---

## Debugging

### Console-Logging
```javascript
// Development
console.log('Bookmarks loaded:', bookmarks);
console.error('Save failed:', error);

// Production
// TODO: Entfernen oder Feature-Flag
```

### Chrome DevTools
```
Rechtsklick auf Extension-Icon → "Popup prüfen"
→ Console, Network, Storage tabs
```

### Firefox DevTools
```
about:debugging → "Inspect" auf Extension
→ Console, Storage tabs
```

