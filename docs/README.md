# 🔖 Miro Link Plugin

> **Version 2.2.0 - Password Security Edition** 🔒
> 
> Professionelle modulare Architektur mit ES6 Modules, 87.5% Feature-Completion!

Ein Chrome Extension zum Speichern von Links mit Beschreibungen. Beim Öffnen eines gespeicherten Bookmarks wird die URL in einem neuen Tab geöffnet und die Beschreibung automatisch in die Zwischenablage kopiert.

**Neu in v2.1:** Komplette Projekt-Umstrukturierung mit modularem JavaScript (7 Module) und CSS-Komponenten (8 Dateien). Siehe [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) für Details.

## ✨ Features

### 🎯 Core Features
- **Link speichern**: Speichere die aktuelle Seite mit Titel und Beschreibung
- **Automatisches Kopieren**: Beim Öffnen eines Bookmarks wird die Beschreibung in die Zwischenablage kopiert
- **Bearbeiten**: Ändere Titel und Beschreibung gespeicherter Bookmarks
- **Löschen**: Entferne Bookmarks mit Bestätigung
- **Synchronisierung**: Deine Bookmarks werden über Chrome-Accounts synchronisiert
- **Aufklapp-Interface**: Kompakte Darstellung, die sich bei Bedarf erweitert

### 🆕 Neue Features (v2.0)

#### ✅ Tags & Kategorien
- Organisiere Bookmarks mit bis zu 5 Tags
- Filter nach einem oder mehreren Tags (AND-Verknüpfung)
- Automatische Tag-Vorschläge basierend auf existierenden Tags
- Validierung und intelligente Tag-Verwaltung
- Schöne Gradient-Badges für visuelle Unterscheidung

#### ✅ Favicons
- Automatische Website-Icons neben jedem Bookmark
- Google Favicon Service als Fallback
- Gradient-Avatare mit ersten Buchstaben als letzter Fallback
- Icons im Modal und in der Bookmark-Liste

#### ✅ Suche & Filter
- Echtzeit-Suche mit Debounce (300ms)
- Durchsuche Titel, URL, Beschreibung UND Tags
- Sortierung nach Datum (neu/alt) oder Titel (A-Z/Z-A)
- Kombinierbar mit Tag-Filtern
- Clear-Button zum schnellen Zurücksetzen

#### ✅ Dark Mode
- Vollständiger Dark Mode mit automatischer System-Erkennung
- Theme-Toggle Button im Header (🌙/☀️)
- Smooth Transitions zwischen Light/Dark Mode
- Alle Komponenten optimiert für beide Themes
- Speichert deine Theme-Präferenz

#### ✅ Export/Import
- JSON-Export mit Timestamp-Dateinamen
- 3 Import-Modi: Ersetzen, Zusammenführen, Aktualisieren
- Duplikaterkennung über URL-Vergleich
- Einstellungen-Panel mit Statistiken
- Warnung vor destruktiven Aktionen

#### ✅ Keyboard Shortcuts
- Globaler Shortcut: `Ctrl+Shift+L` / `Cmd+Shift+L`
- `Ctrl/Cmd+N`: Neuer Link speichern
- `Ctrl/Cmd+F`: Suche fokussieren
- `Ctrl/Cmd+E`: Export
- `Ctrl/Cmd+,`: Einstellungen
- `↑/↓`: Navigation, `Enter`: Öffnen
- `?`: Hilfe anzeigen

#### ✅ Context Menu
- Rechtsklick auf Links: "🔖 Link in Miro speichern"
- Rechtsklick auf Seite: "🔖 Seite in Miro speichern"
- Rechtsklick auf Text: "🔖 '%s' in Miro speichern"
- Sofortiges Speichern mit Notification
- Automatische Favicon-Erfassung

### 📊 Status: 7 von 8 Features implementiert (87.5%)

**✅ Abgeschlossen:**
- Tags & Kategorien
- Favicons
- Suche & Filter
- Dark Mode
- Export/Import
- Keyboard Shortcuts
- Context Menu Integration

**⏳ Nicht implementiert:**
- Ordnerstruktur (optional, komplex)

Für Details siehe [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) und [features/ROADMAP.md](features/ROADMAP.md).

## 🚀 Installation

### Entwicklermodus (Lokal)

