# Feature 7: Ordnerstruktur

## Status: ⏳ Ausstehend

## Ziel
Bookmarks in Ordnern und Unterordnern organisieren

## Schritte

### 1. Datenmodell erweitern ✅
- [ ] Neues Objekt-Type: `Folder`
- [ ] Bookmark bekommt `folderId` Property
- [ ] Ordner können Parent-Ordner haben (Hierarchie)
- [ ] Root-Level = `folderId: null`

### 2. Ordner-Verwaltung ✅
- [ ] "Neuer Ordner" Button
- [ ] Ordner erstellen Modal
- [ ] Ordner umbenennen
- [ ] Ordner löschen (mit Inhalt-Warnung)
- [ ] Ordner verschieben (Drag & Drop)

### 3. Ordner-Ansicht ✅
- [ ] Ordner-Baum/Liste vor Bookmarks
- [ ] Ordner aufklappen/zuklappen
- [ ] Icons: 📁 (geschlossen) / 📂 (offen)
- [ ] Anzahl der Bookmarks im Ordner anzeigen

### 4. Bookmarks zuordnen ✅
- [ ] Beim Erstellen: Ordner auswählen
- [ ] Beim Bearbeiten: Ordner ändern
- [ ] Drag & Drop von Bookmarks in Ordner
- [ ] "Verschieben nach..." Context Menu

### 5. Navigation ✅
- [ ] Breadcrumb-Navigation bei Unterordnern
- [ ] "Zurück" Button
- [ ] Ordner-Filter (nur aktueller Ordner)
- [ ] "Alle Bookmarks" Ansicht

### 6. Besondere Ordner ✅
- [ ] "Favoriten" (stern-markierte)
- [ ] "Kürzlich hinzugefügt"
- [ ] "Ohne Ordner"

### 7. Ordner-Farben ✅
- [ ] Optional: Ordner eine Farbe zuweisen
- [ ] Color Picker im Ordner-Edit
- [ ] Ordner-Badge in Farbe

## Technische Details
- Separate Arrays: `folders` und `bookmarks`
- Rekursive Funktionen für Hierarchie
- State für aktuell geöffneten Ordner
- Drag & Drop mit HTML5 API

