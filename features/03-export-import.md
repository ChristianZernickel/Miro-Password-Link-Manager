# Feature 3: Export/Import Funktion

## Status: ✅ Abgeschlossen

## Ziel
Bookmarks sichern und zwischen verschiedenen Browsern/Geräten übertragen

## Implementierte Features

### 1. Export Funktion ✅
- [x] Einstellungen-Panel mit ⚙️ Button im Header
- [x] "Exportieren" Button in den Einstellungen
- [x] JSON-Format für Export mit Metadata
- [x] Dateiname mit Timestamp: `miro-bookmarks-YYYY-MM-DD.json`
- [x] Download-Funktion mit Blob API
- [x] Erfolgsmeldung anzeigen

### 2. Import Funktion ✅
- [x] "Importieren" Button mit File-Input
- [x] JSON-Datei validieren
- [x] Import-Modal mit Optionen
- [x] Import-Optionen:
  - [x] Ersetzen (alle löschen, dann importieren)
  - [x] Zusammenführen (Duplikate überspringen)
  - [x] Zusammenführen (Duplikate aktualisieren)

### 3. Backup-Vorschlag ✅
- [x] Warnung bei "Alle Daten löschen"
- [x] Doppelte Bestätigung für destruktive Aktionen
- [x] Hinweis auf Export vor Ersetzen

### 4. Einstellungs-Panel ✅
- [x] Slide-in Panel von rechts
- [x] Statistiken (Anzahl Bookmarks, Tags)
- [x] Export/Import Sektion
- [x] "Alle Daten löschen" mit Bestätigung
- [x] Gefahrenzone-Styling

### 5. Datenvalidierung ✅
- [x] JSON-Struktur prüfen
- [x] bookmarks-Array validieren
- [x] Fehlermeldungen bei invaliden Daten
- [x] Duplikaterkennung via URL

## Technische Details
- JSON.stringify() für Export mit Pretty-Print ✅
- JSON.parse() für Import ✅
- FileReader API (file.text()) für Datei-Upload ✅
- Blob API für Download ✅
- URL.createObjectURL() für Download-Link ✅
- Duplikaterkennung über URL-Vergleich ✅
- Migration für Tags und Favicon ✅