1. **Repository klonen oder herunterladen**
   ```bash
   git clone https://github.com/ChristianZernickel/Miro-Password-Link-Manager.git
   cd Miro-Password-Link-Manager
   ```

2. **Chrome Extension laden**
   - Öffne Chrome und navigiere zu `chrome://extensions/`
   - Aktiviere den **Entwicklermodus** (Toggle oben rechts)
   - Klicke auf **Entpackte Erweiterung laden**
   - Wähle den Projekt-Ordner aus (nicht `src/`!)

3. **Plugin verwenden**
   - Das Plugin-Icon sollte nun in der Chrome-Toolbar erscheinen
   - Klicke auf das Icon, um das Plugin zu öffnen
   - Globaler Shortcut: `Ctrl+Shift+L` (Windows) / `Cmd+Shift+L` (Mac)

> 📚 **Alle Dokumentation:** Siehe [DOCS_OVERVIEW.md](DOCS_OVERVIEW.md) für eine vollständige Übersicht aller Markdown-Dateien im Projekt.
> 
> 🏗️ **Neue Struktur:** Siehe [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) für Details zur modularen Architektur.

## 📖 Verwendung

### Link speichern
1. Navigiere zu einer beliebigen Website
2. Klicke auf das Miro Link Plugin Icon
3. Klicke auf **"Aktuellen Link speichern"**
4. Gib einen Titel und eine Beschreibung ein
5. *Optional:* Füge Tags hinzu (max. 5)
6. Klicke auf **"Speichern"**

### Bookmark öffnen
1. Öffne das Plugin
2. Klicke auf den Bookmark-Header zum Aufklappen
3. Klicke auf die Beschreibung zum Öffnen
4. Die URL wird in einem neuen Tab geöffnet
5. Die Beschreibung wird automatisch in die Zwischenablage kopiert
6. Du siehst eine Bestätigung: "✓ Link geöffnet & Beschreibung kopiert"

### Tags verwenden
1. Beim Speichern: Gib einen Tag-Namen ein und klicke "Hinzufügen"
2. Tags werden als bunte Badges unter dem Bookmark angezeigt
3. Klicke auf einen Tag in der Filter-Leiste zum Filtern
4. Klicke mehrere Tags zum Kombinieren (AND-Filter)
5. "✕ Alle anzeigen" zum Zurücksetzen der Filter

### Suchen & Sortieren
1. Nutze die Suchleiste unter dem "Link speichern" Button
2. Suche durchsucht automatisch Titel, URL, Beschreibung und Tags
3. Wähle eine Sortierung aus dem Dropdown (Datum oder Titel)
4. Suche und Filter können kombiniert werden

### Theme wechseln
1. Klicke auf den 🌙/☀️ Button im Header
2. Das Theme wechselt zwischen Light und Dark Mode
3. Deine Präferenz wird automatisch gespeichert

### Bookmark bearbeiten
1. Öffne das Plugin
2. Klicke auf das ✏️ (Bearbeiten) Icon beim gewünschten Bookmark
3. Ändere Titel, Beschreibung oder Tags
├── manifest.json              # Chrome Extension Konfiguration
├── popup.html                # Haupt-UI des Plugins
├── manifest.json              # Chrome Extension Konfiguration
├── popup.html                # Haupt-UI des Plugins
├── popup.js                  # Logik für das Popup (mit allen Features)
├── popup.css                 # Styling (inkl. Dark Mode)
├── background.js             # Service Worker
├── icons/                    # Plugin Icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── features/                 # Feature-Dokumentation
│   ├── ROADMAP.md           # Implementierungs-Roadmap
│   ├── 01-tags-kategorien.md
│   ├── 02-suche-filter.md
│   ├── 03-export-import.md
│   ├── 04-keyboard-shortcuts.md
│   ├── 05-context-menu.md
│   ├── 06-dark-mode.md
│   ├── 07-ordnerstruktur.md
│   └── 08-favicons.md
├── IMPLEMENTATION_STATUS.md  # Detaillierte Feature-Übersicht
├── instructions.md           # Entwicklungsplan
└── README.md                # Diese Datei
## 🎨 Anpassung

### Farben anpassen
Bearbeite die CSS-Variablen in `popup.css`:

