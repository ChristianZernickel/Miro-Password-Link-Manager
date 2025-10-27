# Feature 5: Context Menu Integration

## Status: ⏳ Ausstehend

## Ziel
Bookmarks direkt per Rechtsklick erstellen und verwalten

## Schritte

### 1. Context Menu Registration ✅
- [ ] Context Menu Items in background.js registrieren
- [ ] "Link speichern" bei Rechtsklick auf Link
- [ ] "Seite speichern" bei Rechtsklick auf Seite
- [ ] Bereits in manifest.json: `contextMenus` Permission vorhanden

### 2. Context Menu für Links ✅
- [ ] "🔖 In Miro Links speichern"
- [ ] URL und Link-Text automatisch übernehmen
- [ ] Quick-Save (mit Standard-Tags) oder Modal öffnen

### 3. Context Menu für Seite ✅
- [ ] "🔖 Seite in Miro Links speichern"
- [ ] Aktuelle URL und Titel übernehmen
- [ ] Modal für Beschreibung öffnen

### 4. Context Menu für Bilder ✅
- [ ] "Bildquelle speichern"
- [ ] Image-URL speichern
- [ ] Optional: Thumbnail in Bookmark

### 5. Quick-Add ohne Modal ✅
- [ ] Einstellung: "Quick-Save aktivieren"
- [ ] Bei Quick-Save: Nur URL und Titel, leere Beschreibung
- [ ] Notification: "Link gespeichert - Beschreibung hinzufügen?"
- [ ] Click auf Notification öffnet Edit-Modal

### 6. Context Menu im Popup ✅
- [ ] Rechtsklick auf Bookmark
- [ ] "In neuem Fenster öffnen"
- [ ] "In Inkognito öffnen"
- [ ] "URL kopieren"
- [ ] "Beschreibung kopieren"

## Technische Details
- `chrome.contextMenus.create()` in background.js
- `chrome.contextMenus.onClicked` Event Listener
- Message Passing zwischen background und popup
- chrome.notifications für Quick-Save Feedback

