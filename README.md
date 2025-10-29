# 🔖 Miro Link Plugin

> **Version 2.3.0 - Firefox Sidebar Edition** 🚀

Speichere Links mit Passwörtern/Hinweisen, organisiere sie mit Tags, durchsuche sie und öffne sie mit automatischem Passwort-Kopieren in die Zwischenablage.

---

## 🌐 Verfügbar für Chrome & Firefox!

| Browser | Installation | Dokumentation |
|---------|-------------|---------------|
| **Chrome** 🌐 | Siehe unten | Diese Datei |
| **Firefox** 🦊 | [Firefox README](firefox-version/README.md) | [Firefox Guide](firefox-version/FIREFOX_GUIDE.md) |

**Beide Versionen sind vollständig funktionsgleich!**

---

## 📚 Dokumentation

**Schnellzugriff:**
- 📖 [Vollständige Dokumentation](docs/README.md) - Alle Features im Detail
- 🦊 [Firefox Version](firefox-version/README.md) - Firefox-spezifische Anleitung
- 📝 [CHANGELOG](CHANGELOG.md) - Alle Versionen und Änderungen
- 🏗️ [Projekt-Struktur](docs/PROJECT_STRUCTURE.md) - Architektur-Details
- 🔒 [Privacy Policy / Datenschutzerklärung](PRIVACY_POLICY.md) - Datenschutz

---

## 🚀 Quick Start (Chrome)

Diese Anleitung ist für **Chrome**. Für Firefox siehe [firefox-version/README.md](firefox-version/README.md)

### Installation

```bash
# 1. Chrome Extensions öffnen
chrome://extensions/

# 2. Entwicklermodus aktivieren (Toggle oben rechts)

# 3. "Entpackte Erweiterung laden"
# Wähle diesen Root-Ordner aus (NICHT src/ oder firefox-version/)

# 4. Plugin nutzen
# Icon in Toolbar klicken ODER Ctrl+Shift+L (Win) / Cmd+Shift+L (Mac)
```

---

## ✨ Features

### Kern-Funktionen
- 🔗 **Links mit Passwörtern** speichern
- 📋 **Automatisches Kopieren** in Zwischenablage beim Öffnen
- 🏷️ **Tags** (bis zu 5 pro Link) für Organisation
- 🔍 **Suche** in Titel, URL und Passwort
- 🎨 **Favicons** automatisch von Websites
- 📊 **Sortierung** nach Datum oder Titel
- ✏️ **Bearbeiten** und 🗑️ **Löschen** mit Bestätigung

### 🆕 Neu in v2.2.0: Passwort-Sicherheit 🔒

- **Keine Klartext-Passwörter** im HTML-DOM
- **Platzhalter-Darstellung:** `••••••••••••` statt echtem Passwort
- **Toggle-Button (👁️/🙈)** im Formular zum Ein-/Ausblenden
- **Click-to-Reveal:** Passwort nur 3 Sekunden sichtbar
- **Hover-Overlay:** "👁️ Klicken zum Anzeigen"
- **Schutz:** Vor Shoulder Surfing und Screenshots
- **Monospace-Font** für bessere Lesbarkeit

### Weitere Features (v2.0 - v2.1)

- 🌓 **Dark Mode** mit Auto-Detection
- 💾 **Export/Import** (JSON mit 3 Modi)
- ⌨️ **Keyboard Shortcuts** (vollständig)
- 🖱️ **Context Menu** Integration (Rechtsklick)
- 🔄 **Chrome Sync** (automatische Synchronisierung)

**Status:** 7 von 8 Features implementiert (87.5%)  
**Optional nicht implementiert:** Ordnerstruktur (komplex, hoher Aufwand)

---

## 🏗️ Projekt-Struktur (Chrome-Version)

```
miro-link-plugin/           # ← Chrome Extension (Dieser Ordner)
├── manifest.json           # Chrome Manifest V3
├── src/                    # Source Code
│   ├── popup.html         # UI
│   ├── js/
│   │   ├── popup.js       # Haupt-Logik (~620 Zeilen)
│   │   ├── background.js  # Service Worker
│   │   └── modules/       # 7 Module (storage, tags, search, etc.)
│   └── css/
│       ├── main.css       # Import-Datei
│       └── complete.css   # Komplettes CSS (~1.100 Zeilen)
├── assets/icons/          # Extension Icons
├── scripts/               # 🆕 Build & Release Skripte
│   ├── release.sh        # Vollständiger Release-Prozess
│   ├── prepare-release.sh # Release vorbereiten (ZIP, Tag)
│   └── create-github-release.sh # GitHub Release erstellen
├── test/                  # 🆕 Test-Suite
│   ├── manual/           # Manuelle Test-Checklisten
│   ├── fixtures/         # Test-Daten
│   └── test-runner.html  # Automatisierte Browser-Tests
├── docs/                  # Dokumentation
└── firefox-version/       # 🦊 Firefox Port (separater Ordner)
    ├── manifest.json      # Firefox Manifest V2
    ├── src/               # Source mit browser.* API
    ├── README.md          # Firefox-Anleitung
    └── FIREFOX_GUIDE.md   # Detaillierte Firefox-Docs
```

