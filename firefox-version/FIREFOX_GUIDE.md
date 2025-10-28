# 🦊 Firefox Konvertierungs-Anleitung

## ✅ Was wurde gemacht?

Die Chrome Extension wurde erfolgreich für Firefox portiert!

---

## 📋 Änderungen für Firefox

### 1. Manifest angepasst (Manifest V2)
```json
{
  "manifest_version": 2,  // V2 statt V3
  "applications": {
    "gecko": {
      "id": "miro-links@christianzernickel.de",
      "strict_min_version": "109.0"
    }
  },
  "browser_action": {},  // statt "action"
  "background": {
    "scripts": ["src/js/background-firefox.js"]  // statt Service Worker
  }
}
```

### 2. API-Namespace geändert
- Alle `chrome.*` → `browser.*`
- Betrifft: popup.js, alle Module, background.js

### 3. Background Script erstellt
- `background-firefox.js` statt Service Worker
- Verwendet klassisches Background Script (Manifest V2)
- `tabs.executeScript` statt `scripting.executeScript`

### 4. Permissions angepasst
- `<all_urls>` hinzugefügt für executeScript
- `tabs` explizit hinzugefügt

---

## 🚀 Installation & Testing

### Option 1: Temporäres Add-on (Schnell)

1. **Firefox öffnen**
   ```
   about:debugging#/runtime/this-firefox
   ```

2. **"Temporäres Add-on laden"**
   - Button klicken
   - Zum `firefox-version` Ordner navigieren
   - `manifest.json` auswählen

3. **Testen**
   - Icon sollte in Toolbar erscheinen
   - Alle Features durchgehen

**Nachteil:** Add-on wird beim Firefox-Neustart entfernt

---

### Option 2: web-ext (Empfohlen für Entwicklung)

```bash
# 1. web-ext installieren
npm install -g web-ext

# 2. In firefox-version Ordner wechseln
cd /Users/czern/IdeaProjects/miro-link-plugin/firefox-version

# 3. Firefox mit Extension starten
web-ext run

# 4. Validieren (Fehler checken)
web-ext lint

# 5. Build erstellen
web-ext build
```

**Vorteile:**
- ✅ Auto-Reload bei Änderungen
- ✅ Separate Firefox-Instanz (keine Konflikte)
- ✅ Console-Logs direkt sichtbar
- ✅ Validierung eingebaut

---

### Option 3: Signiertes Add-on (Für permanente Installation)

#### A. Über AMO (Mozilla Add-ons)

1. **Account erstellen**
   - https://addons.mozilla.org/developers/

2. **ZIP erstellen**
   ```bash
   cd firefox-version
   zip -r miro-link-plugin-firefox-v2.1.0.zip \
     manifest.json src/ assets/ \
     CHANGELOG.md README.md \
     -x "*.DS_Store"
   ```

3. **Hochladen**
   - "Submit a New Add-on"
   - "On this site" auswählen
   - ZIP hochladen
   - Warten auf Review (1-3 Tage)

#### B. Self-Signing (ohne AMO-Listing)

```bash
# API Keys von https://addons.mozilla.org/developers/ holen

web-ext sign \
  --api-key=YOUR_KEY \
  --api-secret=YOUR_SECRET

# Generiert signierte .xpi Datei
```

---

## ✅ Test-Checklist

Nach Installation alle Features testen:

### Basis-Funktionen
- [ ] Extension lädt ohne Fehler
- [ ] Popup öffnet sich (Icon klicken)
- [ ] "Aktuellen Link speichern" funktioniert
- [ ] Link öffnen kopiert Beschreibung

### Context Menu
- [ ] Rechtsklick auf Link → "Link in Miro speichern"
- [ ] Prompt erscheint zur Beschreibungs-Eingabe
- [ ] Bookmark wird gespeichert
- [ ] Notification erscheint

### Tags & Suche
- [ ] Tags hinzufügen funktioniert
- [ ] Tag-Filter funktioniert
- [ ] Suche findet Bookmarks
- [ ] Sortierung funktioniert

### Dark Mode
- [ ] Theme-Toggle funktioniert (🌙/☀️)
- [ ] System-Theme wird erkannt
- [ ] Auto-Sync funktioniert

