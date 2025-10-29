# Knowledge Base - Miro Link Plugin

**Version:** 2.3.0  
**Erstellt:** 29. Oktober 2025  
**Zweck:** Zentrale Wissensdatenbank für schnelles Verständnis und Entwicklung

---

## 📚 Übersicht

Diese Knowledge Base enthält alle wichtigen Informationen über das Miro Link Plugin in strukturierter und leicht zugänglicher Form.

### Zielgruppe

- **Neue Entwickler:** Schneller Einstieg ins Projekt
- **AI-Assistenten:** Kontextwissen für effiziente Unterstützung
- **Maintainer:** Referenz für Architektur-Entscheidungen
- **Contributors:** Guidelines und Best Practices

---

## 📖 Dokumentations-Struktur

### 00-OVERVIEW.md
**Projekt-Übersicht und Schnellreferenz**

- Was ist das Projekt?
- Architektur-Übersicht
- Feature-Matrix
- Datenmodell
- Wichtige Konzepte
- Schnellreferenz

**Nutzen:** Ersten Überblick in 5 Minuten

---

### 01-ARCHITECTURE.md
**Code-Architektur und Module**

- Module-System (ES6)
- Alle 7 Module im Detail
- popup.js Struktur
- Best Practices
- Performance-Tipps
- Debugging

**Nutzen:** Verständnis der Code-Struktur

---

### 02-FEATURES.md
**Features und Implementierung**

- Alle 7 implementierten Features
- Feature-Spezifikationen
- Code-Beispiele
- UI-Komponenten
- Browser-Unterschiede
- Performance-Metriken

**Nutzen:** Feature-Entwicklung und -Wartung

---

### 03-DEVELOPMENT.md
**Development Workflow und Release**

- Setup und Installation
- Entwicklungs-Zyklus
- Testing (manuell & automatisiert)
- Build & Release Prozess
- Debugging
- Common Issues
- CI/CD (TODO)

**Nutzen:** Praktische Entwicklungs-Anleitungen

---

## 🚀 Quick Start für AI-Assistenten

### Projekt verstehen

```markdown
1. Lese: 00-OVERVIEW.md (5 Min.)
   → Grundverständnis: Was, Warum, Wie

2. Lese: 01-ARCHITECTURE.md (10 Min.)
   → Code-Struktur: Module, Patterns

3. Bei Bedarf: 02-FEATURES.md
   → Feature-Details für spezifische Aufgaben

4. Bei Entwicklung: 03-DEVELOPMENT.md
   → Praktische Workflows
```

### Typische Aufgaben

#### "Füge ein neues Feature hinzu"
```markdown
1. Check: 02-FEATURES.md → Feature-Status
2. Read: 01-ARCHITECTURE.md → Modul-Pattern
3. Implement:
   - Neues Modul in src/js/modules/
   - Import in popup.js
   - UI in popup.html
   - CSS in complete.css
4. Test: test/manual/chrome-tests.md
5. Update: CHANGELOG.md
```

#### "Fixe einen Bug"
```markdown
1. Read: 03-DEVELOPMENT.md → Debugging
2. Locate: 01-ARCHITECTURE.md → Relevantes Modul
3. Fix & Test
4. Update: CHANGELOG.md
```

#### "Erstelle einen Release"
```markdown
1. Read: 03-DEVELOPMENT.md → Build & Release
2. Run: ./scripts/release.sh
3. Update: README.md, CHANGELOG.md
```

---

## 📊 Projekt-Statistiken

### Code-Basis

```
Zeilen Code:
├── JavaScript:  1.605 Zeilen
│   ├── popup.js:      836 (52%)
│   └── Modules:       769 (48%)
├── CSS:        1.100 Zeilen
├── HTML:         300 Zeilen
└── Tests:        800 Zeilen

Total:          3.805 Zeilen
```

### Module-Verteilung

```
src/js/modules/
├── storage.js       ~77 Zeilen  (10%)
├── tags.js          ~96 Zeilen  (12%)
├── search.js        ~82 Zeilen  (11%)
├── exportImport.js ~159 Zeilen  (21%)
├── theme.js         ~90 Zeilen  (12%)
├── keyboard.js     ~170 Zeilen  (22%)
└── utils.js         ~95 Zeilen  (12%)

Total:              ~769 Zeilen (100%)
```

### Feature-Abdeckung

