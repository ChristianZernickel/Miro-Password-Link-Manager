# 🚀 Schnellstart - Miro Link Plugin

## Installation in 3 Schritten

### 1. Chrome Extensions öffnen
Öffne Chrome und gehe zu:
```
chrome://extensions/
```
Oder über: **Menü (⋮) → Erweiterungen → Erweiterungen verwalten**

### 2. Entwicklermodus aktivieren
- Aktiviere den **Entwicklermodus** Toggle oben rechts

### 3. Plugin laden
- Klicke auf **"Entpackte Erweiterung laden"**
- Navigiere zum `miro-link-plugin` Ordner
- Wähle den Ordner aus
- ✅ Fertig! Das Plugin-Icon erscheint in der Toolbar

## Erste Schritte

### 📌 Ersten Link speichern
1. Gehe zu einer beliebigen Website (z.B. https://google.com)
2. Klicke auf das **Miro Link Plugin Icon** in der Toolbar
3. Klicke auf **"➕ Aktuellen Link speichern"**
4. Gib einen **Titel** ein (z.B. "Google Suche")
5. Gib eine **Beschreibung** ein (z.B. "Hauptseite von Google für Suchen")
6. Klicke auf **"Speichern"**

### 🔗 Link öffnen und Beschreibung kopieren
1. Öffne das Plugin
2. Klicke auf den gespeicherten Link
3. ✨ **Magisch:** 
   - Der Link öffnet sich in einem neuen Tab
   - Die Beschreibung ist bereits in deiner Zwischenablage!
4. Füge die Beschreibung ein (Cmd+V / Ctrl+V) wo du sie brauchst

### ✏️ Link bearbeiten
1. Öffne das Plugin
2. Klicke auf das **✏️ Icon** beim gewünschten Link
3. Ändere Titel oder Beschreibung
4. Speichern!

### 🗑️ Link löschen
1. Öffne das Plugin
2. Klicke auf das **🗑️ Icon** beim gewünschten Link
3. Bestätige das Löschen

## 💡 Tipps

### Gute Beschreibungen schreiben
- **Konkret**: "Login-Daten: user@example.com, Passwort in 1Password"
- **Kontext**: "API Dokumentation - siehe Abschnitt 'Authentication'"
- **Codes**: "Gutscheincode: SAVE20 (gültig bis 31.12.2024)"
- **Notizen**: "Dieses Tool für Projektmanagement nutzen"

### Anwendungsfälle
- 🔐 **Zugangsdaten** mit Nutzernamen/E-Mail speichern
- 📄 **Dokumentationen** mit wichtigen Abschnitten notieren
- 🎫 **Tickets/Codes** mit Rabattcodes oder Ticketnummern
- 📝 **Arbeitsprojekte** mit Notizen und Kontextinfos
- 🎓 **Lernressourcen** mit Zusammenfassungen

## 🎯 Workflow-Beispiel

**Szenario:** Du findest eine nützliche API-Dokumentation

1. **Auf der Seite**: `https://api.example.com/docs`
2. **Plugin öffnen** → "Aktuellen Link speichern"
3. **Titel**: "Payment API Dokumentation"
4. **Beschreibung**: 
   ```
   API-Key: pk_test_123abc
   Endpoint: POST /api/v1/payments
   Rate Limit: 100 req/min
   ```
5. **Speichern** ✅

**Später:** 
1. Plugin öffnen → Auf "Payment API" klicken
2. 🎉 Seite öffnet sich + API-Key ist kopiert
3. Sofort einfügen und weiterarbeiten!

## ⚠️ Troubleshooting

### Plugin wird nicht angezeigt
- Prüfe ob Entwicklermodus aktiviert ist
- Rechtsklick auf Plugin-Icon → "Inspect"
- Prüfe Console auf Fehler

### Beschreibung wird nicht kopiert
- Moderne Browser benötigen HTTPS für Clipboard API
- Bei localhost/file:// URLs kann es Einschränkungen geben

### Bookmarks verschwinden
- Prüfe ob Chrome Sync aktiviert ist
- Storage Limit: 100 KB (für ~100-200 Bookmarks ausreichend)

## 📊 Speichergrenzen

Chrome Sync Storage:
- **Maximum**: 100 KB insgesamt
- **Pro Item**: 8 KB
- **Anzahl Items**: 512

→ Reicht für ca. **100-200 Bookmarks** je nach Beschreibungslänge

## 🎨 Weitere Anpassungen

Die CSS-Datei ist gut dokumentiert und kann einfach angepasst werden:
- Farben in `popup.css` ändern
- Icons in `icons/` Ordner ersetzen
- Neue Features in `popup.js` hinzufügen

---

**Bei Fragen oder Problemen:** Siehe `README.md` oder `instructions.md`

