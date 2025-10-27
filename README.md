# 🔖 Miro Link Plugin

Ein Chrome Extension zum Speichern von Links mit Beschreibungen. Beim Öffnen eines gespeicherten Bookmarks wird die URL in einem neuen Tab geöffnet und die Beschreibung automatisch in die Zwischenablage kopiert.

## ✨ Features

- **Link speichern**: Speichere die aktuelle Seite mit Titel und Beschreibung
- **Automatisches Kopieren**: Beim Öffnen eines Bookmarks wird die Beschreibung in die Zwischenablage kopiert
- **Bearbeiten**: Ändere Titel und Beschreibung gespeicherter Bookmarks
- **Löschen**: Entferne Bookmarks mit Bestätigung
- **Synchronisierung**: Deine Bookmarks werden über Chrome-Accounts synchronisiert
- **Modernes Design**: Saubere und intuitive Benutzeroberfläche

## 🚀 Installation

### Entwicklermodus (Lokal)

1. **Repository klonen oder herunterladen**
   ```bash
   git clone https://github.com/yourusername/miro-link-plugin.git
   cd miro-link-plugin
   ```

2. **Chrome Extension laden**
   - Öffne Chrome und navigiere zu `chrome://extensions/`
   - Aktiviere den **Entwicklermodus** (Toggle oben rechts)
   - Klicke auf **Entpackte Erweiterung laden**
   - Wähle den `miro-link-plugin` Ordner aus

3. **Plugin verwenden**
   - Das Plugin-Icon sollte nun in der Chrome-Toolbar erscheinen
   - Klicke auf das Icon, um das Plugin zu öffnen

## 📖 Verwendung

### Link speichern
1. Navigiere zu einer beliebigen Website
2. Klicke auf das Miro Link Plugin Icon
3. Klicke auf **"Aktuellen Link speichern"**
4. Gib einen Titel und eine Beschreibung ein
5. Klicke auf **"Speichern"**

### Bookmark öffnen
1. Öffne das Plugin
2. Klicke auf ein gespeichertes Bookmark
3. Die URL wird in einem neuen Tab geöffnet
4. Die Beschreibung wird automatisch in die Zwischenablage kopiert
5. Du siehst eine Bestätigung: "✓ Link geöffnet & Beschreibung kopiert"

### Bookmark bearbeiten
1. Öffne das Plugin
2. Klicke auf das ✏️ (Bearbeiten) Icon beim gewünschten Bookmark
3. Ändere Titel oder Beschreibung
4. Klicke auf **"Speichern"**

### Bookmark löschen
1. Öffne das Plugin
2. Klicke auf das 🗑️ (Löschen) Icon beim gewünschten Bookmark
3. Bestätige das Löschen im Dialog

## 🏗️ Projektstruktur

```
miro-link-plugin/
├── manifest.json          # Chrome Extension Konfiguration
├── popup.html            # Haupt-UI des Plugins
├── popup.js              # Logik für das Popup
├── popup.css             # Styling für das Popup
├── background.js         # Service Worker
├── icons/                # Plugin Icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── instructions.md       # Entwicklungsplan
└── README.md            # Diese Datei
```

## 🔧 Technologie

- **Manifest Version**: Chrome Manifest V3
- **Storage**: Chrome Storage API (sync)
- **Clipboard**: Navigator Clipboard API
- **UI**: Vanilla JavaScript, HTML5, CSS3

## 📝 Datenstruktur

Jedes Bookmark wird mit folgender Struktur gespeichert:

```javascript
{
  id: "unique-id",
  url: "https://example.com",
  title: "Page Title",
  description: "Meine Beschreibung",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

## 🔐 Berechtigungen

Das Plugin benötigt folgende Berechtigungen:

- **storage**: Zum Speichern der Bookmarks
- **activeTab**: Zum Abrufen der aktuellen URL
- **clipboardWrite**: Zum Kopieren der Beschreibung

## 🎨 Anpassung

### Icons ändern
Ersetze die PNG-Dateien im `icons/` Ordner:
- `icon16.png` (16x16px) - Toolbar Icon
- `icon48.png` (48x48px) - Extension Management
- `icon128.png` (128x128px) - Chrome Web Store

### Farben anpassen
Bearbeite die CSS-Variablen in `popup.css`:
- Primärfarbe: `#4285f4` (Google Blau)
- Hintergrund: `#f5f5f5`
- Text: `#333`

## 🐛 Fehlersuche

### Plugin wird nicht geladen
- Stelle sicher, dass der Entwicklermodus aktiviert ist
- Überprüfe die Chrome DevTools Console auf Fehler
- Versuche, das Plugin neu zu laden

### Beschreibung wird nicht kopiert
- Überprüfe, ob die Clipboard-Berechtigung gewährt wurde
- Die Zwischenablage-API funktioniert nur in sicheren Kontexten (HTTPS)

### Bookmarks werden nicht gespeichert
- Überprüfe die Storage-Berechtigung
- Chrome Sync muss aktiviert sein für sync storage

## 🚧 Zukünftige Features

- [ ] Tags/Kategorien für Bookmarks
- [ ] Suche und Filteroptionen
- [ ] Export/Import Funktion (JSON)
- [ ] Keyboard Shortcuts
- [ ] Context Menu Integration (Rechtsklick)
- [ ] Dark Mode
- [ ] Ordnerstruktur
- [ ] Favicons anzeigen

## 📄 Lizenz

MIT License - Fühle dich frei, dieses Plugin zu verwenden und anzupassen!

## 👤 Autor

Erstellt für persönlichen Gebrauch und Lernzwecke.

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

---

**Viel Spaß beim Verwenden des Miro Link Plugins! 🎉**

