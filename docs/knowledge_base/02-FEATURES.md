# Features & Implementation - Knowledge Base

## Feature-Matrix

| # | Feature | Status | Version | Chrome | Firefox | LOC |
|---|---------|--------|---------|--------|---------|-----|
| 1 | Tags/Kategorien | ✅ | v2.0.0 | ✅ | ✅ | ~96 |
| 2 | Suche & Filter | ✅ | v2.0.0 | ✅ | ✅ | ~82 |
| 3 | Export/Import | ✅ | v2.1.0 | ✅ | ✅ (Sidebar) | ~159 |
| 4 | Keyboard Shortcuts | ✅ | v2.1.0 | ✅ | ✅ | ~170 |
| 5 | Context Menu | ✅ | v2.1.0 | ✅ | ✅ | ~50 |
| 6 | Dark Mode | ✅ | v2.0.0 | ✅ | ✅ | ~90 |
| 7 | Ordnerstruktur | ❌ | - | - | - | - |
| 8 | Favicons | ✅ | v2.0.0 | ✅ | ✅ | ~50 |

**Implementiert:** 7/8 (87.5%)

---

## Feature 1: Tags/Kategorien ✅

### Spezifikation

- **Max 5 Tags** pro Bookmark
- **Validierung:**
  - Länge: 2-20 Zeichen
  - Pattern: `^[a-z0-9_-]+$` (lowercase, alphanumerisch, `-`, `_`)
  - Keine Duplikate
- **Filter:** Multi-Tag mit AND-Verknüpfung
- **UI:** Gradient-Badges, Click-to-Filter

### Implementierung

**Modul:** `tags.js` - `TagsManager` Class

```javascript
class TagsManager {
  currentTags: Set<string>    // Alle verfügbaren Tags
  activeTags: Set<string>     // Aktive Filter
  tempTags: Array<string>     // Tags im Formular (max 5)
  
  // Methoden
  validateTag(tag)            // Prüft Regex + Länge
  addTag(tag)                 // Max 5, keine Duplikate
  removeTag(tag)              // Aus tempTags entfernen
  collectAllTags(bookmarks)   // Sammelt alle Tags
  toggleTagFilter(tag)        // Filter ein/aus
  filterByTags(bookmarks)     // AND-Filter anwenden
  clearTagFilters()           // Alle Filter zurücksetzen
}
```

### UI-Komponenten

**Tag-Input (Modal):**
```html
<div class="form-group">
  <label>Tags (max. 5)</label>
  <div class="tags-input-group">
    <input id="tagInput" placeholder="z.B. arbeit, wichtig">
    <button id="addTagBtn">+</button>
  </div>
  <div id="tagsContainer">
    <!-- Dynamisch: Tag-Chips mit X-Button -->
  </div>
</div>
```

**Tag-Filter (Header):**
```html
<div id="tagFilterContainer" class="tag-filters">
  <span class="tag-filters-label">Filter:</span>
  <button class="tag-filter-chip" data-tag="work">work</button>
  <button class="tag-filter-chip active" data-tag="dev">dev</button>
  <button class="tag-filter-chip clear-filter">✕ Alle anzeigen</button>
</div>
```

**Tag-Badge (Bookmark):**
```html
<div class="tags-list">
  <span class="tag-badge">work</span>
  <span class="tag-badge">dev</span>
</div>
```

### CSS

```css
.tag-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-right: 4px;
}

.tag-filter-chip {
  padding: 6px 12px;
  border-radius: 16px;
  border: 2px solid var(--accent-primary);
  background: transparent;
  color: var(--accent-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.tag-filter-chip.active {
  background: var(--accent-primary);
  color: white;
}
```

### Datenmodell

```javascript
bookmark = {
  tags: ["work", "dev", "project-x"] // Array<string>, max 5
}
```

---

## Feature 2: Suche & Filter ✅

### Spezifikation

- **Felder:** Titel, URL, Passwort, Tags
- **Case-insensitive**
- **Debounce:** 300ms
- **Kombinierbar** mit Tag-Filter
- **Sortierung:** 4 Optionen

### Implementierung

**Modul:** `search.js` - `SearchManager` Class

