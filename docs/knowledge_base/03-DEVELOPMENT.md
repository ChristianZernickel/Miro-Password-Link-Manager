# Development & Release - Knowledge Base

## Development Workflow

### Setup

```bash
# 1. Repository klonen
git clone https://github.com/ChristianZernickel/Miro-Password-Link-Manager.git
cd miro-link-plugin

# 2. Chrome: Extension laden
# chrome://extensions/ → "Entwicklermodus" → "Entpackte Erweiterung laden" → Root-Ordner

# 3. Firefox: Extension laden
cd firefox-version
# about:debugging → "Temporäres Add-on laden" → manifest.json
```

### Entwicklungs-Zyklus

```bash
# 1. Code ändern
vim src/js/popup.js

# 2. Extension reload
# Chrome: chrome://extensions/ → Reload-Button
# Firefox: about:debugging → Reload

# 3. Testing
open test/test-runner.html

# 4. Commit
git add .
git commit -m "feat: neue Funktion"
```

### Hot Reload

**Chrome:** Automatisch bei HTML/CSS, manuell bei JS  
**Firefox:** Immer manuell (web-ext mit --reload)

```bash
# Firefox mit Auto-Reload
cd firefox-version
web-ext run --reload
```

---

## Testing

### Manuelle Tests

#### Chrome
```bash
cat test/manual/chrome-tests.md

# Checkliste durchgehen:
# ✅ Installation & Setup (5 Tests)
# ✅ Bookmark-Verwaltung (15 Tests)
# ✅ Tags (6 Tests)
# ✅ Suche (7 Tests)
# ✅ Sortierung (5 Tests)
# ✅ Passwort-Sicherheit (10 Tests)
# ✅ Clipboard (4 Tests)
# ✅ Export/Import (12 Tests)
# ✅ Dark Mode (6 Tests)
# ✅ Settings (5 Tests)
# ✅ Keyboard Shortcuts (5 Tests)
# ✅ Context Menu (6 Tests)
# ✅ Chrome Sync (3 Tests)
# ✅ Responsive Design (4 Tests)
# ✅ Edge Cases (7 Tests)
# ✅ Sicherheit (4 Tests)

# Total: 100+ Tests
```

#### Firefox
```bash
cat test/manual/firefox-tests.md

# Zusätzlich zu Chrome:
# ✅ Sidebar-Modus (5 Tests)
# ✅ Browser-API Kompatibilität (5 Tests)
# ✅ Firefox Sync (3 Tests)

# Total: 110+ Tests
```

### Automatisierte Tests

```bash
# 1. Extension installieren
# 2. test-runner.html im Browser öffnen
open test/test-runner.html

# Tests:
# ✅ Storage Tests (CRUD, Sync)
# ✅ Export/Import Tests (Validierung)
# ✅ Tags Tests (Limit, Duplikate)
# ✅ Search Tests (Case-insensitive)
```

#### Test-Runner Implementierung

```html
<!-- test/test-runner.html -->
<script>
// Extension APIs verfügbar?
const api = typeof chrome !== 'undefined' ? chrome : browser;

// Storage Test
async function testStorage() {
  const testData = { bookmarks: [{ id: '1', title: 'Test' }] };
  await api.storage.sync.set(testData);
  const result = await api.storage.sync.get('bookmarks');
  return result.bookmarks.length === 1;
}

// Export Test
function testExport() {
  const data = { bookmarks: [{ id: '1', title: 'Test' }] };
  const json = JSON.stringify(data);
  const parsed = JSON.parse(json);
  return parsed.bookmarks.length === 1;
}

// Alle Tests ausführen
runAllTests();
</script>
```

### Test-Fixtures

```bash
# Sample-Daten
cat test/fixtures/sample-bookmarks.json

# Ungültige Daten für Edge-Cases
cat test/fixtures/invalid-data.json
```

---

## Build & Release

### Version ändern

```bash
# 1. Version in manifest.json
vim manifest.json
# "version": "2.4.0"

# 2. Version in Firefox-Manifest
vim firefox-version/manifest.json
# "version": "2.4.0"

# 3. CHANGELOG.md aktualisieren
vim CHANGELOG.md

## [2.4.0] - 2025-XX-XX

### Added
- Neue Funktion X

### Fixed
- Bug Y
```

