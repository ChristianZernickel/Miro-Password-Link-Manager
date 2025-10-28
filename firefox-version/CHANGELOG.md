# Changelog - Miro Link Plugin

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).

---

## [2.1.0] - 2024-10-28 - "Usability & Modernization Update"

### ✨ Neue Features

#### Context Menu Verbesserungen
- **Beschreibungs-Eingabe beim Rechtsklick:** Beim Speichern über das Context Menu erscheint jetzt ein Prompt zur direkten Eingabe der Beschreibung
- Bei markiertem Text wird dieser als Standard-Beschreibung vorausgefüllt
- Notification nach erfolgreichem Speichern

#### Verbessertes Click-Verhalten
- **Direktes Link-Öffnen:** Click auf Bookmark öffnet jetzt direkt den Link (ohne aufklappen zu müssen)
- **Expand-Button:** Nur der ▶ Button klappt Bookmarks auf/zu
- Verbessertes visuelles Feedback am Expand-Button (Hover-Effekt mit hellblauem Hintergrund)

#### Auto Theme Sync
- Theme passt sich jetzt automatisch an System-Theme-Änderungen an (ohne Extension-Reload)

### 🔧 Technische Verbesserungen

#### Deprecated APIs entfernt
- `MediaQueryList.addListener` → `addEventListener` (moderne API)
- `navigator.platform` → `navigator.userAgentData` mit Fallback
- `window` → `globalThis` (moderne Best Practice)
- iOS-Geräte werden jetzt erkannt (iPad, iPhone)

#### Projekt-Umstrukturierung
- Modulare JavaScript-Architektur mit ES6 Modules
- popup.js aufgeteilt in 7 Module (storage, tags, search, exportImport, theme, keyboard, utils)
- CSS in 8 Komponenten organisiert
- Dokumentation nach `docs/` verschoben
- Assets nach `assets/` verschoben
- Alle Source-Dateien in `src/` strukturiert

### 🐛 Bug Fixes
- Background.js Syntax-Fehler behoben
- CSS-Import-Probleme gelöst (complete.css erstellt)
- Alle JavaScript Module ohne Syntax-Fehler
- getFallbackFavicon Import-Fehler behoben
- utils.js "illegal return statement" behoben

### 📚 Dokumentation
- DEPRECATION_FIXES.md erstellt
- PROJECT_STRUCTURE.md mit detaillierter Architektur
- RESTRUCTURE_COMPLETE.md für Projekt-Umstrukturierung
- Alle READMEs aktualisiert

### 🔒 Berechtigungen
- `scripting` Permission hinzugefügt (für Context Menu Prompts)

---

## [2.0.0] - 2024-10-26 - "Feature Complete Release"

### ✨ Neue Features

#### Tags & Kategorien
- Bis zu 5 Tags pro Bookmark
- Multi-Tag-Filter mit AND-Verknüpfung
- Validierung und intelligente Verwaltung
- Gradient-Badges für visuelle Unterscheidung

#### Favicons
- Automatische Website-Icons
- Google Favicon Service als Fallback
- Gradient-Avatare mit ersten Buchstaben als letzter Fallback

#### Suche & Filter
- Echtzeit-Suche mit Debounce (300ms)
- Durchsuche Titel, URL, Beschreibung und Tags
- Sortierung: Datum (neu/alt), Titel (A-Z/Z-A)
- Kombinierbar mit Tag-Filtern

#### Dark Mode
- Vollständiger Dark Mode mit CSS Variables
- Theme-Toggle Button (🌙/☀️)
- Automatische System-Theme-Erkennung
- Smooth Transitions (300ms)
- Speichert Theme-Präferenz

#### Export/Import
- JSON Export mit Timestamp-Dateinamen
- 3 Import-Modi: Ersetzen, Zusammenführen, Aktualisieren
- Duplikaterkennung über URL-Vergleich
- Einstellungen-Panel mit Statistiken
- Warnung vor destruktiven Aktionen

#### Keyboard Shortcuts
- Globaler Shortcut: `Ctrl+Shift+L` / `Cmd+Shift+L`
- `Ctrl/Cmd+N`: Neuer Link speichern
- `Ctrl/Cmd+F`: Suche fokussieren
- `Ctrl/Cmd+E`: Export
- `Ctrl/Cmd+,`: Einstellungen
- `↑/↓`: Navigation, `Enter`: Öffnen
- `?`: Hilfe anzeigen

#### Context Menu Integration
- Rechtsklick auf Links: "🔖 Link in Miro speichern"
- Rechtsklick auf Seite: "🔖 Seite in Miro speichern"
- Rechtsklick auf Text: "🔖 '%s' in Miro speichern"
- Automatische Favicon-Erfassung

### 🔧 Technische Details
- Chrome Manifest V3
- Chrome Storage API (sync + local)
- CSS Variables für Theming
- Debounce für Performance
- Migration für alte Bookmarks (Tags-Array)

### 🔒 Berechtigungen
- `storage` - Bookmark-Speicherung
- `activeTab` - Aktuelle URL abrufen
- `clipboardWrite` - Beschreibung kopieren
- `contextMenus` - Rechtsklick-Integration
- `notifications` - Feedback-Meldungen

---

## [1.0.0] - Initial Release

### Features
- Link speichern mit Titel und Beschreibung
- Automatisches Kopieren der Beschreibung beim Öffnen
- URL in neuem Tab öffnen
- Bearbeiten und Löschen von Bookmarks
- Synchronisierung über Chrome-Accounts
- Aufklapp-Interface (collapsed/expanded)

### Technologie
- Chrome Extension Manifest V3
- Vanilla JavaScript
- HTML5 & CSS3

---

## Geplante Features (Backlog)

### Ordnerstruktur (Feature 7)
- Hierarchische Organisation von Bookmarks
- Drag & Drop
- Verschachtelte Ordner
- **Status:** Optional, komplex, hoher Aufwand

---

## Version Vergleich

| Version | Features | Code-Zeilen | Dateien | Status |
|---------|----------|-------------|---------|---------|
| v1.0.0 | 6 | ~500 | 5 | ✅ Basis |
| v2.0.0 | 13 | ~1.200 | 10 | ✅ Feature-Complete |
| v2.1.0 | 15 | ~1.500 | 20+ | ✅ Modern & Optimiert |

---

## Danksagungen

Entwickelt für persönlichen Gebrauch und kontinuierliche Verbesserung.

---

**[Unreleased]:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager
**[2.1.0]:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager/releases/tag/v2.1.0
**[2.0.0]:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager/releases/tag/v2.0.0
**[1.0.0]:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager/releases/tag/v1.0.0

