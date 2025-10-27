# ✅ Plugin Installations-Checkliste

## Vor der Installation

- [ ] Chrome Browser ist installiert (Version 88+)
- [ ] Alle Projektdateien sind vorhanden
- [ ] Icons sind im `icons/` Ordner

## Installation durchführen

1. [ ] Chrome öffnen
2. [ ] Zu `chrome://extensions/` navigieren
3. [ ] **Entwicklermodus** aktivieren (Toggle oben rechts)
4. [ ] **"Entpackte Erweiterung laden"** klicken
5. [ ] Ordner `/Users/czern/IdeaProjects/miro-link-plugin` auswählen
6. [ ] Plugin sollte in der Liste erscheinen
7. [ ] Plugin-Icon sollte in der Toolbar sichtbar sein

## Erste Tests

### Test 1: Plugin öffnen
- [ ] Auf Plugin-Icon klicken
- [ ] Popup öffnet sich (400px breit)
- [ ] Header zeigt "🔖 Miro Links"
- [ ] Button "➕ Aktuellen Link speichern" ist sichtbar
- [ ] Empty State wird angezeigt: "📭 Noch keine Links gespeichert"

### Test 2: Link speichern
- [ ] Zu einer Website navigieren (z.B. https://github.com)
- [ ] Plugin öffnen
- [ ] Auf "Aktuellen Link speichern" klicken
- [ ] Modal öffnet sich
- [ ] URL ist vorausgefüllt
- [ ] Titel ist vorausgefüllt
- [ ] Titel eingeben: "GitHub"
- [ ] Beschreibung eingeben: "Social Coding Platform"
- [ ] Auf "Speichern" klicken
- [ ] Modal schließt sich
- [ ] Erfolgsmeldung: "✓ Bookmark gespeichert"
- [ ] Bookmark erscheint in der Liste

### Test 3: Link öffnen + Zwischenablage
- [ ] Plugin öffnen
- [ ] Auf das gespeicherte Bookmark klicken
- [ ] Neuer Tab öffnet sich mit der URL
- [ ] Erfolgsmeldung: "✓ Link geöffnet & Beschreibung kopiert"
- [ ] In einem Textfeld Cmd+V drücken
- [ ] Beschreibung wird eingefügt

### Test 4: Bearbeiten
- [ ] Plugin öffnen
- [ ] Auf ✏️ Icon klicken
- [ ] Modal öffnet sich mit vorausgefüllten Daten
- [ ] Beschreibung ändern
- [ ] Auf "Speichern" klicken
- [ ] Änderungen sind gespeichert
- [ ] Erfolgsmeldung: "✓ Bookmark aktualisiert"

### Test 5: Löschen
- [ ] Plugin öffnen
- [ ] Auf 🗑️ Icon klicken
- [ ] Bestätigungs-Dialog erscheint
- [ ] Auf "Löschen" klicken
- [ ] Bookmark wird entfernt
- [ ] Erfolgsmeldung: "✓ Bookmark gelöscht"
- [ ] Empty State wird wieder angezeigt

### Test 6: Mehrere Bookmarks
- [ ] 3-5 Bookmarks von verschiedenen Seiten speichern
- [ ] Alle Bookmarks werden korrekt angezeigt
- [ ] Sortierung: Neueste zuerst
- [ ] Datum wird korrekt formatiert ("Gerade eben", "Vor X Minuten")
- [ ] Scrollen funktioniert bei vielen Bookmarks

### Test 7: Persistenz
- [ ] Mehrere Bookmarks speichern
- [ ] Plugin schließen
- [ ] Chrome neu starten
- [ ] Plugin öffnen
- [ ] Alle Bookmarks sind noch vorhanden

## Fehlerbehandlung testen

### Edge Cases
- [ ] Leeres Formular absenden → Fehlermeldung
- [ ] Sehr lange URL speichern → Funktioniert
- [ ] Sehr lange Beschreibung (1000+ Zeichen) → Funktioniert
- [ ] Sonderzeichen in Beschreibung (€, ♥, 中文) → Funktioniert
- [ ] Modal mit ESC schließen funktioniert nicht (Feature für später)
- [ ] Auf Modal-Hintergrund klicken → Modal schließt

## Browser Console überprüfen

- [ ] DevTools öffnen (F12)
- [ ] Keine Fehler in der Console
- [ ] Bei Installation: "Miro Link Plugin installiert!"
- [ ] Keine 404-Fehler für Ressourcen

## Performance

- [ ] Plugin öffnet schnell (<100ms)
- [ ] Keine Verzögerungen bei Animationen
- [ ] Smooth Scrolling funktioniert
- [ ] Hover-Effekte sind flüssig

## Optionale Verbesserungen (für später)

- [ ] Bessere Icons erstellen (derzeit Platzhalter)
- [ ] Keyboard Shortcuts hinzufügen (Ctrl+Shift+S zum Speichern)
- [ ] Context Menu (Rechtsklick) Integration
- [ ] Export/Import Funktion
- [ ] Suchfunktion
- [ ] Tags/Kategorien
- [ ] Dark Mode
- [ ] Favicons anzeigen

## Bei Problemen

### Plugin lädt nicht
```bash
# Prüfe Manifest
cat manifest.json | python -m json.tool

# Prüfe Dateien
ls -la /Users/czern/IdeaProjects/miro-link-plugin/
```

### JavaScript Fehler
1. Rechtsklick auf Plugin-Icon → "Inspect"
2. Console-Tab öffnen
3. Fehler notieren und beheben

### Storage Probleme
1. DevTools öffnen
2. Application → Storage → Chrome Extension
3. Gespeicherte Daten überprüfen

## Abschluss

- [ ] Alle Tests bestanden ✅
- [ ] Plugin funktioniert wie erwartet ✅
- [ ] README.md gelesen ✅
- [ ] QUICKSTART.md gelesen ✅

---

**Status**: _______________________ (Datum: _________)

**Notizen**:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

