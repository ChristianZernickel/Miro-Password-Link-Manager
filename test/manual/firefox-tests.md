# Firefox Test-Checkliste

**Version:** 2.3.0  
**Browser:** Firefox  
**Datum:** _____________  
**Tester:** _____________

## ✅ Installation & Setup

- [ ] Extension lädt ohne Fehler (about:debugging)
- [ ] Icon erscheint in der Toolbar
- [ ] Popup öffnet sich beim Icon-Click
- [ ] Sidebar-Button funktioniert
- [ ] Keyboard Shortcuts funktionieren:
  - [ ] Ctrl+Shift+L (Popup)
  - [ ] Ctrl+Shift+B (Sidebar)
- [ ] Keine Console-Errors beim Start

## 🦊 Firefox-Spezifisch

### Popup vs. Sidebar
- [ ] Popup-Modus funktioniert
- [ ] Sidebar-Modus funktioniert
- [ ] Umschalten zwischen Modi problemlos
- [ ] Sidebar bleibt offen nach Reload
- [ ] Import/Export im Sidebar-Modus verfügbar

### Browser-API Kompatibilität
- [ ] `browser.storage.sync` funktioniert
- [ ] `browser.runtime` APIs funktionieren
- [ ] `browser.contextMenus` funktioniert
- [ ] `browser.notifications` funktioniert
- [ ] `browser.sidebarAction` funktioniert

## 📝 Bookmark-Verwaltung

### Erstellen
- [ ] "Aktuelle Seite speichern" erstellt Bookmark
- [ ] Manuelles Erstellen über Formular funktioniert
- [ ] Titel wird korrekt gespeichert
- [ ] URL wird validiert
- [ ] Passwort wird gespeichert
- [ ] Favicon wird automatisch geladen
- [ ] Fallback-Favicon bei fehlerhaftem Favicon

### Bearbeiten
- [ ] Edit-Button öffnet vorausgefülltes Formular
- [ ] Änderungen werden gespeichert
- [ ] Cancel bricht Bearbeitung ab
- [ ] Modal schließt nach Speichern

### Löschen
- [ ] Einzelnes Bookmark löschen mit Bestätigung
- [ ] "Alle Daten löschen" Button vorhanden
- [ ] Confirmation-Modal erscheint
- [ ] Export-Optionen vor Löschen verfügbar
- [ ] Nach Bestätigung werden alle Daten gelöscht

## 🏷️ Tags

- [ ] Tags hinzufügen (max. 5)
- [ ] Tags entfernen (X-Button)
- [ ] Tag-Filter anzeigen/verstecken
- [ ] Klick auf Tag filtert Bookmarks
- [ ] "Alle zeigen" entfernt Filter
- [ ] Tag-Validierung (keine Duplikate)

## 🔍 Suche

- [ ] Suche in Titel funktioniert
- [ ] Suche in URL funktioniert
- [ ] Suche in Passwort funktioniert
- [ ] Suche ist case-insensitive
- [ ] Clear-Button leert Suchfeld
- [ ] Suche + Tag-Filter kombinierbar

## 📊 Sortierung

- [ ] Sortierung nach "Neueste zuerst"
- [ ] Sortierung nach "Älteste zuerst"
- [ ] Sortierung nach "Titel A-Z"
- [ ] Sortierung nach "Titel Z-A"
- [ ] Sortierung bleibt nach Reload erhalten

## 🔒 Passwort-Sicherheit

### Formular
- [ ] Passwort standardmäßig obfuskiert
- [ ] Toggle-Button (👁️/🙈) funktioniert
- [ ] Auto-Show bei Focus
- [ ] Passwort wird korrekt gespeichert

### Bookmark-Liste
- [ ] Passwort als `••••••••••••` dargestellt
- [ ] Hover zeigt "👁️ Klicken zum Anzeigen"
- [ ] Click revealed Passwort
- [ ] Auto-Hide nach 3 Sekunden
- [ ] Monospace-Font für Lesbarkeit

## 📋 Clipboard

- [ ] Passwort wird beim Öffnen kopiert
- [ ] Success-Notification erscheint
- [ ] Firefox-Notification-API funktioniert
- [ ] Kopiertes Passwort ist korrekt

## 💾 Export/Import

### Export (im Sidebar!)
- [ ] Export-Button öffnet Modal
- [ ] Export nur Links (ohne Passwörter)
- [ ] Export vollständig (mit Passwörtern)
- [ ] Download startet automatisch
- [ ] Dateiname enthält Zeitstempel

### Import (im Sidebar!)
- [ ] Import-Button öffnet File-Dialog
- [ ] Valide JSON-Datei wird akzeptiert
- [ ] Ungültige Datei wird abgelehnt
- [ ] Success-Message nach Import
- [ ] Importierte Bookmarks erscheinen