---

## 🔧 Technologie (Chrome)

- **Manifest:** Chrome Manifest V3
- **API:** chrome.* (chrome.storage, chrome.tabs, etc.)
- **Background:** Service Worker (kein persistent background)
- **Modules:** ES6 Modules mit import/export
- **CSS:** CSS Variables für Theming
- **Storage:** Chrome Storage API (sync)
- **Shortcuts:** chrome.commands API

**Gemeinsam mit Firefox:** Vanilla JS, keine Dependencies, modulare Architektur

---

## 👨‍💻 Entwicklung (Chrome)

### Code bearbeiten
```bash
# JavaScript Modul
src/js/modules/tags.js

# CSS
src/css/complete.css

# HTML
src/popup.html
```

### Extension neu laden
```bash
# Nach Änderungen:
chrome://extensions/ → Reload Button bei "Miro Link Plugin"

### 🚀 Release erstellen

Verwende die neuen automatisierten Release-Skripte:

```bash
# Vollständiger Release (empfohlen)
./scripts/release.sh

# Oder Schritt-für-Schritt:
./scripts/prepare-release.sh      # Erstellt ZIP-Dateien, Tag, etc.
./scripts/create-github-release.sh # Uploaded zu GitHub

# Dokumentation
cat scripts/README.md
```

**Features:**
- ✅ Version wird automatisch aus `manifest.json` gelesen
- ✅ Erstellt ZIP-Dateien für Chrome + Firefox
- ✅ Generiert Release Notes automatisch
- ✅ Erstellt SHA256-Checksums
- ✅ Erstellt Git-Tag
- ✅ Uploaded zu GitHub (mit `gh` CLI)

### 🧪 Tests ausführen

```bash
# Manuelle Tests
cat test/manual/chrome-tests.md   # Chrome Checkliste
cat test/manual/firefox-tests.md  # Firefox Checkliste

# Automatisierte Browser-Tests
open test/test-runner.html         # Im Browser öffnen (nach Installation)

# Test-Dokumentation
cat test/README.md
```

# DevTools öffnen (für Debugging):
Rechtsklick auf Plugin-Icon → "Popup prüfen"
```

### Neue Features hinzufügen
1. Modul erstellen: `src/js/modules/myFeature.js`
2. Funktionen exportieren: `export class MyFeatureManager { }`
3. In popup.js importieren: `import { MyFeatureManager } from './modules/myFeature.js';`

---

## 📊 Metriken

- **Browser:** Chrome (Manifest V3) + Firefox (Manifest V2)
- **Modularität:** 7 JS-Module + 8 CSS-Komponenten
- **Code-Zeilen:** ~1.600 (JS) + ~1.100 (CSS)
- **Größte Datei:** 620 Zeilen (war 1.200+ vor Refactoring)
- **Root-Dateien:** 3 (war 20+)
**Status:** ✅ Produktionsbereit | **Version:** 2.3.0 | **Features:** 7/8 (87.5%)
- **Dokumentation:** 15+ Markdown-Dateien

---

## 🦊 Firefox-Version

**Separater Ordner:** `firefox-version/`

Vollständig funktionsgleich mit Chrome-Version, aber mit:
- Manifest V2 (Firefox-Standard)
- browser.* API statt chrome.*
- Background Script statt Service Worker

**Zur Firefox-Version wechseln:** [firefox-version/README.md](firefox-version/README.md)

---

## 🔐 Berechtigungen (Chrome)

- `storage` - Speichert Bookmarks lokal/sync
- `activeTab` - Zugriff auf aktuelle URL/Titel
- `clipboardWrite` - Kopiert Passwort beim Öffnen
- `contextMenus` - Rechtsklick-Integration
- `notifications` - Feedback-Meldungen
- `scripting` - Context Menu Prompts

**Keine Daten werden an externe Server gesendet!**

---

## 📄 Lizenz

MIT License

---

## 📞 Support & Links

- **GitHub:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager
- **Issues:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager/issues
- **Dokumentation:** [docs/README.md](docs/README.md)
- **Firefox:** [firefox-version/README.md](firefox-version/README.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

**Status:** ✅ Produktionsbereit | **Version:** 2.2.0 | **Features:** 7/8 (87.5%)

**Verfügbar für:** Chrome 🌐 & Firefox 🦊

**Miro Link Plugin - Deine Passwörter und Links sicher & organisiert! 🔒✨**

