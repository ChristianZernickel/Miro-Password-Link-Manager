# Feature 4: Keyboard Shortcuts

## Status: ⏳ Ausstehend

## Ziel
Effiziente Bedienung per Tastatur für Power-User

## Schritte

### 1. Chrome Commands API ✅
- [ ] Commands in manifest.json definieren
- [ ] Global Shortcut zum Öffnen des Popups
- [ ] Vorschlag: `Ctrl+Shift+L` (Cmd+Shift+L auf Mac)

### 2. Popup Shortcuts ✅
- [ ] `Ctrl+N` / `Cmd+N`: Neuer Link
- [ ] `Ctrl+F` / `Cmd+F`: Fokus auf Suche
- [ ] `Escape`: Modal/Suche schließen
- [ ] `Enter` in Suche: Erstes Ergebnis öffnen

### 3. Navigation ✅
- [ ] `↑` / `↓`: Durch Bookmarks navigieren
- [ ] `Enter`: Ausgewähltes Bookmark öffnen
- [ ] `e`: Bookmark bearbeiten
- [ ] `Delete`: Bookmark löschen

### 4. Modal Shortcuts ✅
- [ ] `Ctrl+Enter` / `Cmd+Enter`: Speichern
- [ ] `Escape`: Abbrechen
- [ ] Tab-Navigation durch Felder

### 5. Hilfe-Overlay ✅
- [ ] `?`: Shortcut-Übersicht anzeigen
- [ ] Schönes Overlay mit allen Shortcuts
- [ ] Gruppiert nach Kontext

### 6. Visuelles Feedback ✅
- [ ] Aktuell ausgewähltes Bookmark highlighten
- [ ] Shortcuts in Tooltips anzeigen

## Technische Details
- `chrome.commands` API
- Event Listener für `keydown`
- Prevent Default für verwendete Shortcuts
- State für aktuell fokussiertes Element