```javascript
class SearchManager {
  searchQuery: string
  sortBy: string  // 'date-desc', 'date-asc', 'title-asc', 'title-desc'
  
  search(bookmarks, query)  // Multi-Field Suche
  sort(bookmarks, sortBy)   // 4 Sortierungen
}

// Search-Logik
search(bookmarks, query) {
  const lowerQuery = query.toLowerCase().trim();
  return bookmarks.filter(b => 
    b.title.toLowerCase().includes(lowerQuery) ||
    b.url.toLowerCase().includes(lowerQuery) ||
    b.password.toLowerCase().includes(lowerQuery) ||
    b.tags.join(' ').toLowerCase().includes(lowerQuery)
  );
}

// Sort-Logik
sort(bookmarks, sortBy) {
  switch (sortBy) {
    case 'date-desc': return [...bookmarks].sort((a,b) => b.createdAt - a.createdAt);
    case 'date-asc':  return [...bookmarks].sort((a,b) => a.createdAt - b.createdAt);
    case 'title-asc': return [...bookmarks].sort((a,b) => a.title.localeCompare(b.title));
    case 'title-desc': return [...bookmarks].sort((a,b) => b.title.localeCompare(a.title));
  }
}
```

### UI

**Search-Bar:**
```html
<div class="search-bar">
  <input id="searchInput" 
         type="text" 
         placeholder="Suche in Titel, URL oder Passwort...">
  <button id="clearSearch" class="clear-btn">✕</button>
</div>
```

**Sort-Dropdown:**
```html
<select id="sortSelect">
  <option value="date-desc">Neueste zuerst</option>
  <option value="date-asc">Älteste zuerst</option>
  <option value="title-asc">Titel A-Z</option>
  <option value="title-desc">Titel Z-A</option>
</select>
```

### Event-Handler (popup.js)

```javascript
// Debounced Search
let searchTimeout;
elements.searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchManager.searchQuery = e.target.value;
    renderBookmarks();
  }, 300);
});

// Sort Change
elements.sortSelect.addEventListener('change', (e) => {
  searchManager.sortBy = e.target.value;
  renderBookmarks();
});
```

### Render-Pipeline

```javascript
function renderBookmarks() {
  let filtered = [...currentBookmarks];
  
  // 1. Tag-Filter
  filtered = tagsManager.filterByTags(filtered);
  
  // 2. Suche
  filtered = searchManager.search(filtered, searchManager.searchQuery);
  
  // 3. Sortierung
  const sorted = searchManager.sort(filtered, searchManager.sortBy);
  
  // 4. Render
  renderBookmarkItems(sorted);
}
```

---

## Feature 3: Export/Import ✅

### Spezifikation

- **Export-Modi:**
  1. Nur Links (ohne Passwörter)
  2. Vollständig (mit Passwörtern)
  3. Verschlüsselt (TODO)
- **Import:** JSON-Validierung, Duplikat-Check
- **Firefox:** Nur im Sidebar-Modus (File-API)

### Implementierung

**Modul:** `exportImport.js` - `ExportImportManager` Class

```javascript
class ExportImportManager {
  exportMode: string  // 'full', 'links-only', 'encrypted'
  
  exportBookmarks(bookmarks, allTags)
  readImportFile(file)
  validateImportData(data)
  mergeBookmarks(existing, imported)
}
```

### Export-Format

```json
{
  "version": "2.3.0",
  "exportDate": "2025-10-29T10:30:00.000Z",
  "bookmarks": [
    {
      "id": "1698000000000-abc123",
      "title": "GitHub",
      "url": "https://github.com",
      "password": "MyPassword123",
      "tags": ["dev", "tools"],
      "favicon": "https://github.com/favicon.ico",
      "createdAt": 1698000000000
    }
  ],
  "tags": ["dev", "tools", "work"]
}
```

### UI

**Export-Modal:**
```html
<div id="exportModal" class="modal">
  <h3>Export Bookmarks</h3>
  <div class="export-options">
    <label>
      <input type="radio" name="exportMode" value="full" checked>
      Vollständig (mit Passwörtern)
    </label>
    <label>
      <input type="radio" name="exportMode" value="links-only">
      Nur Links (ohne Passwörter)
    </label>
    <label>
      <input type="radio" name="exportMode" value="encrypted" disabled>
      Verschlüsselt (Coming Soon)
    </label>
  </div>
  <button onclick="handleExport()">Export</button>
</div>
```

**Import-Flow:**
```html
<!-- File Input (hidden) -->
<input type="file" id="importFile" accept=".json" style="display:none;">

<!-- Import Modal (nach Validierung) -->
<div id="importModal" class="modal">
  <h3>Import Bookmarks</h3>
  <p><span id="importCount">5</span> Bookmarks gefunden</p>
  <p>Duplikate werden automatisch übersprungen</p>
  <button onclick="handleImportConfirm()">Importieren</button>
  <button onclick="closeImportModal()">Abbrechen</button>
</div>
```