```
Features: 7/8 (87.5%)
├── ✅ Tags/Kategorien
├── ✅ Suche & Filter
├── ✅ Export/Import
├── ✅ Keyboard Shortcuts
├── ✅ Context Menu
├── ✅ Dark Mode
├── ❌ Ordnerstruktur (nicht geplant)
└── ✅ Favicons
```

---

## 🔑 Kern-Konzepte

### 1. Modulare Architektur

**Problem:** Monolithische 1.200+ Zeilen Datei  
**Lösung:** 7 Module à 50-200 Zeilen + Koordinator

**Vorteile:**
- Klare Verantwortlichkeiten
- Einfache Wartung
- Bessere Testbarkeit
- Wiederverwendbarkeit

### 2. Manager-Pattern

**Classes für State Management:**
- `TagsManager` - Tag-Verwaltung
- `SearchManager` - Suche & Sortierung
- `ExportImportManager` - Export/Import
- `ThemeManager` - Theme-Verwaltung
- `KeyboardManager` - Keyboard Shortcuts

**Pure Functions für Operationen:**
- `storage.js` - CRUD-Operationen
- `utils.js` - Hilfsfunktionen

### 3. Storage-Strategie

**API:** Chrome/Firefox Storage Sync  
**Key:** `'bookmarks'`  
**Limit:** 100KB (Chrome), 8KB/Item  
**Sync:** Automatisch zwischen Geräten

### 4. Browser-Kompatibilität

**Chrome:** Manifest V3, `chrome.*`, Service Worker  
**Firefox:** Manifest V2, `browser.*`, Background Script + Sidebar

**Strategie:**
- Separate Ordner (`src/` vs `firefox-version/`)
- Gleiche Module (copy-paste mit API-Änderungen)
- Spezielle Features (Firefox Sidebar für Import)

### 5. Security-First

**Passwort-Obfuskierung:**
- Kein Klartext im HTML-DOM
- Click-to-Reveal (3 Sek.)
- XSS-Schutz mit `escapeHtml()`

**Storage:**
- Lokal (nicht auf Servern)
- Chrome Sync verschlüsselt
- Kein Telemetry

---

## 🎯 Design-Entscheidungen

### Warum ES6 Modules?

✅ Native Browser-Unterstützung  
✅ Kein Bundler nötig  
✅ Klare Abhängigkeiten  
❌ Kein Tree-Shaking (nicht kritisch bei kleiner Code-Basis)

### Warum keine TypeScript?

✅ Einfacher Setup  
✅ Schnellere Entwicklung  
✅ JSDoc für Typ-Hints  
❌ Keine Compile-Zeit Typ-Checks

### Warum keine Frameworks?

✅ Vanilla JS ist schnell genug  
✅ Keine Dependencies  
✅ Kleine Bundle-Size  
✅ Einfacher zu warten  
❌ Mehr Boilerplate-Code

### Warum CSS Variables?

✅ Native Dark Mode Support  
✅ Einfacher Theme-Wechsel  
✅ Keine CSS-Duplikation  
✅ Gute Browser-Unterstützung

---

## 📝 Conventions

### Naming

```javascript
// Functions: camelCase
function loadBookmarks() { }
function handleSaveCurrentLink() { }

// Classes: PascalCase
class TagsManager { }
class SearchManager { }

// Constants: UPPER_CASE
const MAX_TAGS = 5;
const DEBOUNCE_DELAY = 300;

// Private: _prefix (Convention, nicht enforced)
function _internalHelper() { }
```

### File Structure

```javascript
// 1. Imports
import { module } from './path.js';

// 2. Constants
const MAX_ITEMS = 100;

// 3. State
let currentData = [];

// 4. Classes/Functions
class Manager { }
function publicFunction() { }

// 5. Exports
export { publicFunction };
export class Manager;
```

### Comments

```javascript
// Funktions-Dokumentation
/**
 * Lädt alle Bookmarks aus dem Storage
 * @returns {Promise<Array<Bookmark>>} Array von Bookmark-Objekten
 */
export async function loadBookmarks() { }

// Komplexe Logik
// Pipeline: Filter → Search → Sort → Render
function renderBookmarks() { }

// TODOs
// TODO: Implementiere Virtual Scrolling für 1000+ Items
```

### Git Commits

```bash
# Format: <type>: <subject>

feat: neue Feature X
fix: behebe Bug Y
docs: aktualisiere README
refactor: verbessere Modul Z
test: füge Tests hinzu
chore: update Dependencies
```