### Automatisierter Release

```bash
# Vollständiger Release (empfohlen)
./scripts/release.sh

# Was passiert:
# 1. Version aus manifest.json lesen (automatisch!)
# 2. Git-Status prüfen (muss sauber sein)
# 3. Release-Ordner erstellen: releases/v2.4.0/
# 4. Chrome ZIP erstellen (mit manifest.json) ✅
# 5. Firefox ZIP erstellen (mit manifest.json) ✅
# 6. Source ZIP erstellen
# 7. Release Notes generieren
# 8. SHA256 Checksums erstellen
# 9. Git-Tag erstellen: v2.4.0
# 10. Frage: GitHub Release erstellen?
```

**Wichtig:** Beide ZIPs enthalten jetzt die `manifest.json`:
- Chrome: `/manifest.json` + `src/` + `assets/`
- Firefox: `/manifest.json` + `src/` + `assets/`

**Fix (29. Okt 2025):** Frühere Versionen packten nur `src/` ohne manifest.json.
Dies wurde behoben - siehe `RELEASE_FIX.md` für Details.

### Manueller Release

```bash
# Schritt 1: Release vorbereiten
./scripts/prepare-release.sh

# Output:
# releases/v2.4.0/
# ├── miro-link-plugin-chrome-v2.4.0.zip
# ├── miro-link-plugin-firefox-v2.4.0.zip
# ├── miro-link-plugin-source-v2.4.0.zip
# ├── RELEASE_NOTES.md
# └── SHA256SUMS.txt

# Schritt 2: GitHub Release (optional)
./scripts/create-github-release.sh

# Voraussetzungen:
# - GitHub CLI installiert: brew install gh
# - Authentifiziert: gh auth login
```

### Release-Skripte Details

#### prepare-release.sh

```bash
#!/bin/bash
set -e

# Version automatisch lesen
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | head -1 | sed 's/"version": "\(.*\)"/\1/')

# Git Status prüfen
if [[ -n $(git status -s) ]]; then
    echo "❌ Git nicht sauber!"
    exit 1
fi

# ZIPs erstellen
cd src
zip -r "../releases/v${VERSION}/miro-link-plugin-chrome-v${VERSION}.zip" .
cd ..

cd firefox-version/src
zip -r "../../releases/v${VERSION}/miro-link-plugin-firefox-v${VERSION}.zip" .
cd ../..

# Source Code
zip -r "releases/v${VERSION}/miro-link-plugin-source-v${VERSION}.zip" \
    src firefox-version assets scripts test \
    manifest.json README.md CHANGELOG.md

# Checksums
cd "releases/v${VERSION}"
shasum -a 256 *.zip > SHA256SUMS.txt

# Git Tag
git tag -a "v${VERSION}" -m "Release v${VERSION}"
```

#### create-github-release.sh

```bash
#!/bin/bash
set -e

VERSION=$(grep -o '"version": "[^"]*"' manifest.json | head -1 | sed 's/"version": "\(.*\)"/\1/')
RELEASE_DIR="releases/v${VERSION}"

# GitHub CLI prüfen
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI nicht installiert!"
    exit 1
fi

# Tag pushen
git push origin "v${VERSION}"

# Release erstellen
gh release create "v${VERSION}" \
    --title "Miro Link Plugin v${VERSION}" \
    --notes-file "${RELEASE_DIR}/RELEASE_NOTES.md" \
    "${RELEASE_DIR}/miro-link-plugin-chrome-v${VERSION}.zip" \
    "${RELEASE_DIR}/miro-link-plugin-firefox-v${VERSION}.zip" \
    "${RELEASE_DIR}/miro-link-plugin-source-v${VERSION}.zip" \
    "${RELEASE_DIR}/SHA256SUMS.txt"
```

---

## Veröffentlichung

### Chrome Web Store

```bash
# 1. Chrome Developer Dashboard
# https://chrome.google.com/webstore/devconsole

# 2. ZIP hochladen
# releases/v2.4.0/miro-link-plugin-chrome-v2.4.0.zip

# 3. Store-Listing
# Titel: Miro Link Plugin
# Beschreibung: (aus README.md)
# Screenshots: (4-5 Screenshots)
# Kategorie: Productivity

# 4. Datenschutz
# Privacy Policy URL: https://...
# Berechtigungen erklären

# 5. Review einreichen
# Dauer: ~1-3 Tage
```