## 🌓 Dark Mode

- [ ] Toggle-Button vorhanden
- [ ] Light → Dark Wechsel funktioniert
- [ ] Dark → Light Wechsel funktioniert
- [ ] Theme bleibt nach Reload erhalten
- [ ] Firefox Dark Theme Integration

## ⚙️ Einstellungen

- [ ] Settings-Panel öffnet/schließt
- [ ] Export/Import im Sidebar verfügbar
- [ ] "Alle Daten löschen" Button funktioniert
- [ ] Keyboard Shortcuts angezeigt

## ⌨️ Keyboard Shortcuts

- [ ] Ctrl+Shift+L: Popup öffnen
- [ ] Ctrl+Shift+B: Sidebar öffnen
- [ ] Enter: Formular absenden
- [ ] Escape: Modal schließen

## 🖱️ Context Menu

- [ ] Rechtsklick auf Link zeigt "Bei Miro speichern"
- [ ] Context Menu Item funktioniert
- [ ] Prompt fragt nach Titel
- [ ] Prompt fragt nach Passwort
- [ ] Bookmark wird erstellt

## 🔄 Firefox Sync

- [ ] Bookmarks synchronisieren mit Firefox Account
- [ ] Änderungen werden gesynct
- [ ] Keine Konflikte bei Sync

## 📱 Responsive Design

### Popup-Modus
- [ ] Popup hat korrekte Größe
- [ ] Scrollbar bei vielen Bookmarks

### Sidebar-Modus
- [ ] Sidebar ist breiter als Popup
- [ ] Export/Import gut sichtbar
- [ ] Responsive bei Sidebar-Größenänderung

## 🐛 Edge Cases

- [ ] Leere Liste zeigt Empty-State
- [ ] Sehr lange Titel werden abgeschnitten
- [ ] Sehr lange URLs werden abgeschnitten
- [ ] Sonderzeichen funktionieren
- [ ] 100+ Bookmarks (Performance)

## 🔐 Sicherheit

- [ ] Keine Klartext-Passwörter im HTML
- [ ] XSS-Prävention funktioniert
- [ ] Keine sensiblen Daten in Console-Logs
- [ ] Firefox Content Security Policy eingehalten

## 🔧 Firefox Developer Edition Tests

- [ ] Extension funktioniert in Developer Edition
- [ ] Debugging über about:debugging möglich
- [ ] Web Console zeigt keine Errors
- [ ] Browser Console zeigt keine Warnings

## ✅ Ergebnis

**Erfolgreiche Tests:** ______ / 110  
**Fehlgeschlagene Tests:** ______  
**Kritische Bugs:** ______

**Notizen:**
_______________________________________________
_______________________________________________
_______________________________________________
# Chrome Test-Checkliste

**Version:** 2.3.0  
**Browser:** Chrome/Chromium/Edge  
**Datum:** _____________  
**Tester:** _____________

## ✅ Installation & Setup

- [ ] Extension lädt ohne Fehler
- [ ] Icon erscheint in der Toolbar
- [ ] Popup öffnet sich beim Icon-Click
- [ ] Keyboard Shortcut (Ctrl+Shift+L / Cmd+Shift+L) funktioniert
- [ ] Keine Console-Errors beim Start

## 📝 Bookmark-Verwaltung

### Erstellen
- [ ] "Aktuelle Seite speichern" erstellt Bookmark
- [ ] Manuelles Erstellen über Formular funktioniert
- [ ] Titel wird korrekt gespeichert
- [ ] URL wird validiert
- [ ] Passwort wird gespeichert
- [ ] Favicon wird automatisch geladen
- [ ] Fallback-Favicon bei fehlerhaftem Favicon

### Bearbeiten
- [ ] Edit-Button öffnet vorausgefülltes Formular
- [ ] Änderungen werden gespeichert
- [ ] Cancel bricht Bearbeitung ab
- [ ] Modal schließt nach Speichern

### Löschen
- [ ] Einzelnes Bookmark löschen mit Bestätigung
- [ ] "Alle Daten löschen" Button vorhanden
- [ ] Confirmation-Modal erscheint
- [ ] Export-Optionen vor Löschen verfügbar
- [ ] Nach Bestätigung werden alle Daten gelöscht

## 🏷️ Tags

- [ ] Tags hinzufügen (max. 5)
- [ ] Tags entfernen (X-Button)
- [ ] Tag-Filter anzeigen/verstecken
- [ ] Klick auf Tag filtert Bookmarks
- [ ] "Alle zeigen" entfernt Filter
- [ ] Tag-Validierung (keine Duplikate)

## 🔍 Suche

