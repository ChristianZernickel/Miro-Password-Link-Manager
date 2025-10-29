# ⚡ Miro Link Plugin - Firefox Sidebar Guide

**Version 2.2.0 | Stand: 29. Oktober 2025**

## 🎉 Die perfekte Lösung für Firefox!

### Das Problem
Firefox schließt Extension-Popups automatisch, wenn native Dialoge (wie File-Picker) geöffnet werden. Dies verhindert, dass der Import-Prozess im Popup funktioniert.

### Die Lösung
**Sidebar-Modus!** Die Firefox Sidebar ist ein permanentes UI-Element, das **NICHT** geschlossen wird, wenn File-Dialoge geöffnet werden.

---

## 🚀 Installation & Aktivierung

### Schritt 1: Extension laden
```
1. Öffne: about:debugging#/runtime/this-firefox
2. Klicke: "Temporäres Add-on laden..."
3. Navigiere zu: /path/to/miro-link-plugin/firefox-version/
4. Wähle: manifest.json
```

### Schritt 2: Sidebar öffnen

#### Methode A: Keyboard Shortcut (Empfohlen)
```
Windows/Linux: Ctrl + Shift + B
macOS:        Cmd + Shift + B
```

#### Methode B: Firefox Menü
```
1. Klicke auf Firefox Menü (☰)
2. Wähle: "Sidebars"
3. Klicke: "Miro Links"
```

#### Methode C: View Menü
```
View → Sidebars → Miro Links
```

---

## 📥 Import durchführen (Sidebar erforderlich)

### Voraussetzung
✅ Sidebar muss geöffnet sein (siehe oben)

### Schritt-für-Schritt:

1. **Sidebar öffnen**
   - Drücke `Ctrl+Shift+B`
   - Die Sidebar öffnet sich auf der linken Seite

2. **Einstellungen öffnen**
   - Klicke auf das ⚙️ Zahnrad-Symbol (oben rechts in der Sidebar)
   - Das Einstellungen-Panel öffnet sich

3. **Import starten**
   - Scrolle zu "💾 Daten-Verwaltung"
   - Klicke auf "📤 Importieren"
   - File-Picker öffnet sich

4. **Datei auswählen**
   - ✅ **Wichtig:** Die Sidebar bleibt offen!
   - Wähle deine JSON-Datei (aus vorherigem Export)
   - Klicke "Öffnen"

5. **Import-Modus wählen**
   - Das Import-Modal erscheint in der Sidebar
   - Wähle einen der drei Modi:
     - **🔄 Ersetzen**: Löscht alle aktuellen Daten, importiert neue
     - **➕ Zusammenführen**: Fügt neue Bookmarks hinzu, überspringt Duplikate
     - **🔃 Zusammenführen + Update**: Aktualisiert bestehende, fügt neue hinzu

6. **Fertig!**
   - Import wird durchgeführt
   - Erfolgsmeldung erscheint
   - Bookmarks sind sofort verfügbar

6. **Fertig!**
   - Import wird durchgeführt
   - Erfolgsmeldung erscheint
   - Bookmarks sind sofort verfügbar

---

## 🎯 Zwei Nutzungsmodi in Firefox

### Modus 1: Popup (Schnellzugriff)

**Aktivierung:**
- Klicke auf das Extension-Icon in der Toolbar
- Oder drücke: `Ctrl+Shift+L` (Mac: `Cmd+Shift+L`)

**Funktionen:**
- ✅ Bookmarks durchsuchen
- ✅ Bookmarks öffnen (Passwort wird in Zwischenablage kopiert)
- ✅ Neue Bookmarks erstellen
- ✅ Bookmarks bearbeiten/löschen
- ✅ Export
- ✅ Alle Daten löschen
- ⚠️ **Import funktioniert NICHT** (Popup schließt sich)

**Empfohlen für:**
- Schnellen Zugriff auf gespeicherte Links
- Alltägliche Nutzung
- Wenn keine Import/Export-Operationen nötig sind

---

### Modus 2: Sidebar (Volle Funktionalität)

**Aktivierung:**
- Drücke: `Ctrl+Shift+B` (Mac: `Cmd+Shift+B`)
- Oder: Firefox Menü → Sidebars → Miro Links

**Funktionen:**
- ✅ Alle Popup-Funktionen
- ✅ **Import funktioniert!** (Sidebar schließt sich nicht)
- ✅ Mehr Platz für Übersicht
- ✅ Sidebar-Größe anpassbar
- ✅ Kann dauerhaft offen bleiben

**Empfohlen für:**
- Import/Export von Daten
- Verwaltung vieler Bookmarks
- Power-User
- Wenn mehr Bildschirmplatz verfügbar ist

---

## ✨ Features & Funktionen

### Allgemeine Features (in beiden Modi)
- 🔖 **Link-Verwaltung**: Speichere Websites mit Passwörtern/Hinweisen
- 📋 **Auto-Copy**: Passwort wird beim Öffnen automatisch kopiert
- 🔍 **Suche & Filter**: Durchsuche Titel, URL und Passwörter
- 🏷️ **Tags**: Organisiere Links mit Tags (max. 5 pro Link)
- 📊 **Sortierung**: Nach Datum oder Titel
- 🌙 **Dark Mode**: Automatische Theme-Erkennung
- ⚡ **Keyboard Shortcuts**: Schnelle Navigation
- 📥 **Export**: Exportiere alle Daten als JSON

