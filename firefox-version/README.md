# 🔖 Miro Link Plugin - Firefox Edition

> **Version 2.3.0 - Firefox Sidebar Edition** 🚀

Firefox Extension zum Speichern von Links mit Passwörtern/Hinweisen. Vollständig funktionsgleich mit der Chrome-Version!

---

## 📚 Dokumentation

**Firefox-spezifisch:**
- 📖 Diese Datei - Firefox-Übersicht
- 🔧 [FIREFOX_GUIDE.md](FIREFOX_GUIDE.md) - Detaillierte Installations- & Test-Anleitung
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

---

## 🚀 Installation

### Option 1: Temporäres Add-on (Schnell testen)

```bash
# 1. Firefox öffnen
about:debugging#/runtime/this-firefox

# 2. "Temporäres Add-on laden" klicken

# 3. Diese Datei auswählen:
firefox-version/manifest.json

# Fertig! Icon sollte in Toolbar erscheinen
```

**Nachteil:** Add-on wird beim Firefox-Neustart entfernt

---

### Option 2: web-ext (Empfohlen für Entwicklung)

```bash
# 1. web-ext installieren
npm install -g web-ext

# 2. In diesen Ordner wechseln
cd firefox-version

# 3. Firefox mit Extension starten
web-ext run

# 4. Validierung (optional)
web-ext lint

# 5. Build erstellen (optional)
web-ext build
```

**Vorteile:** Auto-Reload, separate Firefox-Instanz, Validierung eingebaut

---

### Option 3: Signiertes Add-on (Permanente Installation)

Für permanente Installation muss das Add-on signiert werden:

**A. Via Mozilla Add-ons (AMO):**
1. Account erstellen: https://addons.mozilla.org/developers/
2. ZIP erstellen (siehe unten)
3. "Submit a New Add-on" hochladen
4. Review abwarten (1-3 Tage)
## 🔧 Technische Details (Firefox)
```
### Manifest V2
```json
{
  "manifest_version": 2,
  "applications": {
    "gecko": {
      "id": "miro-links@christianzernickel.de",
      "strict_min_version": "109.0"
    }
  }
}
```
cd firefox-version
### API-Unterschiede
  CHANGELOG.md README.md \
| Chrome | Firefox | Hinweis |
|--------|---------|---------|
| `chrome.storage` | `browser.storage` | Promises! |
| `chrome.tabs` | `browser.tabs` | Promises! |
| `chrome.scripting` | `browser.tabs.executeScript` | Manifest V2 |
| Service Worker | Background Script | `background.scripts` |

### Anpassungen von Chrome
1. **Alle APIs:** `chrome.*` → `browser.*`
2. **Background:** `background-firefox.js` (klassisches Script)
3. **executeScript:** `tabs.executeScript` statt `scripting.executeScript`
4. **Permissions:** `<all_urls>` und `tabs` hinzugefügt
- 📋 Automatisches Kopieren in Zwischenablage
- 🏷️ Organisation mit Tags (bis zu 5 pro Bookmark)
- 🔍 Echtzeit-Suche in Titel, URL, Passwort und Tags
- 🎨 Automatische Favicons
- 📊 Sortierung nach Datum oder Titel

### 🆕 Neu in v2.2.0: Passwort-Sicherheit 🔒

- **Keine Klartext-Passwörter** im HTML-DOM
- **Platzhalter:** `••••••••••••` statt echtem Passwort
- **Toggle-Button (👁️/🙈)** im Formular
- **Click-to-Reveal:** Passwort nur 3 Sekunden sichtbar
- **Hover-Overlay:** "👁️ Klicken zum Anzeigen"
- **Schutz:** Vor Shoulder Surfing und Screenshots

### Weitere Features
- 🌓 Dark Mode mit Auto-Detection
- 💾 Export/Import (JSON mit 3 Modi)
- ⌨️ Keyboard Shortcuts
- 🖱️ Context Menu Integration (Rechtsklick)
- 🔄 Firefox Sync

**Status:** 7/8 Features (87.5%) - Identisch mit Chrome!

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
## 📄 Lizenz

MIT License
1. `about:debugging#/runtime/this-firefox`
2. "Temporäres Add-on laden"

## 📞 Support & Links

**Firefox-spezifisch:**
- 🔧 [FIREFOX_GUIDE.md](FIREFOX_GUIDE.md) - Detaillierte Anleitung
- 📝 [CHANGELOG.md](CHANGELOG.md) - Versions-Historie
- 🐛 Bekannte Firefox-Probleme im Guide

**Allgemeine Docs:**
- 📖 [../docs/README.md](../docs/README.md) - Feature-Dokumentation
- 🌐 [../README.md](../README.md) - Chrome-Version
- 💬 [GitHub Issues](https://github.com/ChristianZernickel/Miro-Password-Link-Manager/issues)

**Veröffentlichung:**
- 🦊 Mozilla Add-ons: https://addons.mozilla.org/ (nach Review)
- 🌐 Chrome Web Store: (Chrome-Version)

---

**Status:** ✅ Produktionsbereit | **Version:** 2.2.0 | **Features:** 7/8 (87.5%)
3. Nach Änderungen: "Neu laden" klicken

**Basierend auf Chrome Version:** 2.2.0
## 🐛 Firefox-spezifische Bekannte Probleme
**Vollständig funktionsgleich mit Chrome-Version! 🦊✨**
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