- [ ] Suche in Titel funktioniert
- [ ] Suche in URL funktioniert
- [ ] Suche in Passwort funktioniert
- [ ] Suche ist case-insensitive
- [ ] Clear-Button leert Suchfeld
- [ ] Suche + Tag-Filter kombinierbar
- [ ] Keine Ergebnisse zeigt "Keine passenden Einträge"

## 📊 Sortierung

- [ ] Sortierung nach "Neueste zuerst"
- [ ] Sortierung nach "Älteste zuerst"
- [ ] Sortierung nach "Titel A-Z"
- [ ] Sortierung nach "Titel Z-A"
- [ ] Sortierung bleibt nach Reload erhalten

## 🔒 Passwort-Sicherheit

### Formular
- [ ] Passwort standardmäßig obfuskiert (blur + discs)
- [ ] Toggle-Button (👁️/🙈) funktioniert
- [ ] Auto-Show bei Focus
- [ ] Passwort wird korrekt gespeichert

### Bookmark-Liste
- [ ] Passwort als `••••••••••••` dargestellt
- [ ] Hover zeigt "👁️ Klicken zum Anzeigen"
- [ ] Click revealed Passwort
- [ ] Auto-Hide nach 3 Sekunden
- [ ] Monospace-Font für Lesbarkeit
- [ ] Kein Klartext-Passwort im HTML-DOM

## 📋 Clipboard

- [ ] Passwort wird beim Öffnen kopiert
- [ ] Success-Notification erscheint
- [ ] Kopiertes Passwort ist korrekt
- [ ] Clipboard-Inhalt überprüfbar (Strg+V)

## 💾 Export/Import

### Export
- [ ] Export-Button öffnet Modal
- [ ] Export nur Links (ohne Passwörter)
- [ ] Export vollständig (mit Passwörtern)
- [ ] Export mit Verschlüsselung (falls implementiert)
- [ ] Download startet automatisch
- [ ] Dateiname enthält Zeitstempel

### Import
- [ ] Import-Button öffnet File-Dialog
- [ ] Valide JSON-Datei wird akzeptiert
- [ ] Ungültige Datei wird abgelehnt
- [ ] Success-Message nach Import
- [ ] Importierte Bookmarks erscheinen in Liste
- [ ] Duplikat-Erkennung funktioniert

## 🌓 Dark Mode

- [ ] Toggle-Button vorhanden
- [ ] Light → Dark Wechsel funktioniert
- [ ] Dark → Light Wechsel funktioniert
- [ ] Theme bleibt nach Reload erhalten
- [ ] Alle Elemente sind im Dark Mode lesbar
- [ ] Kontrast ist ausreichend

## ⚙️ Einstellungen

- [ ] Settings-Panel öffnet/schließt
- [ ] Export/Import Buttons funktionieren
- [ ] "Alle Daten löschen" Button funktioniert
- [ ] Keyboard Shortcuts angezeigt
- [ ] Über-Informationen korrekt

## ⌨️ Keyboard Shortcuts

- [ ] Ctrl+Shift+L: Popup öffnen/schließen
- [ ] Enter: Formular absenden
- [ ] Escape: Modal schließen
- [ ] Ctrl+F: Suche fokussieren (falls implementiert)

## 🖱️ Context Menu

- [ ] Rechtsklick auf Link zeigt "Bei Miro speichern"
- [ ] Context Menu Item funktioniert
- [ ] Prompt fragt nach Titel
- [ ] Prompt fragt nach Passwort
- [ ] Bookmark wird erstellt
- [ ] Success-Notification erscheint

## 🔄 Chrome Sync

- [ ] Bookmarks synchronisieren zwischen Geräten
- [ ] Änderungen werden automatisch gesynct
- [ ] Keine Konflikte bei Sync

## 📱 Responsive Design

- [ ] Popup hat korrekte Größe (500x400-700px)
- [ ] Scrollbar bei vielen Bookmarks
- [ ] Alle Buttons sind klickbar
- [ ] Keine überlappenden Elemente

## 🐛 Edge Cases

- [ ] Leere Liste zeigt Empty-State
- [ ] Sehr lange Titel werden abgeschnitten
- [ ] Sehr lange URLs werden abgeschnitten
- [ ] Sonderzeichen in Titel/Passwort
- [ ] Emoji in Titel/Passwort 🎉
- [ ] 100+ Bookmarks (Performance)

## 🔐 Sicherheit

- [ ] Keine Klartext-Passwörter im HTML
- [ ] XSS-Prävention (escapeHtml)
- [ ] Keine sensiblen Daten in Console-Logs
- [ ] HTTPS für alle externen Requests

## ✅ Ergebnis

**Erfolgreiche Tests:** ______ / 100  
**Fehlgeschlagene Tests:** ______  
**Kritische Bugs:** ______

**Notizen:**
_______________________________________________
_______________________________________________
_______________________________________________