**Light Mode:**
```css
:root {
  --accent-primary: #4285f4;  /* Primärfarbe */
  --bg-primary: #ffffff;       /* Hintergrund */
  --text-primary: #333333;     /* Text */
  /* ... weitere Variablen */
- [x] Export/Import Funktion (JSON)
- [x] Keyboard Shortcuts
- [x] Context Menu Integration (Rechtsklick)
}
### ⏳ Optional (nicht implementiert)
- [ ] Ordnerstruktur (komplex, hoher Aufwand)
  --accent-primary: #8ab4f8;  /* Primärfarbe */
  --bg-primary: #1e1e1e;       /* Hintergrund */
  --text-primary: #e8e8e8;     /* Text */
  /* ... weitere Variablen */
}
## 👨‍💻 Entwicklung

### Module bearbeiten
```bash
# JavaScript Modul öffnen
src/js/modules/tags.js

# CSS-Komponente öffnen
src/css/components/bookmarks.css
```

### Extension neu laden
Nach Änderungen:
1. Chrome → `chrome://extensions/`
2. Bei "Miro Link Plugin" auf ↻ (Neu laden) klicken
3. F12 → Console für Fehler prüfen

### Neue Features hinzufügen
1. Modul erstellen: `src/js/modules/myFeature.js`
2. Funktionen exportieren: `export class MyFeatureManager { }`
3. In popup.js importieren: `import { MyFeatureManager } from './modules/myFeature.js';`

Siehe [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) für Best Practices!

```
🎉 **Das Projekt ist zu 87.5% abgeschlossen!** Alle Kern-Features sind implementiert.


## 🐛 Fehlersuche

- **Wichtig:** Lade den Projekt-Root, nicht den `src/` Ordner!

### "Failed to load module" Fehler
- Prüfe, dass `<script type="module">` im HTML steht
- Prüfe relative Import-Pfade in den Modulen
- Extension neu laden
### Plugin wird nicht geladen
- Stelle sicher, dass der Entwicklermodus aktiviert ist
- Überprüfe die Chrome DevTools Console auf Fehler
- Versuche, das Plugin neu zu laden

## 🚧 Feature-Status
- Überprüfe, ob die Clipboard-Berechtigung gewährt wurde
### ✅ Implementiert (v2.0 - v2.1) - 7/8 Features = 87.5%
- F12 Console für detaillierte Fehler öffnen

- [x] Dark Mode mit Auto-Detection
- [x] Favicons mit Fallbacks
- [x] Export/Import Funktion (JSON mit 3 Modi)
- [x] Keyboard Shortcuts (vollständig)
- [x] Context Menu Integration (Rechtsklick)
- Chrome Sync muss aktiviert sein für sync storage
### ⏳ Optional (nicht implementiert)
- [ ] Ordnerstruktur (komplex, hoher Aufwand, auf Wunsch ausgeklammert)

### 📊 Projekt-Metriken
- **Code-Modularität:** 7 JavaScript Module + 8 CSS Komponenten
- **Größte Datei:** 617 Zeilen (war 1.200+)
- **Root-Dateien:** 3 (war 20+)
- **Dokumentation:** 100% vollständig
- [x] Suche und Filteroptionen  
- [x] Dark Mode
- **Struktur:** [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Features:** [features/](features/) (8 Feature-Dokumente)
- **Status:** [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
- **Roadmap:** [features/ROADMAP.md](features/ROADMAP.md)

🎉 **Das Projekt ist zu 87.5% abgeschlossen!** Alle Kern-Features sind implementiert und das Projekt ist professionell strukturiert.
- [ ] Export/Import Funktion (JSON)
- [ ] Keyboard Shortcuts
- [ ] Context Menu Integration (Rechtsklick)
- [ ] Ordnerstruktur

📖 **Detaillierte Informationen:**
- Vollständige Feature-Beschreibungen: [features/](features/)
- Implementierungs-Status: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
- Entwicklungs-Roadmap: [features/ROADMAP.md](features/ROADMAP.md)

## 📄 Lizenz

MIT License - Fühle dich frei, dieses Plugin zu verwenden und anzupassen!

## 👤 Autor

Erstellt für persönlichen Gebrauch und Lernzwecke.

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

---

**Viel Spaß beim Verwenden des Miro Link Plugins! 🎉**