---

## 🔍 Häufige Fragen

### Q: Wie füge ich ein neues Feature hinzu?

**A:** 
1. Erstelle Modul in `src/js/modules/newFeature.js`
2. Exportiere Class oder Functions
3. Importiere in `popup.js`
4. Füge UI-Elemente in `popup.html` hinzu
5. Style in `complete.css`
6. Teste manuell mit Checkliste
7. Update `CHANGELOG.md`

### Q: Wie debugge ich die Extension?

**A:**
- Chrome: Rechtsklick auf Popup → "Prüfen"
- Firefox: about:debugging → "Inspect"
- Console: `console.log()`, `debugger`
- Storage: DevTools → Application/Storage

### Q: Warum funktioniert Import nicht in Firefox?

**A:** Firefox Popup hat limitierte File-API.  
**Lösung:** Nutze Sidebar (`Ctrl+Shift+B`)

### Q: Wie erstelle ich einen Release?

**A:** `./scripts/release.sh` (Version wird automatisch gelesen)

### Q: Wo ist die Ordnerstruktur (Feature 7)?

**A:** Nicht implementiert (zu komplex, 87.5% Coverage ausreichend)

---

## 📚 Weiterführende Ressourcen

### Interne Dokumentation

- `/docs/PROJECT_STRUCTURE.md` - Projekt-Struktur
- `/docs/IMPLEMENTATION_STATUS.md` - Feature-Status
- `/docs/VERSION_2.3.0_UPDATE.md` - Versions-Updates
- `/CHANGELOG.md` - Änderungshistorie
- `/README.md` - Haupt-Dokumentation

### Externe Ressourcen

- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
- [Firefox Extensions Docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 🔄 Maintenance

### Knowledge Base aktualisieren

**Wann:**
- Nach jedem Major-Release
- Bei Architektur-Änderungen
- Bei neuen Features
- Bei Breaking Changes

**Wie:**
```bash
# 1. Entsprechende Datei öffnen
vim docs/knowledge_base/02-FEATURES.md

# 2. Änderungen vornehmen

# 3. Datum aktualisieren
# **Letzte Aktualisierung:** XX. Monat 2025

# 4. Commit
git add docs/knowledge_base/
git commit -m "docs: update knowledge base"
```

### Checkliste

- [ ] 00-OVERVIEW.md - Version, Features
- [ ] 01-ARCHITECTURE.md - Module, LOC
- [ ] 02-FEATURES.md - Feature-Status
- [ ] 03-DEVELOPMENT.md - Workflows
- [ ] README.md (diese Datei) - Statistiken

---

## 🎓 Learning Path

### Für neue Entwickler

**Tag 1: Überblick**
- [ ] Lese `00-OVERVIEW.md`
- [ ] Installiere Extension (Chrome + Firefox)
- [ ] Teste alle Features manuell
- [ ] Lese `README.md` im Root

**Tag 2: Code-Struktur**
- [ ] Lese `01-ARCHITECTURE.md`
- [ ] Öffne `popup.js` und verfolge Imports
- [ ] Öffne jedes Modul in `src/js/modules/`
- [ ] Setze Breakpoints und debugge

**Tag 3: Features**
- [ ] Lese `02-FEATURES.md`
- [ ] Wähle ein Feature aus
- [ ] Verfolge Implementierung von UI bis Storage
- [ ] Ändere Kleinigkeit und teste

**Tag 4: Development**
- [ ] Lese `03-DEVELOPMENT.md`
- [ ] Führe manuelle Tests aus
- [ ] Erstelle Test-Release mit Scripts
- [ ] Committe eine kleine Änderung

**Tag 5: Eigenes Feature**
- [ ] Implementiere kleines Feature
- [ ] Teste auf Chrome + Firefox
- [ ] Erstelle Pull Request

---

## ✅ Status

**Knowledge Base:** ✅ Vollständig  
**Version:** 2.3.0  
**Letzte Aktualisierung:** 29. Oktober 2025  
**Maintainer:** Christian Zernickel

**Coverage:**
- ✅ Projekt-Übersicht
- ✅ Architektur-Details
- ✅ Feature-Dokumentation
- ✅ Development-Workflows
- ✅ Best Practices
- ✅ Troubleshooting

---

**Diese Knowledge Base ist die zentrale Wissensquelle für das Miro Link Plugin.**

**Bei Fragen oder Unklarheiten: Ergänze diese Dokumentation!**

