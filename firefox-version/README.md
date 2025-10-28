# 🔖 Miro Link Plugin - Firefox Version

> **Version 2.1.0 - Firefox Edition** 🦊

Chrome Extension portiert für Firefox! Speichere Links mit Beschreibungen, die beim Öffnen automatisch in die Zwischenablage kopiert werden.

---

## 🦊 Firefox-spezifische Anpassungen

Diese Version wurde speziell für Firefox angepasst:

### Technische Unterschiede zu Chrome-Version:

1. **Manifest V2 statt V3**
   - Firefox unterstützt noch kein Manifest V3 vollständig
   - Verwendet `browser.*` API statt `chrome.*`

2. **Background Scripts**
   - Klassisches Background Script statt Service Worker
   - `background-firefox.js` statt `background.js`

3. **Browser Action statt Action**
   - `browser_action` statt `action` in manifest.json
   - `browser.browserAction` API

4. **Permissions**
   - `<all_urls>` für executeScript (Context Menu Prompts)
   - `tabs` Permission explizit benötigt

5. **API-Namespace**
   - Alle `chrome.*` Aufrufe durch `browser.*` ersetzt
   - Promises statt Callbacks wo möglich

---

## 🚀 Installation (Entwickler-Modus)

### 1. Firefox öffnen
```
about:debugging#/runtime/this-firefox
```

### 2. "Temporäres Add-on laden"
- Klicke auf "Temporäres Add-on laden..."
- Navigiere zum `firefox-version` Ordner
- Wähle die `manifest.json` Datei

### 3. Plugin verwenden
- Das Plugin-Icon erscheint in der Toolbar
- Shortcut: `Ctrl+Shift+L` (Windows/Linux) / `Cmd+Shift+L` (Mac)

---

## ✨ Features (identisch mit Chrome-Version)

- 🔗 Links mit Beschreibungen speichern
- 📋 Automatisches Kopieren in Zwischenablage
- 🏷️ Organisation mit Tags (bis zu 5 pro Bookmark)
- 🔍 Echtzeit-Suche in Titel, URL, Beschreibung und Tags
- 🌓 Dark Mode mit Auto-Detection
- 💾 Export/Import (JSON mit 3 Modi)
- ⌨️ Keyboard Shortcuts
- 🖱️ Context Menu Integration
- 🎨 Automatische Favicons
- 📊 Sortierung nach Datum oder Titel

---

## 🆕 Version 2.1.0 Features

### Context Menu mit Beschreibungs-Eingabe
- Rechtsklick auf Link/Seite/Text
- Beschreibung direkt im Prompt eingeben
- Bei markiertem Text: Vorausgefüllt als Beschreibung

### Verbessertes Click-Verhalten
- Click auf Bookmark → Link öffnet direkt
- Nur ▶ Button klappt auf/zu
- Schnellerer Workflow

### Auto Theme Sync
- Theme passt sich automatisch an System-Theme an
- Keine Neuladung nötig

---

## 🔐 Berechtigungen

**storage:**
- Speichert Bookmarks lokal im Browser
- Optional: Firefox Sync für Geräte-Synchronisierung

**activeTab:**
- Zugriff auf aktuelle URL und Titel
- Nur wenn Plugin aktiv verwendet wird

**clipboardWrite:**
- Kopiert Beschreibung beim Öffnen eines Bookmarks

**contextMenus:**
- Rechtsklick-Integration "Link in Miro speichern"

**notifications:**
- Bestätigung nach Context Menu Speichern

**tabs & <all_urls>:**
- Für Context Menu Beschreibungs-Prompts
- Nur auf explizite Benutzeraktion

---

## 📦 Firefox Add-ons Store (AMO)

### Vorbereitung für Veröffentlichung

#### 1. Add-on signieren
Firefox erfordert signierte Add-ons für normale Installation.

**Option A: Automatische Signierung (empfohlen)**
1. Account erstellen: https://addons.mozilla.org/developers/
2. "Submit a New Add-on" → "On this site"
3. ZIP hochladen (siehe unten)
4. Review-Prozess durchlaufen

**Option B: Self-Signing**
```bash
# web-ext installieren
npm install -g web-ext

# Im firefox-version Ordner:
web-ext sign --api-key=YOUR_KEY --api-secret=YOUR_SECRET
```

#### 2. ZIP-Paket erstellen
```bash
cd firefox-version
zip -r ../miro-link-plugin-firefox-v2.1.0.zip \
  manifest.json \
  src/ \
  assets/ \
  CHANGELOG.md \
  README.md \
  -x "*.DS_Store"
```

#### 3. Add-on Listing
Verwende die Texte aus `RELEASE.md` angepasst für Firefox:
- Name: "Miro Link Plugin"
- Kategorie: Productivity
- Lizenz: MIT (oder andere)
- Screenshots: 5 empfohlen (identisch mit Chrome-Version)

---

## 🔧 Entwicklung & Testing

### web-ext verwenden (empfohlen)
```bash
# Installieren
npm install -g web-ext

# Im firefox-version Ordner:
# Entwicklungs-Modus starten
web-ext run

# Add-on validieren
web-ext lint

# Build erstellen
web-ext build
```

### Manuelles Testing
1. `about:debugging#/runtime/this-firefox`
2. "Temporäres Add-on laden"
3. Nach Änderungen: "Neu laden" klicken

---

## 🐛 Firefox-spezifische Bekannte Probleme

### Clipboard API
- Firefox erfordert HTTPS oder localhost für Clipboard-Zugriff
- Funktioniert in Extension-Kontext ohne Einschränkungen

### Storage Sync
- Firefox Sync muss aktiviert sein
- Sync funktioniert nur zwischen Firefox-Installationen (nicht mit Chrome)

### executeScript
- Benötigt `<all_urls>` Permission
- Funktioniert nicht auf `about:*` Seiten

---

## 📊 Kompatibilität

**Getestet mit:**
- Firefox 109+ (Minimum)
- Firefox ESR 115+
- Firefox Developer Edition
- Firefox Nightly

**Nicht unterstützt:**
- Firefox für Android (UI nicht optimiert)
- Sehr alte Firefox-Versionen (< 109)

---

## 🔄 Unterschiede zur Chrome-Version

| Feature | Chrome | Firefox | Status |
|---------|--------|---------|--------|
| Manifest Version | V3 | V2 | ⚠️ Unterschiedlich |
| API Namespace | chrome.* | browser.* | ✅ Angepasst |
| Background | Service Worker | Script | ✅ Angepasst |
| Promises | Callbacks | Native | ✅ Besser in Firefox |
| Storage Sync | Chrome Sync | Firefox Sync | ✅ Funktioniert |
| Context Menu | ✅ | ✅ | ✅ Identisch |
| Keyboard Shortcuts | ✅ | ✅ | ✅ Identisch |
| Dark Mode | ✅ | ✅ | ✅ Identisch |

---

## 📚 Weitere Dokumentation

- **CHANGELOG.md** - Vollständige Versions-Historie
- **Chrome-Version:** `../` (Haupt-Ordner)
- **GitHub:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager

---

## 🆘 Support

**Issues:** https://github.com/ChristianZernickel/Miro-Password-Link-Manager/issues
**Firefox Add-ons:** https://addons.mozilla.org/ (nach Veröffentlichung)

---

## 📝 Lizenz

MIT License - Siehe Haupt-Repository

---

**Firefox Version entwickelt am:** 28. Oktober 2024  
**Basierend auf Chrome Version:** 2.1.0  
**Status:** ✅ Funktionsfähig und testbereit

---

**Viel Erfolg mit der Firefox-Version! 🦊**