### Sidebar-exklusive Features
- 📤 **Import**: Importiere JSON-Dateien (3 Modi)
- 📏 **Anpassbare Größe**: Vergrößere/verkleinere die Sidebar
- 🔄 **Persistenz**: Sidebar bleibt bei File-Dialogen offen

---

## 🎨 Sidebar anpassen

### Größe ändern
1. Bewege die Maus an den rechten Rand der Sidebar
2. Der Cursor ändert sich zu ↔️
3. Klicke und ziehe, um die Breite anzupassen
4. Empfohlen: 350-500px für optimale Darstellung

### Dauerhaft offen lassen
- Die Sidebar bleibt geöffnet, auch wenn du andere Tabs nutzt
- Perfekt für schnellen Zugriff während der Arbeit
- Schließe mit: `Ctrl+Shift+B` oder Klick auf X

---

## 🔑 Keyboard Shortcuts

| Aktion | Windows/Linux | macOS |
|--------|---------------|-------|
| Popup öffnen | `Ctrl+Shift+L` | `Cmd+Shift+L` |
| Sidebar öffnen/schließen | `Ctrl+Shift+B` | `Cmd+Shift+B` |
| Neuer Link | `Ctrl+N` | `Cmd+N` |
| Suche fokussieren | `/` | `/` |
| Escape | `Esc` | `Esc` |

---

## ❓ Häufige Fragen

### Warum funktioniert Import nicht im Popup?
Firefox schließt aus Sicherheitsgründen Extension-Popups, wenn native System-Dialoge (File-Picker) geöffnet werden. Dies ist eine Browser-Policy und kann nicht umgangen werden. Nutze die Sidebar für Import-Operationen.

### Kann ich Popup UND Sidebar gleichzeitig nutzen?
Ja! Beide greifen auf die gleichen Daten zu. Du kannst:
- Popup für schnellen Alltags-Zugriff nutzen
- Sidebar für Import/Export und Verwaltung nutzen

### Muss die Sidebar immer offen sein?
Nein. Öffne sie nur wenn benötigt (z.B. für Import). Für normale Nutzung ist das Popup ausreichend.

### Werden die Daten synchronisiert?
Ja, die Extension nutzt Firefox Sync Storage. Daten werden über deine Firefox-Geräte synchronisiert (wenn Sync aktiviert ist).

---

## 🐛 Troubleshooting

### Sidebar öffnet sich nicht
**Lösung:**
1. Prüfe ob Extension korrekt geladen ist: `about:debugging`
2. Prüfe ob Sidebar in Firefox aktiviert ist: View → Sidebars
3. Versuche den Keyboard Shortcut: `Ctrl+Shift+B`

### Import-Modal erscheint nicht
**Lösung:**
1. ✅ Stelle sicher, dass du die **Sidebar** nutzt (nicht Popup!)
2. Console öffnen (F12) und nach Fehlern suchen
3. Extension neu laden

### Bookmarks werden nicht angezeigt
**Lösung:**
1. Prüfe Storage: Einstellungen → Statistiken
2. Versuche zu exportieren um Datenintegrität zu prüfen
3. Bei Problemen: Import-Funktion nutzen um Backup wiederherzustellen

---

## 📊 Vergleich: Firefox vs. Chrome

| Feature | Chrome (Popup) | Firefox (Popup) | Firefox (Sidebar) |
|---------|----------------|-----------------|-------------------|
| Link speichern | ✅ | ✅ | ✅ |
| Suchen & Filtern | ✅ | ✅ | ✅ |
| Export | ✅ | ✅ | ✅ |
| **Import** | ✅ | ❌ | ✅ |
| Alle löschen | ✅ | ✅ | ✅ |
| Bildschirmplatz | Popup | Popup | Sidebar (anpassbar) |
| Bleibt offen | Ja | Nein (bei Dialogen) | Ja |

---

## 🎉 Zusammenfassung

**Firefox bietet zwei flexible Nutzungsmodi:**

1. **Popup-Modus**: Schnell, kompakt, perfekt für tägliche Nutzung
2. **Sidebar-Modus**: Vollständig, mit Import-Funktion, ideal für Verwaltung

**Empfohlener Workflow:**
- 📌 Nutze das **Popup** für den Alltag (Bookmarks öffnen, neue anlegen)
- 📥 Nutze die **Sidebar** für Import/Export und umfangreiche Verwaltung

**Die Sidebar-Lösung macht die Firefox-Version genauso funktional wie Chrome!** ✨

---

## 📝 Version & Support

- **Version**: 2.2.0
- **Datum**: 29. Oktober 2025
- **Kompatibilität**: Firefox 109+
- **Lizenz**: Siehe LICENSE Datei

Für weitere Informationen siehe die Haupt-README.md Datei.

---

**Viel Erfolg mit Miro Link Plugin! 🚀**