### Export/Import
- [ ] Export erstellt JSON-Datei
- [ ] Import-Modi funktionieren (Replace/Merge/Update)
- [ ] Settings-Panel öffnet sich

### Keyboard Shortcuts
- [ ] `Ctrl+Shift+L` öffnet Popup
- [ ] `Ctrl+N` startet "Neuer Link"
- [ ] `Ctrl+F` fokussiert Suche
- [ ] `↑/↓` Navigation funktioniert

### Click-Verhalten
- [ ] Click auf Bookmark öffnet Link
- [ ] Click auf ▶ klappt auf/zu
- [ ] Edit/Delete Buttons funktionieren

---

## 🐛 Bekannte Firefox-spezifische Probleme

### Problem: "browser is not defined"
**Lösung:** Firefox erwartet `browser.*` API, nicht `chrome.*`
- Prüfe ob alle Module angepasst wurden
- Siehe Fehler in Browser Console (F12)

### Problem: Context Menu Prompt erscheint nicht
**Ursache:** `<all_urls>` Permission fehlt oder executeScript blockiert
**Lösung:** 
- Prüfe manifest.json Permissions
- Auf `about:*` Seiten funktioniert es nicht (Firefox-Einschränkung)

### Problem: Storage Sync funktioniert nicht
**Ursache:** Firefox Sync nicht aktiviert
**Lösung:**
- Firefox Sync Account einrichten
- Oder `browser.storage.local` verwenden

### Problem: "Temporary add-on removed after restart"
**Erwartetes Verhalten:** Temporäre Add-ons werden entfernt
**Lösung:** 
- Für permanente Installation: Signieren (siehe oben)
- Für Entwicklung: `web-ext run` verwenden

---

## 📊 Validierung

### Vor Veröffentlichung prüfen:

```bash
cd firefox-version

# 1. Lint (Fehler finden)
web-ext lint

# 2. Build (ZIP erstellen)
web-ext build

# 3. Manuell testen
# - Alle Features durchgehen
# - Console auf Fehler prüfen
# - Performance checken
```

---

## 🔄 Chrome vs Firefox - Quick Reference

| Aspekt | Chrome | Firefox |
|--------|--------|---------|
| **Manifest** | V3 | V2 |
| **API** | `chrome.*` | `browser.*` |
| **Background** | Service Worker | Script |
| **Action** | `action` | `browser_action` |
| **Promises** | Callbacks | Native |
| **Storage** | Chrome Sync | Firefox Sync |
| **Publishing** | Chrome Web Store | AMO |
| **Signing** | Optional | Erforderlich |

---

## 📦 Veröffentlichung auf AMO

### Store Listing Vorbereiten

**Name:**
```
Miro Link Plugin
```

**Zusammenfassung (250 Zeichen):**
```
Speichere Webseiten-Links mit Beschreibungen und organisiere sie mit Tags. 
Perfekt für Passwort-Hinweise, wichtige Notizen oder schnellen Zugriff 
auf häufig besuchte Seiten.
```

**Beschreibung:**
Verwende die Texte aus `RELEASE.md`, angepasst für Firefox:
- Erwähne Firefox-Kompatibilität
- Ändere "Chrome Web Store" Referenzen zu "Firefox Add-ons"
- Rest kann identisch bleiben

**Screenshots:**
- Identisch mit Chrome-Version verwenden
- 5 Screenshots empfohlen (1280x800 oder 640x400)

**Kategorie:**
- Productivity

**Lizenz:**
- MIT (oder andere Open Source Lizenz)

---

## 🎯 Nächste Schritte

1. ✅ Firefox installieren (falls noch nicht vorhanden)
2. ✅ Extension temporär laden und testen
3. ✅ Alle Features durchgehen (siehe Checklist)
4. ✅ `web-ext lint` ausführen
5. ✅ Bei Erfolg: ZIP erstellen
6. ✅ Auf AMO hochladen
7. ✅ Review abwarten (1-3 Tage)

---

## 📚 Weitere Ressourcen

**Firefox Developer Docs:**
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions

**web-ext Dokumentation:**
- https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/

**AMO Developer Hub:**
- https://addons.mozilla.org/developers/

**Submission Guide:**
- https://extensionworkshop.com/documentation/publish/

---

**Die Firefox-Version ist bereit zum Testen! 🦊**