### Firefox Add-ons

```bash
# 1. Firefox Add-on Developer Hub
# https://addons.mozilla.org/developers/

# 2. ZIP hochladen
# releases/v2.4.0/miro-link-plugin-firefox-v2.4.0.zip

# 3. Source Code hochladen (Pflicht!)
# releases/v2.4.0/miro-link-plugin-source-v2.4.0.zip

# 4. Add-on-Details
# Name: Miro Link Plugin
# Beschreibung: (aus README.md)
# Kategorie: Bookmarks & Tabs

# 5. Review einreichen
# Dauer: ~1-7 Tage
# Mozilla prüft Source Code!
```

---

## Debugging

### Chrome DevTools

```bash
# 1. Popup öffnen
# Extension-Icon klicken

# 2. DevTools öffnen
# Rechtsklick auf Popup → "Prüfen"

# 3. Console, Network, Storage tabs
console.log('Debug:', bookmarks);
debugger; // Breakpoint
```

### Firefox DevTools

```bash
# 1. about:debugging öffnen
# "Inspect" Button auf Extension

# 2. Console, Storage tabs
console.log('Debug:', bookmarks);

# 3. Web Console (für Background Script)
# Browser Console (Ctrl+Shift+J)
```

### Logging

```javascript
// Development
console.log('Bookmarks loaded:', bookmarks);
console.error('Error:', error);
console.table(bookmarks); // Tabelle

// Production
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

### Breakpoints

```javascript
// Debugger Statement
function saveBookmarks(bookmarks) {
  debugger; // Pausiert hier
  chrome.storage.sync.set({ bookmarks });
}

// Conditional Breakpoint (DevTools)
// Rechtsklick auf Zeilennummer → "Add conditional breakpoint"
// Bedingung: bookmarks.length > 10
```

### Storage Inspector

```bash
# Chrome
# DevTools → Application → Storage → Extension Storage

# Firefox
# DevTools → Storage → Extension Storage

# Oder via Code:
chrome.storage.sync.get(null, (items) => {
  console.log('Alle Daten:', items);
});
```

---

## Common Issues & Solutions

### Issue: Extension lädt nicht

```bash
# Check 1: manifest.json Syntax
cat manifest.json | python -m json.tool

# Check 2: Pfade korrekt?
ls -la src/js/popup.js
ls -la src/css/complete.css

# Check 3: Permissions?
# manifest.json → "permissions": [...]
```

### Issue: Module not found

```javascript
// ❌ Falsch
import { loadBookmarks } from './storage.js';

// ✅ Richtig (relativer Pfad)
import { loadBookmarks } from './modules/storage.js';

// Check: Pfad in popup.html korrekt?
<script type="module" src="js/popup.js"></script>
```

### Issue: Storage funktioniert nicht

```javascript
// Chrome Storage API ist asynchron!

// ❌ Falsch
const bookmarks = chrome.storage.sync.get('bookmarks');

// ✅ Richtig (Promise)
const result = await chrome.storage.sync.get('bookmarks');
const bookmarks = result.bookmarks || [];

// ✅ Richtig (Callback)
chrome.storage.sync.get('bookmarks', (result) => {
  const bookmarks = result.bookmarks || [];
});
```

### Issue: Import funktioniert nicht (Firefox)

```bash
# Firefox Popup hat limitierte File-API!
# Lösung: Sidebar verwenden

# 1. Sidebar öffnen (Ctrl+Shift+B)
# 2. Import-Button im Sidebar klicken
# 3. JSON-Datei auswählen
```

### Issue: CSS lädt nicht

```html
<!-- Check: Pfad korrekt? -->
<link rel="stylesheet" href="css/complete.css">

<!-- Check: Datei existiert? -->
ls -la src/css/complete.css

<!-- Check: DevTools Network tab -->
<!-- Zeigt 404 oder andere Fehler -->
```

### Issue: Dark Mode funktioniert nicht

```javascript
// Check 1: Theme wird gesetzt?
console.log(document.body.getAttribute('data-theme'));

// Check 2: CSS Variables definiert?
// DevTools → Computed → Custom properties
console.log(getComputedStyle(document.body).getPropertyValue('--bg-primary'));