### Import-Validierung

```javascript
validateImportData(data) {
  // 1. Struktur prüfen
  if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
    throw new Error('Keine Bookmarks gefunden');
  }
  
  // 2. Pflichtfelder prüfen
  const valid = data.bookmarks.filter(b => 
    b.id && b.title && b.url
  );
  
  // 3. Tags normalisieren (max 5)
  valid.forEach(b => {
    if (b.tags && b.tags.length > 5) {
      b.tags = b.tags.slice(0, 5);
    }
  });
  
  return { count: valid.length, bookmarks: valid };
}
```

### Duplikat-Check

```javascript
mergeBookmarks(existing, imported) {
  const existingUrls = new Set(existing.map(b => b.url));
  const newBookmarks = imported.filter(b => !existingUrls.has(b.url));
  return [...existing, ...newBookmarks];
}
```

---

## Feature 4: Keyboard Shortcuts ✅

### Spezifikation

- **Global:** `Ctrl+Shift+L` (Popup öffnen)
- **Popup-intern:** Mehrere Shortcuts
- **Context-aware:** Nicht in Input-Feldern (außer Escape)

### Implementierung

**Modul:** `keyboard.js` - `KeyboardManager` Class

```javascript
class KeyboardManager {
  shortcuts: Map<string, Function>
  callbacks: object
  
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.setupShortcuts();
  }
  
  setupShortcuts() {
    this.shortcuts.set('Escape', callbacks.onEscape);
    this.shortcuts.set('Control+n', callbacks.onNewLink);
    this.shortcuts.set('Control+f', callbacks.onFocusSearch);
    this.shortcuts.set('Control+e', callbacks.onExport);
    // ...
  }
  
  handleKeyPress(e) {
    // Skip in Input-Feldern (außer Escape)
    if (isInputField(e.target) && e.key !== 'Escape') return;
    
    const combo = this.getKeyCombo(e);
    const callback = this.shortcuts.get(combo);
    if (callback) {
      e.preventDefault();
      callback();
    }
  }
}
```

### Shortcut-Liste

| Shortcut | Aktion | Context |
|----------|--------|---------|
| `Ctrl+Shift+L` | Popup öffnen | Global (Manifest) |
| `Ctrl+Shift+B` | Sidebar öffnen (Firefox) | Global (Manifest) |
| `Escape` | Modal schließen | Überall |
| `Ctrl+N` | Neuer Link | Popup |
| `Ctrl+F` | Suche fokussieren | Popup |
| `Ctrl+E` | Export | Popup |
| `Ctrl+,` | Settings | Popup |
| `Ctrl+1-9` | Bookmark 1-9 öffnen | Popup |
| `Enter` | Formular absenden | Im Formular |

### Manifest-Definition

**Chrome:**
```json
{
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+L",
        "mac": "Command+Shift+L"
      },
      "description": "Öffne Miro Links"
    }
  }
}
```

**Firefox:**
```json
{
  "commands": {
    "_execute_browser_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+L"
      }
    },
    "_execute_sidebar_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+B"
      }
    }
  }
}
```

---

## Feature 5: Context Menu ✅

### Spezifikation

- **"Bei Miro speichern"** bei Rechtsklick auf Link
- **Prompts:** Titel (optional), Passwort (optional)
- **Notification:** Success-Feedback

### Implementierung

**Datei:** `background.js`

```javascript
// Context Menu erstellen
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveLinkToMiro',
    title: 'Bei Miro speichern',
    contexts: ['link']
  });
});

// Click-Handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'saveLinkToMiro') {
    const url = info.linkUrl;
    const title = info.selectionText || new URL(url).hostname;
    
    // Prompt für Passwort (via scripting API)
    const password = await promptForPassword(tab.id);
    
    // Bookmark erstellen
    const bookmark = {
      id: generateId(),
      title,
      url,
      password: password || '',
      tags: [],
      favicon: '',
      createdAt: Date.now()
    };
    
    // Speichern
    const bookmarks = await loadBookmarks();
    bookmarks.push(bookmark);
    await saveBookmarks(bookmarks);
    
    // Notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icons/icon48.png',
      title: 'Link gespeichert',
      message: `${title} wurde zu Miro hinzugefügt`
    });
  }
});
```

### Prompt-Implementierung

```javascript
async function promptForPassword(tabId) {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      return prompt('Passwort/Hinweis (optional):');
    }
  });
  return result[0]?.result || '';
}
```

---

## Feature 6: Dark Mode ✅

