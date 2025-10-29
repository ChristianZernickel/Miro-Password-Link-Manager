# Miro Link Plugin - Knowledge Base

**Version:** 2.3.0  
**Letzte Aktualisierung:** 29. Oktober 2025  
**Status:** Production Ready ✅

---

## 📖 Inhaltsverzeichnis

1. [Projekt-Übersicht](#projekt-übersicht)
2. [Architektur](#architektur)
3. [Features](#features)
4. [Code-Struktur](#code-struktur)
5. [Browser-Kompatibilität](#browser-kompatibilität)
6. [Build & Release](#build--release)
7. [Testing](#testing)
8. [Wichtige Konzepte](#wichtige-konzepte)

---

## Projekt-Übersicht

### Was ist das Miro Link Plugin?

Eine Browser-Extension (Chrome & Firefox) zum Speichern von Links mit Passwörtern/Hinweisen. 
Hauptfunktion: Beim Öffnen eines Links wird das zugehörige Passwort automatisch in die Zwischenablage kopiert.

### Kernfunktionen
- 🔗 Links mit Passwörtern speichern
- 📋 Automatisches Clipboard-Kopieren beim Öffnen
- 🏷️ Organisation mit Tags (max. 5 pro Link)
- 🔍 Suche in Titel, URL, Passwort, Tags
- 🎨 Automatische Favicons
- 🌓 Dark Mode
- 💾 Export/Import (JSON)
- ⌨️ Keyboard Shortcuts
- 🖱️ Context Menu Integration

### Versionsgeschichte
- **v2.3.0** (aktuell) - Firefox Sidebar Edition + Repository Refactoring
- **v2.2.0** - Password Security Edition (Obfuskierung, Click-to-Reveal)
- **v2.1.0** - Usability & Modernization Update
- **v2.0.0** - Projekt-Umstrukturierung, Module

---

## Architektur

### Projekt-Struktur

```
miro-link-plugin/
├── manifest.json              # Chrome Manifest V3
├── src/                       # Chrome Source Code
│   ├── popup.html
│   ├── js/
│   │   ├── popup.js          # Haupt-Koordinator (~836 Zeilen)
│   │   ├── background.js     # Service Worker
│   │   └── modules/          # 7 Module (~769 Zeilen total)
│   └── css/
│       └── complete.css      # Komplettes CSS (~1.100 Zeilen)
│
├── firefox-version/           # Firefox-Port (Manifest V2)
│   ├── manifest.json         # Firefox Manifest
│   └── src/                  # Analog zu Chrome mit browser.* API
│
├── scripts/                   # Build & Release Scripts
│   ├── release.sh            # Vollständiger Release-Workflow
│   ├── prepare-release.sh    # Release vorbereiten (ZIP, Tag)
│   └── create-github-release.sh
│
├── test/                      # Test-Suite
│   ├── test-runner.html      # Automatisierte Tests
│   ├── manual/               # Test-Checklisten
│   └── fixtures/             # Test-Daten
│
├── assets/icons/              # Extension Icons
├── docs/                      # Dokumentation
│   └── knowledge_base/       # Diese Knowledge Base
└── releases/                  # Release-Artefakte
```

### Module-Architektur

Das Projekt ist vollständig modular aufgebaut:

| Modul | Datei | Zeilen | Verantwortung |
|-------|-------|--------|---------------|
| **Storage** | `storage.js` | ~77 | Chrome/Browser Storage API |
| **Tags** | `tags.js` | ~96 | Tag-Management (max 5, Filterung) |
| **Search** | `search.js` | ~82 | Suche & Sortierung |
| **Export/Import** | `exportImport.js` | ~159 | JSON Export/Import, Validierung |
| **Theme** | `theme.js` | ~90 | Dark Mode Management |
| **Keyboard** | `keyboard.js` | ~170 | Keyboard Shortcuts |
| **Utils** | `utils.js` | ~95 | Hilfsfunktionen (ID, Date, HTML) |
| **Popup** | `popup.js` | ~836 | Haupt-Koordinator, UI-Logik |

**Total:** ~1.605 Zeilen JavaScript

### Datenmodell

```javascript
// Bookmark-Objekt
{
  id: "unique-id",              // generiert mit generateId()
  title: "GitHub",              // String
  url: "https://github.com",    // String (validiert)
  password: "MyPassword123",     // String (obfuskiert angezeigt)
  tags: ["dev", "tools"],       // Array<string> (max 5)
  favicon: "https://...",       // String (optional)
  createdAt: 1698000000000      // Number (timestamp)
}
```

---

## Features

### Feature-Status (7/8 implementiert - 87.5%)

| # | Feature | Status | Version | Details |
|---|---------|--------|---------|---------|
| 1 | **Tags/Kategorien** | ✅ | v2.0.0 | Max 5 Tags, Filter, Validierung |
| 2 | **Suche & Filter** | ✅ | v2.0.0 | Echtzeit-Suche, 4 Sortierungen |
| 3 | **Export/Import** | ✅ | v2.1.0 | JSON, 3 Modi, Duplikat-Erkennung |
| 4 | **Keyboard Shortcuts** | ✅ | v2.1.0 | Global + Popup-intern |
| 5 | **Context Menu** | ✅ | v2.1.0 | Rechtsklick-Integration |
| 6 | **Dark Mode** | ✅ | v2.0.0 | Auto-Detection, Toggle |
| 7 | **Ordnerstruktur** | ❌ | - | Nicht implementiert (komplex) |
| 8 | **Favicons** | ✅ | v2.0.0 | Automatisch, Fallbacks |

### Feature-Details

#### 1. Tags/Kategorien
- **Max 5 Tags** pro Bookmark
- **Validierung:** 2-20 Zeichen, lowercase, alphanumerisch + `-_`
- **Filter:** Multi-Tag mit AND-Verknüpfung
- **UI:** Gradient-Badges, Click-to-Filter
- **Klasse:** `TagsManager` (tags.js)

#### 2. Suche & Filter
- **Felder:** Titel, URL, Passwort, Tags
- **Sortierung:** Neueste/Älteste, Titel A-Z/Z-A
- **Debounce:** 300ms
- **Case-insensitive**
- **Klasse:** `SearchManager` (search.js)

#### 3. Export/Import
- **3 Modi:**
  1. Nur Links (ohne Passwörter)
  2. Vollständig (mit Passwörtern)
  3. Mit Verschlüsselung (optional)
- **Validierung:** JSON-Struktur, Pflichtfelder
- **Duplikat-Erkennung:** Nach URL
- **Klasse:** `ExportImportManager` (exportImport.js)

#### 4. Keyboard Shortcuts
- **Global:** `Ctrl+Shift+L` (Chrome), `Ctrl+Shift+L/B` (Firefox)
- **Popup:**
  - `Ctrl+N`: Neuer Link
  - `Ctrl+F`: Suche fokussieren
  - `Ctrl+E`: Export
  - `Escape`: Modal schließen
  - `Enter`: Formular absenden
- **Klasse:** `KeyboardManager` (keyboard.js)

#### 5. Context Menu
- **"Bei Miro speichern"** bei Rechtsklick auf Link
- **Prompts:** Titel + Passwort
- **Integration:** chrome.contextMenus API
- **Datei:** background.js

#### 6. Dark Mode
- **Auto-Detection:** System-Theme
- **Toggle:** 🌙/☀️ Button
- **CSS Variables:** `--bg-primary`, `--text-primary`, etc.
- **Persistenz:** localStorage
- **Klasse:** `ThemeManager` (theme.js)

#### 8. Favicons
- **Quelle 1:** `tab.favIconUrl`
- **Fallback 1:** Google Favicon Service
- **Fallback 2:** Gradient Avatar mit erstem Buchstaben
- **Funktion:** `renderFavicon()` (utils.js)

---

## Code-Struktur

### JavaScript

#### popup.js (Haupt-Koordinator)
```javascript
// Imports
import { loadBookmarks, saveBookmarks, getCurrentTab } from './modules/storage.js';
import { TagsManager } from './modules/tags.js';
// ...

// State
let currentBookmarks = [];
let editingBookmarkId = null;

// Manager Instanzen
const tagsManager = new TagsManager();
const searchManager = new SearchManager();
// ...

// Initialisierung
async function init() {
  await themeManager.init();
  await loadData();
  setupEventListeners();
  keyboardManager.init();
}

// Haupt-Funktionen
function renderBookmarks() { /* ... */ }
function handleSaveCurrentLink() { /* ... */ }
function handleOpenBookmark(id) { /* ... */ }
// ...
```

#### Module Pattern
```javascript
// storage.js - Funktionen
export async function loadBookmarks() { /* ... */ }
export async function saveBookmarks(bookmarks) { /* ... */ }

// tags.js - Klasse
export class TagsManager {
  constructor() {
    this.currentTags = new Set();
    this.activeTags = new Set();
    this.tempTags = [];
  }
  
  addTag(tag) { /* ... */ }
  validateTag(tag) { /* ... */ }
  toggleTagFilter(tag) { /* ... */ }
}
```

### CSS

#### CSS Variables für Theming
```css
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --accent-primary: #4285f4;
  /* ... */
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #1e1e1e;
  --text-primary: #e8e8e8;
  --accent-primary: #8ab4f8;
  /* ... */
}
```

#### Komponenten
- Header, Buttons, Bookmarks
- Search, Tags, Modal
- Settings, Forms

---

## Browser-Kompatibilität

### Chrome/Chromium/Edge

**Manifest:** V3  
**API:** `chrome.*`  
**Background:** Service Worker  

```json
{
  "manifest_version": 3,
  "permissions": [
    "storage", "activeTab", "clipboardWrite",
    "contextMenus", "notifications", "scripting"
  ],
  "background": {
    "service_worker": "src/js/background.js"
  }
}
```

### Firefox

**Manifest:** V2  
**API:** `browser.*`  
**Background:** Background Script  
**Special:** Sidebar-Modus für Import/Export

```json
{
  "manifest_version": 2,
  "permissions": [
    "storage", "activeTab", "clipboardWrite",
    "contextMenus", "notifications"
  ],
  "background": {
    "scripts": ["src/js/background.js"]
  },
  "sidebar_action": {
    "default_panel": "src/sidebar.html"
  }
}
```

### API-Unterschiede

| Feature | Chrome | Firefox |
|---------|--------|---------|
| **Storage** | `chrome.storage.sync` | `browser.storage.sync` |
| **Tabs** | `chrome.tabs` | `browser.tabs` |
| **Notifications** | `chrome.notifications` | `browser.notifications` |
| **Context Menu** | `chrome.contextMenus` | `browser.contextMenus` |
| **Clipboard** | `navigator.clipboard` | `navigator.clipboard` |

---

## Build & Release

### Automatisierter Release-Prozess

```bash
# 1. Version in manifest.json ändern
vim manifest.json  # "version": "X.Y.Z"
vim firefox-version/manifest.json

# 2. CHANGELOG.md aktualisieren
vim CHANGELOG.md

# 3. Vollständigen Release erstellen
./scripts/release.sh
```

### Release-Skripte

#### prepare-release.sh
- Liest Version automatisch aus `manifest.json`
- Erstellt `releases/vX.Y.Z/` Ordner
- Packt Chrome-Version (ZIP)
- Packt Firefox-Version (ZIP)
- Packt Source Code (ZIP)
- Generiert Release Notes
- Erstellt SHA256-Checksums
- Erstellt Git-Tag

#### create-github-release.sh
- Prüft GitHub CLI (`gh`)
- Pusht Git-Tag zu GitHub
- Erstellt GitHub Release
- Uploaded alle ZIPs + Checksums

### Release-Artefakte

```
releases/vX.Y.Z/
├── miro-link-plugin-chrome-vX.Y.Z.zip
├── miro-link-plugin-firefox-vX.Y.Z.zip
├── miro-link-plugin-source-vX.Y.Z.zip
├── RELEASE_NOTES.md
└── SHA256SUMS.txt
```

---

## Testing

### Test-Suite Struktur

```
test/
├── README.md                 # Test-Dokumentation
├── test-runner.html         # Browser-basierte Tests
├── test-settings.html       # Settings-Test
├── manual/
│   ├── chrome-tests.md     # 100+ Chrome Tests
│   └── firefox-tests.md    # 110+ Firefox Tests
└── fixtures/
    ├── sample-bookmarks.json
    └── invalid-data.json
```

### Test-Kategorien

1. **Storage Tests** - CRUD, Sync
2. **Export/Import Tests** - Validierung, Duplikate
3. **Tags Tests** - Limit, Filter
4. **Search Tests** - Case-insensitive, Multi-Field
5. **UI Tests** - Dark Mode, Modals
6. **Security Tests** - Passwort-Obfuskierung, XSS

### Test ausführen

```bash
# Manuelle Tests
cat test/manual/chrome-tests.md
cat test/manual/firefox-tests.md

# Automatisierte Tests (im Browser nach Installation)
open test/test-runner.html
```

---

## Wichtige Konzepte

### 1. Passwort-Sicherheit

#### Obfuskierung im Formular
- Toggle-Button (👁️/🙈)
- CSS: `blur` + `-webkit-text-security: disc`
- Auto-Show bei Focus

#### Obfuskierung in Liste
- Darstellung: `••••••••••••` (12 Sternchen)
- Echtes Passwort im `data-password` Attribut
- Click-to-Reveal: 3 Sekunden sichtbar
- Kein Klartext im HTML-DOM

### 2. Storage-Strategie

```javascript
// Chrome/Firefox Storage Sync
chrome.storage.sync.set({ bookmarks: [...] });
chrome.storage.sync.get('bookmarks', (result) => {
  const bookmarks = result.bookmarks || [];
});

// Max Size: 100KB (Chrome), 8KB pro Item
// Automatische Synchronisierung zwischen Geräten
```

### 3. Modulare Architektur

**Vorteile:**
- Kleine, fokussierte Dateien
- Klare Verantwortlichkeiten
- Einfache Wartung
- Testbarkeit
- Wiederverwendbarkeit

**Pattern:**
- Storage: Pure Functions
- Manager: ES6 Classes
- Utils: Pure Functions
- Popup: Coordinator Pattern

### 4. CSS-Theming

```css
/* Variables definieren */
:root { --color: blue; }
[data-theme="dark"] { --color: lightblue; }

/* Variables verwenden */
.element { color: var(--color); }
```

**Vorteile:**
- Ein Ort für Theme-Definition
- Automatische Vererbung
- Einfacher Theme-Wechsel

### 5. Fehlerbehandlung

```javascript
try {
  await saveBookmarks(bookmarks);
  showMessage('✓ Gespeichert', 'success');
} catch (error) {
  console.error('Save error:', error);
  showMessage('Fehler beim Speichern', 'error');
}
```

**Best Practices:**
- Try-Catch um async Operationen
- User-Feedback mit showMessage()
- Console-Logging für Debugging
- Graceful Degradation

---

## Schnellreferenz

### Häufige Aufgaben

#### Bookmark hinzufügen
```javascript
const bookmark = {
  id: generateId(),
  title: tab.title,
  url: tab.url,
  password: 'secret',
  tags: ['work', 'dev'],
  favicon: tab.favIconUrl,
  createdAt: Date.now()
};
currentBookmarks.push(bookmark);
await saveBookmarks(currentBookmarks);
```

#### Suche implementieren
```javascript
const results = searchManager.search(bookmarks, query);
const sorted = searchManager.sort(results, sortBy);
```

#### Tag-Filter anwenden
```javascript
tagsManager.toggleTagFilter('work');
const filtered = tagsManager.filterByTags(bookmarks);
```

#### Theme wechseln
```javascript
await themeManager.toggleTheme();
```

### Wichtige Dateien

| Zweck | Datei |
|-------|-------|
| Chrome Manifest | `manifest.json` |
| Firefox Manifest | `firefox-version/manifest.json` |
| Haupt-UI | `src/popup.html` |
| Haupt-Logik | `src/js/popup.js` |
| Background Worker | `src/js/background.js` |
| CSS | `src/css/complete.css` |
| Release | `scripts/release.sh` |
| Tests | `test/test-runner.html` |

---

## Nächste Schritte / TODOs

### Für Entwickler

1. ✅ Repository refactored (v2.3.0+)
2. ✅ Test-Suite erstellt
3. ✅ Release-Skripte automatisiert
4. ⏳ CI/CD Pipeline (GitHub Actions)
5. ⏳ Automatisierte Tests in CI
6. ⏳ Chrome Web Store Veröffentlichung
7. ⏳ Firefox Add-ons Veröffentlichung

### Für Features

1. ❌ Ordnerstruktur (komplex, optional)
2. ⏳ Passwort-Generator
3. ⏳ Bulk-Operationen
4. ⏳ CSV Export/Import
5. ⏳ Browser-Sync Verbesserungen

---

**Letzte Aktualisierung:** 29. Oktober 2025  
**Maintainer:** Christian Zernickel  
**Lizenz:** MIT