// Check 3: ThemeManager initialisiert?
await themeManager.init();
```

---

## Performance-Optimierung

### 1. Debouncing

```javascript
// ❌ Ohne Debounce: 100 Aufrufe/Sekunde
searchInput.addEventListener('input', () => {
  renderBookmarks(); // Zu oft!
});

// ✅ Mit Debounce: 3 Aufrufe/Sekunde
let timeout;
searchInput.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => renderBookmarks(), 300);
});
```

### 2. Virtual Scrolling

```javascript
// TODO: Bei 1.000+ Bookmarks
// Nur sichtbare Items rendern

function renderVirtual(items, start, end) {
  const visible = items.slice(start, end);
  return visible.map(renderBookmarkItem).join('');
}
```

### 3. CSS statt JS

```css
/* ✅ Transitions in CSS */
.modal {
  opacity: 0;
  transition: opacity 0.3s;
}

.modal.show {
  opacity: 1;
}
```

```javascript
// ❌ Animationen in JS vermeiden
function fadeIn(element) {
  let opacity = 0;
  const interval = setInterval(() => {
    opacity += 0.1;
    element.style.opacity = opacity;
    if (opacity >= 1) clearInterval(interval);
  }, 30);
}
```

### 4. Set statt Array

```javascript
// ✅ Set für Lookups (O(1))
const tagSet = new Set(tags);
if (tagSet.has('work')) { /* ... */ }

// ❌ Array für Lookups (O(n))
if (tags.includes('work')) { /* ... */ }
```

---

## Code-Qualität

### ESLint (TODO)

```bash
# Installation
npm install --save-dev eslint

# Config
npx eslint --init

# Run
npx eslint src/js/**/*.js
```

### Prettier (TODO)

```bash
# Installation
npm install --save-dev prettier

# Config (.prettierrc)
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2
}

# Run
npx prettier --write src/js/**/*.js
```

### TypeScript (Optional)

```bash
# Für bessere IDE-Unterstützung
# JSDoc statt TypeScript

/**
 * Lädt alle Bookmarks aus dem Storage
 * @returns {Promise<Array<Bookmark>>}
 */
export async function loadBookmarks() {
  // ...
}
```

---

## CI/CD (TODO)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Extension

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          # TODO: Automatisierte Tests
          echo "Tests laufen..."
```

### Automatischer Release

```yaml
# .github/workflows/release.yml
name: Create Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Create Release
        run: ./scripts/prepare-release.sh
      - name: Upload to GitHub
        uses: actions/create-release@v1
```

---

## Dokumentation

### Inline-Kommentare

```javascript
/**
 * Rendert alle Bookmarks mit aktuellen Filtern
 * Pipeline: Tag-Filter → Suche → Sortierung → Render
 */
function renderBookmarks() {
  // 1. Daten kopieren (Immutability)
  let filtered = [...currentBookmarks];
  
  // 2. Filter-Pipeline
  filtered = tagsManager.filterByTags(filtered);
  filtered = searchManager.search(filtered, query);
  
  // 3. Sortieren und rendern
  const sorted = searchManager.sort(filtered);
  renderBookmarkItems(sorted);
}
```

### README-Struktur

```markdown
# Projekt-Name

> Kurzbeschreibung

## Features
- Feature 1
- Feature 2

## Installation
\`\`\`bash
Anleitung
\`\`\`

## Verwendung
\`\`\`bash
Beispiele
\`\`\`

## Entwicklung
\`\`\`bash
Setup für Entwickler
\`\`\`

## Lizenz
MIT
```

---

## Best Practices Checkliste

- [ ] Code ist modular (Module < 200 Zeilen)
- [ ] Keine Duplikate (DRY)
- [ ] Fehlerbehandlung überall (try-catch)
- [ ] XSS-Schutz (escapeHtml)
- [ ] Immutability (keine Mutations)
- [ ] Async/Await (statt Callbacks)
- [ ] Kommentare bei komplexer Logik
- [ ] Tests vorhanden (manuell oder automatisiert)
- [ ] Git-Commits sind atomar
- [ ] README ist aktuell
- [ ] CHANGELOG ist gepflegt

---

**Letzte Aktualisierung:** 29. Oktober 2025

