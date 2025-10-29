# 🚀 Release Scripts für GitHub

Ich habe ein komplettes Script-Set für GitHub Releases erstellt! 🎉

## 📦 Erstellte Dateien:

### 1. **`prepare-release.sh`** - Release vorbereiten
Automatisiert die komplette Release-Vorbereitung:
- ✅ Git Status prüfen
- ✅ Release-Ordner erstellen
- ✅ Chrome Version als ZIP packen
- ✅ Firefox Version als ZIP packen
- ✅ Source Code als ZIP packen
- ✅ Release Notes automatisch generieren
- ✅ SHA256 Checksums erstellen
- ✅ Git Tag erstellen

### 2. **`create-github-release.sh`** - GitHub Release erstellen
Veröffentlicht den Release auf GitHub:
- ✅ GitHub CLI Integration
- ✅ Tag zu GitHub pushen
- ✅ Release auf GitHub erstellen
- ✅ Alle ZIP-Dateien hochladen
- ✅ Release Notes hinzufügen
- ✅ Checksums bereitstellen

### 3. **`release.sh`** - All-in-One (Empfohlen!)
Führt beide Scripts nacheinander aus mit Bestätigung

### 4. **`RELEASE_GUIDE.md`** - Komplette Dokumentation
Detaillierte Anleitung für den Release-Prozess

---

## 🎯 Schnellstart

### Erste Schritte (einmalig):

```bash
# 1. Scripts sind bereits ausführbar! ✅

# 2. GitHub CLI installieren (falls noch nicht vorhanden)
# macOS:
brew install gh

# 3. Bei GitHub authentifizieren
gh auth login

# 4. Repository-Info anpassen
nano create-github-release.sh
# Ändere:
# REPO_OWNER="dein-github-username"
# REPO_NAME="miro-link-plugin"
```

### Release erstellen:

```bash
# Option A: Alles auf einmal (Empfohlen)
./release.sh

# Option B: Schritt für Schritt
./prepare-release.sh      # Vorbereiten
./create-github-release.sh # Auf GitHub veröffentlichen
```

Das war's! 🎉

---

## 📁 Was wird erstellt:

Nach `./prepare-release.sh`:

```
releases/v2.2.0/
├── miro-link-plugin-chrome-v2.2.0.zip    # Chrome/Edge/Chromium
├── miro-link-plugin-firefox-v2.2.0.zip   # Firefox
├── miro-link-plugin-source-v2.2.0.zip    # Source Code
├── RELEASE_NOTES.md                       # Auto-generierte Notes
└── SHA256SUMS.txt                         # Checksums für Sicherheit
```

---

## 📝 Release Notes werden automatisch generiert!

Das Script erstellt Release Notes mit:
- ✅ Version und Datum
- ✅ Highlights für Chrome und Firefox
- ✅ Download-Links
- ✅ Feature-Liste
- ✅ Bug Fixes
- ✅ Technische Details
- ✅ Installations-Anweisungen
- ✅ Bekannte Probleme

Du kannst `releases/v2.2.0/RELEASE_NOTES.md` vor dem Upload noch anpassen!

---

## 🔧 Neue Version erstellen:

```bash
# 1. Version in den Scripts ändern
# In prepare-release.sh und create-github-release.sh:
VERSION="2.3.0"  # Neue Version

# 2. Auch in manifest.json(s) ändern
# src/manifest.json
# firefox-version/manifest.json

# 3. Release erstellen
./release.sh
```

---

## 💡 Praktische Tipps:

### Vor dem Release:
```bash
# 1. Alle Änderungen committen
git status
git add .
git commit -m "Prepare release v2.2.0"

# 2. Tests durchführen
# - Chrome laden und testen
# - Firefox laden und testen

# 3. CHANGELOG.md aktualisieren
```

### Nach dem Release:
```bash
# Release auf GitHub öffnen
open "https://github.com/DEIN-USERNAME/miro-link-plugin/releases/tag/v2.2.0"

# Als "Latest Release" markieren falls gewünscht

# Release-Link teilen! 🎉
```

---

## 🎨 Features der Scripts:

- ✅ **Farbige Ausgabe** für bessere Übersicht
- ✅ **Fehlerbehandlung** bei jedem Schritt
- ✅ **Validierung** (Git Status, Auth, Tags, etc.)
- ✅ **Automatische Checksums** für Sicherheit
- ✅ **Ausführliche Logs** für Debugging
- ✅ **Interaktive Bestätigung** in release.sh

---

## 📊 GitHub Release Ergebnis:

Auf GitHub wird automatisch erstellt:

1. **Release Page** mit vollständigen Notes
2. **3 Download-Dateien:**
   - Chrome Version
   - Firefox Version
   - Source Code
3. **Checksum-Datei** für Verifizierung
4. **Git Tag** verlinkt
5. **Automatische Changelog** Integration

Nutzer können dann einfach die ZIP-Dateien herunterladen! 🎉

---

## ⚠️ Wichtige Hinweise:

### GitHub CLI erforderlich:
```bash
# Installieren:
brew install gh              # macOS
# oder siehe: https://cli.github.com/

# Authentifizieren:
gh auth login
```

### Repository-Variablen anpassen:
In `create-github-release.sh` die Zeilen ändern:
```bash
REPO_OWNER="dein-github-username"  # ⚠️ ANPASSEN!
REPO_NAME="miro-link-plugin"       # ⚠️ ANPASSEN!
```

---

## 🐛 Troubleshooting:

### "GitHub CLI nicht installiert"
→ Siehe Installationsanleitung oben

### "Nicht authentifiziert"
→ `gh auth login` ausführen

### "Tag existiert bereits"
```bash
# Lokalen Tag löschen
git tag -d v2.2.0

# Remote Tag löschen
git push origin :refs/tags/v2.2.0

# Erneut versuchen
./prepare-release.sh
```

### "Uncommitted changes"
→ Alle Änderungen erst committen:
```bash
git add .
git commit -m "Your message"
```

---

## 📚 Weitere Informationen:

Siehe `RELEASE_GUIDE.md` für:
- Detaillierte Schritt-für-Schritt Anleitung
- Manuelle Release-Prozesse
- Erweiterte Konfiguration
- Fehlerbehebung
- Best Practices

---

## ✨ Zusammenfassung:

**Mit nur einem Befehl einen vollständigen GitHub Release erstellen:**

```bash
./release.sh
```

Das Script:
1. ✅ Erstellt ZIP-Dateien für Chrome & Firefox
2. ✅ Generiert Release Notes automatisch
3. ✅ Erstellt Checksums
4. ✅ Erstellt Git Tag
5. ✅ Veröffentlicht auf GitHub
6. ✅ Lädt alle Dateien hoch

**Fertig! 🎉**

---

**Die Scripts sind produktionsreif und können sofort verwendet werden!** 🚀

