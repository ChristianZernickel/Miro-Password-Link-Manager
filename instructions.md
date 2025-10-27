# Chrome Plugin: Miro Link Plugin - Entwicklungsplan

## Projektbeschreibung
Ein Chrome Plugin zum Speichern von Links mit Beschreibungen. Beim Klick auf ein gespeichertes Bookmark wird die URL geöffnet und die Beschreibung in die Zwischenablage kopiert.

## Funktionsanforderungen
1. **Link speichern**: Von jeder Website aus einen Link mit Beschreibung speichern
2. **Beschreibung eingeben**: Dialog zur Eingabe einer Beschreibung beim Speichern
3. **Bookmark öffnen**: Link öffnen + Beschreibung in Zwischenablage kopieren
4. **Bearbeiten**: Gespeicherte Bookmarks bearbeiten
5. **Löschen**: Gespeicherte Bookmarks löschen

## Technologie-Stack
- **Manifest Version**: Chrome Manifest V3
- **Storage**: Chrome Storage API (chrome.storage.sync)
- **Clipboard**: Clipboard API für Zwischenablage
- **UI**: HTML/CSS/JavaScript (Vanilla JS)

## Dateistruktur
```
miro-link-plugin/
├── manifest.json          # Chrome Extension Konfiguration
├── popup.html            # Haupt-UI des Plugins
├── popup.js              # Logik für das Popup
├── popup.css             # Styling für das Popup
├── background.js         # Service Worker für Background-Aufgaben
├── icons/                # Plugin Icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── instructions.md       # Diese Datei
```

## Implementierungsschritte

### Schritt 1: manifest.json erstellen
- Manifest V3 Konfiguration
- Permissions: storage, clipboardWrite, activeTab
- Popup HTML definieren
- Icons referenzieren
- Service Worker registrieren

### Schritt 2: Icons erstellen
- 16x16px Icon für Toolbar
- 48x48px Icon für Extension Management
- 128x128px Icon für Chrome Web Store
- Einfaches Design mit Lesezeichen-Symbol

### Schritt 3: popup.html erstellen
- Header mit Titel
- Button "Aktuellen Link speichern"
- Liste der gespeicherten Bookmarks
- Jedes Bookmark mit:
  - Titel/URL
  - Beschreibung (gekürzt)
  - Buttons: Öffnen, Bearbeiten, Löschen
- Modal/Dialog für Beschreibungseingabe
- Modal für Bearbeiten

### Schritt 4: popup.css erstellen
- Modernes, sauberes Design
- Responsive Layout
- Button-Styles
- Bookmark-Karten Design
- Modal/Dialog Styling
- Hover-Effekte

### Schritt 5: popup.js erstellen
**Funktionen:**
- `getCurrentTab()`: Aktuelle Tab-URL abrufen
- `loadBookmarks()`: Bookmarks aus Storage laden und anzeigen
- `saveBookmark(url, title, description)`: Neues Bookmark speichern
- `deleteBookmark(id)`: Bookmark löschen
- `updateBookmark(id, data)`: Bookmark aktualisieren
- `openBookmark(url, description)`: URL öffnen + Text in Zwischenablage
- `showAddDialog()`: Dialog zum Hinzufügen anzeigen
- `showEditDialog(id)`: Dialog zum Bearbeiten anzeigen

**Event Listeners:**
- Click auf "Speichern" Button
- Click auf Bookmark (öffnen)
- Click auf Bearbeiten Button
- Click auf Löschen Button
- Form Submit Handlers

### Schritt 6: background.js erstellen (optional)
- Service Worker für Background-Tasks
- Context Menu Integration (optional)
- Keyboard Shortcuts (optional)

### Schritt 7: Datenstruktur
```javascript
bookmark = {
  id: "unique-id",
  url: "https://example.com",
  title: "Page Title",
  description: "Meine Beschreibung",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Schritt 8: Testing
- Link speichern testen
- Beschreibung eingeben testen
- Bookmark öffnen + Zwischenablage testen
- Bearbeiten testen
- Löschen testen
- Storage Persistenz testen

### Schritt 9: Installation und Verwendung
1. Chrome öffnen → `chrome://extensions/`
2. "Entwicklermodus" aktivieren
3. "Entpackte Erweiterung laden"
4. Projektordner auswählen
5. Plugin-Icon in Toolbar sollte erscheinen

## Besondere Features
- UUID für eindeutige Bookmark-IDs
- Timestamps für Erstellungs- und Änderungsdatum
- Bestätigung vor Löschen
- Visuelle Feedbacks (Erfolgsmeldungen)
- Clipboard API für zuverlässiges Kopieren
- Kompakte Darstellung mit Expand-Option für lange Beschreibungen

## Zukünftige Erweiterungen (Optional)
- Tags/Kategorien für Bookmarks
- Suche und Filter
- Export/Import Funktion
- Synchronisierung über Chrome-Accounts
- Keyboard Shortcuts
- Context Menu Integration (Rechtsklick)