### Spezifikation

- **Auto-Detection:** System-Theme
- **Toggle:** 🌙/☀️ Button
- **Persistenz:** localStorage + chrome.storage
- **Smooth Transitions:** 300ms

### Implementierung

**Modul:** `theme.js` - `ThemeManager` Class

```javascript
class ThemeManager {
  currentTheme: string
  prefersDark: MediaQueryList
  
  async init() {
    const saved = await loadTheme();
    if (saved) {
      this.currentTheme = saved;
    } else {
      this.currentTheme = this.prefersDark.matches ? 'dark' : 'light';
    }
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }
  
  setupSystemThemeListener() {
    this.prefersDark.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        // User hat keine Präferenz → System folgen
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}
```

### CSS Variables

```css
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --accent-primary: #4285f4;
  /* ... */
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #1e1e1e;
  --bg-secondary: #121212;
  --text-primary: #e8e8e8;
  --accent-primary: #8ab4f8;
  /* ... */
}

/* Transitions */
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### Toggle-Button

```html
<button id="themeToggle" class="icon-btn" aria-label="Toggle theme">
  🌙
</button>
```

---

## Feature 8: Favicons ✅

### Spezifikation

- **Quelle 1:** `tab.favIconUrl` (Chrome API)
- **Fallback 1:** Google Favicon Service
- **Fallback 2:** Gradient Avatar mit erstem Buchstaben

### Implementierung

**Funktion:** `renderFavicon()` in `utils.js`

```javascript
export function renderFavicon(bookmark) {
  if (bookmark.favicon) {
    return `
      <img src="${bookmark.favicon}" 
           class="favicon" 
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" 
           alt="">
      <div class="favicon-fallback" style="display:none;">
        ${getFallbackFavicon(bookmark.title)}
      </div>
    `;
  }
  return getFallbackFavicon(bookmark.title);
}

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
```

### Favicon beim Speichern

```javascript
async function handleSaveCurrentLink() {
  const tab = await getCurrentTab();
  
  const bookmark = {
    // ...
    favicon: tab.favIconUrl || '',
    // ...
  };
}
```

### CSS

```css
.favicon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
}

.favicon-fallback {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}
```

---

## Feature 7: Ordnerstruktur ❌

### Status: Nicht implementiert

**Grund:** Zu komplex, hoher Aufwand (geschätzt: 1.000+ LOC)

**Konzept (wenn gewünscht):**
- Hierarchische Ordner (Parent/Child)
- Drag & Drop (SortableJS)
- Ordner-Farben
- Verschachtelte Navigation
- Breadcrumbs

**Geschätzte Aufwand:**
- Datenmodell: ~100 LOC
- Drag & Drop: ~300 LOC
- UI-Komponenten: ~400 LOC
- State Management: ~200 LOC

**Priorität:** Niedrig (90% der User brauchen es nicht)

---

## Performance-Metriken

### Code-Größe

| Modul | Zeilen | Anteil |
|-------|--------|--------|
| popup.js | 836 | 52% |
| Module (gesamt) | 769 | 48% |
| **Total** | **1.605** | **100%** |

### Bundle-Größe

- **JavaScript:** ~50 KB (minified)
- **CSS:** ~30 KB (minified)
- **HTML:** ~10 KB
- **Assets:** ~20 KB (Icons)
- **Total:** ~110 KB

### Runtime-Performance

- **Initialisierung:** <100ms
- **Suche (1.000 Bookmarks):** <50ms
- **Render (100 Bookmarks):** <100ms
- **Theme-Wechsel:** <50ms

---

## Browser-spezifische Unterschiede

### Chrome vs Firefox

| Feature | Chrome | Firefox | Unterschied |
|---------|--------|---------|-------------|
| **Import/Export** | Popup | Sidebar | Firefox File-API im Popup limitiert |
| **Keyboard Shortcuts** | 1 Global | 2 Global | Firefox: Popup + Sidebar |
| **API Namespace** | `chrome.*` | `browser.*` | Promise-based (Firefox) |
| **Background** | Service Worker | Background Script | Persistent vs. Event-based |

### Firefox-Sidebar

**Vorteil:** Voller File-API Zugriff  
**Shortcut:** `Ctrl+Shift+B`  
**UI:** Identisch mit Popup, aber breiter

```html
<!-- sidebar.html -->
<link rel="stylesheet" href="css/complete.css">
<link rel="stylesheet" href="css/sidebar.css"> <!-- Extra: Breite -->
<script type="module" src="js/popup.js"></script>
```

