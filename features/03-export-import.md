# Feature 3: Export/Import Funktion

## Status: ⏳ Ausstehend

## Ziel
Bookmarks sichern und zwischen verschiedenen Browsern/Geräten übertragen

## Schritte

### 1. Export Funktion ✅
- [ ] "Exportieren" Button in den Einstellungen
- [ ] JSON-Format für Export
- [ ] Dateiname mit Timestamp: `miro-bookmarks-YYYY-MM-DD.json`
- [ ] Download-Funktion implementieren
- [ ] Erfolgsmeldung anzeigen

### 2. Import Funktion ✅
- [ ] "Importieren" Button mit File-Input
- [ ] JSON-Datei validieren
- [ ] Duplikate erkennen (URL-Vergleich)
- [ ] Import-Optionen:
  - [ ] Ersetzen (alle löschen, dann importieren)
  - [ ] Zusammenführen (Duplikate überspringen)
  - [ ] Zusammenführen (Duplikate aktualisieren)

### 3. Backup-Vorschlag ✅
- [ ] Vor Import: Automatisch Backup erstellen
- [ ] Warnung bei "Ersetzen" Option

### 4. Einstellungs-Seite ✅
- [ ] Neues Einstellungs-Icon/Tab
- [ ] Export/Import Sektion
- [ ] Statistiken anzeigen (Anzahl Bookmarks, Tags, etc.)
- [ ] "Alle Daten löschen" mit Bestätigung

### 5. Datenvalidierung ✅
- [ ] JSON-Struktur prüfen
- [ ] Erforderliche Felder validieren
- [ ] Fehlermeldungen bei invaliden Daten

## Technische Details
- JSON.stringify() für Export
- JSON.parse() für Import
- FileReader API für Datei-Upload
- Blob API für Download

