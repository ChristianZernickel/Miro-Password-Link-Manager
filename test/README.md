# Test Suite - Miro Link Plugin

Diese Test-Suite ermöglicht automatisierte und manuelle Tests für das Miro Link Plugin.

## 📁 Struktur

```
test/
├── README.md                    # Diese Datei
├── manual/                      # Manuelle Test-Checklisten
│   ├── chrome-tests.md         # Chrome-spezifische Tests
│   ├── firefox-tests.md        # Firefox-spezifische Tests
│   └── feature-tests.md        # Feature-basierte Tests
├── automated/                   # Automatisierte Tests
│   ├── storage.test.js         # Storage-Module Tests
│   ├── exportImport.test.js    # Export/Import Tests
│   ├── tags.test.js            # Tags-Module Tests
│   └── search.test.js          # Search-Module Tests
├── fixtures/                    # Test-Daten
│   ├── sample-bookmarks.json   # Beispiel-Bookmarks
│   └── invalid-data.json       # Ungültige Daten für Tests
└── test-runner.html            # Browser-Test-Runner
```

## 🚀 Quick Start

### Manuelle Tests

1. Öffne die entsprechende Test-Checkliste in `manual/`
2. Folge den Schritten und markiere erledigte Tests
3. Dokumentiere Fehler und unerwartetes Verhalten

### Automatisierte Tests

**WICHTIG:** Die Tests müssen im Extension-Kontext ausgeführt werden!

⚠️ **Nach Änderungen an der manifest.json:** Extension auf `chrome://extensions/` neu laden!

#### So öffnest du den Test-Runner:

**Chrome/Edge:**
1. Installiere die Extension (`chrome://extensions/` → "Entpackte Erweiterung laden")
2. **Reload die Extension** (Reload-Button auf chrome://extensions/)
3. Öffne die Extension (Icon klicken oder `Ctrl+Shift+L`)
4. Öffne DevTools (Rechtsklick auf Popup → "Prüfen")
5. In der Console eingeben und Enter drücken:
   ```javascript
   window.open(chrome.runtime.getURL('test/test-runner.html'))
   ```

**Firefox:**
1. Installiere die Extension (`about:debugging` → "Temporäres Add-on laden")
2. **Reload die Extension** (Reload-Button bei der Extension)
3. Öffne die Extension (Icon klicken oder `Ctrl+Shift+L`)
4. Öffne DevTools (Rechtsklick auf Popup → "Element untersuchen")
5. In der Console eingeben und Enter drücken:
   ```javascript
   window.open(browser.runtime.getURL('test/test-runner.html'))
   ```

**✅ Alle Tests sind direkt sichtbar** - kein Aufklappen nötig!

## 📋 Test-Kategorien

### 1. Storage Tests
- ✓ Bookmarks speichern
- ✓ Bookmarks laden
- ✓ Bookmarks löschen
- ✓ Alle Bookmarks löschen
- ✓ Chrome Sync Funktionalität

### 2. Export/Import Tests
- ✓ Export als JSON (verschiedene Modi)
- ✓ Import validieren
- ✓ Duplikat-Erkennung
- ✓ Fehlerbehandlung bei ungültigen Daten
- ✓ Merge-Strategien

### 3. Tags Tests
- ✓ Tags hinzufügen (max 5)
- ✓ Tags entfernen
- ✓ Tag-Filter
- ✓ Tag-Autocomplete
- ✓ Tag-Validierung

### 4. Search Tests
- ✓ Titel-Suche
- ✓ URL-Suche
- ✓ Passwort-Suche
- ✓ Tag-basierte Suche
- ✓ Case-insensitive Suche

### 5. UI Tests
- ✓ Dark Mode Toggle
- ✓ Modal-Dialoge
- ✓ Keyboard Shortcuts
- ✓ Context Menu
- ✓ Responsive Design

### 6. Security Tests
- ✓ Passwort-Obfuskierung
- ✓ Click-to-Reveal
- ✓ Clipboard-Sicherheit
- ✓ XSS-Prävention

## 📝 Test-Protokoll

Jeder Test sollte dokumentieren:
- ✅ **Pass**: Test erfolgreich
- ❌ **Fail**: Test fehlgeschlagen (mit Beschreibung)
- ⚠️ **Warning**: Test mit Einschränkungen
- 🔄 **Skipped**: Test übersprungen

## 🔧 Test-Tools

### Empfohlene Browser-Extensions für Tests
- Chrome DevTools
- Firefox Developer Tools
- React Developer Tools (falls relevant)

### Logging
Aktiviere Debug-Logging in der Browser-Konsole:
```javascript
localStorage.setItem('DEBUG', 'true');
```

## 📊 Coverage-Ziele

- **Funktionale Abdeckung**: 95%+
- **Browser-Kompatibilität**: Chrome/Firefox
- **Edge Cases**: Dokumentiert und getestet

## 🐛 Bug-Reporting

Bei gefundenen Bugs:
1. Screenshot/Video anfertigen
2. Browser + Version notieren
3. Reproduktionsschritte dokumentieren
4. Issue im Repository erstellen

