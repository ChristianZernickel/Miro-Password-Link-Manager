# Miro Link Plugin - Release Scripts

## 📦 Release-Prozess

Dieses Projekt enthält automatisierte Scripts für den Release-Prozess.

### Voraussetzungen

1. **Git** installiert und konfiguriert
2. **GitHub CLI (gh)** installiert: https://cli.github.com/
3. **Authentifizierung** bei GitHub: `gh auth login`
4. **Schreibrechte** auf das Repository

### Scripts Übersicht

#### 1. `prepare-release.sh` 
Bereitet den Release vor:
- ✅ Prüft Git Status
- ✅ Erstellt Release-Ordner
- ✅ Packt Chrome Version als ZIP
- ✅ Packt Firefox Version als ZIP
- ✅ Packt Source Code als ZIP
- ✅ Generiert Release Notes
- ✅ Erstellt SHA256 Checksums
- ✅ Erstellt Git Tag

**Verwendung:**
```bash
chmod +x prepare-release.sh
./prepare-release.sh
```

**Output:**
- `releases/v2.2.0/miro-link-plugin-chrome-v2.2.0.zip`
- `releases/v2.2.0/miro-link-plugin-firefox-v2.2.0.zip`
- `releases/v2.2.0/miro-link-plugin-source-v2.2.0.zip`
- `releases/v2.2.0/RELEASE_NOTES.md`
- `releases/v2.2.0/SHA256SUMS.txt`

---

#### 2. `create-github-release.sh`
Erstellt GitHub Release:
- ✅ Prüft GitHub CLI Installation
- ✅ Prüft Authentifizierung
- ✅ Pusht Git Tag zu GitHub
- ✅ Erstellt Release auf GitHub
- ✅ Lädt alle ZIP-Dateien hoch
- ✅ Fügt Release Notes hinzu

**Verwendung:**
```bash
chmod +x create-github-release.sh

# ⚠️ Wichtig: Passe zuerst die Variablen an!
# Öffne die Datei und ändere:
# REPO_OWNER="DEIN-USERNAME"
# REPO_NAME="miro-link-plugin"

./create-github-release.sh
```

---

#### 3. `release.sh` (Empfohlen)
Führt beide Scripts nacheinander aus:
- ✅ Ruft `prepare-release.sh` auf
- ✅ Fragt ob GitHub Release erstellt werden soll
- ✅ Ruft `create-github-release.sh` auf (optional)

**Verwendung:**
```bash
chmod +x release.sh
./release.sh
```

---

## 🚀 Schnellstart

### Kompletter Release-Prozess (Empfohlen)

```bash
# 1. Alle Scripts ausführbar machen
chmod +x *.sh

# 2. Repo-Variablen anpassen
# Öffne create-github-release.sh und ändere:
nano create-github-release.sh
# REPO_OWNER="dein-github-username"
# REPO_NAME="miro-link-plugin"

# 3. Release erstellen
./release.sh
```

Das war's! 🎉

---

## 📝 Manueller Prozess

Falls du die Scripts manuell ausführen möchtest:

### Schritt 1: Release vorbereiten
```bash
./prepare-release.sh
```

### Schritt 2: Release testen
```bash
# Prüfe die erstellten Dateien
ls -lh releases/v2.2.0/

# Teste die ZIP-Dateien
unzip -t releases/v2.2.0/miro-link-plugin-chrome-v2.2.0.zip
unzip -t releases/v2.2.0/miro-link-plugin-firefox-v2.2.0.zip

# Verifiziere Checksums
cd releases/v2.2.0/
sha256sum -c SHA256SUMS.txt
cd ../..
```

### Schritt 3: GitHub Release erstellen
```bash
./create-github-release.sh
```

---

## 🔧 Konfiguration

### Version ändern

Alle Scripts verwenden aktuell Version `2.2.0`. Um eine neue Version zu erstellen:

1. Öffne alle drei Script-Dateien
2. Ändere die Zeile: `VERSION="2.2.0"` zu `VERSION="2.3.0"` (oder gewünschte Version)
3. Führe die Scripts aus

### Repository-Informationen

In `create-github-release.sh` anpassen:
```bash
REPO_OWNER="dein-github-username"  # Dein GitHub Username
REPO_NAME="miro-link-plugin"       # Repository Name
```

---

## 📊 Release-Struktur

Nach `prepare-release.sh`:

```
releases/
└── v2.2.0/
    ├── miro-link-plugin-chrome-v2.2.0.zip     # Chrome Version
    ├── miro-link-plugin-firefox-v2.2.0.zip    # Firefox Version
    ├── miro-link-plugin-source-v2.2.0.zip     # Source Code
    ├── RELEASE_NOTES.md                        # Release Notes
    └── SHA256SUMS.txt                          # Checksums
```

---

## ⚠️ Wichtige Hinweise

### Vor dem Release
- ✅ Alle Änderungen committen
- ✅ Tests durchführen (Chrome + Firefox)
- ✅ CHANGELOG.md aktualisieren
- ✅ Version in manifest.json(s) aktualisieren

### Nach dem Release
- ✅ Release auf GitHub prüfen
- ✅ Downloads testen
- ✅ Checksums verifizieren
- ✅ Release-Link teilen

### Fehlerbehebung

**"GitHub CLI nicht installiert"**
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

**"Nicht authentifiziert"**
```bash
gh auth login
# Folge den Anweisungen
```

**"Tag existiert bereits"**
```bash
# Lokalen Tag löschen
git tag -d v2.2.0

# Remote Tag löschen (falls bereits gepusht)
git push origin :refs/tags/v2.2.0

# Erneut versuchen
./prepare-release.sh
```

---

## 🔍 Checksums verifizieren

Nach dem Download können Nutzer die Integrität prüfen:

```bash
# Download SHA256SUMS.txt
wget https://github.com/USER/miro-link-plugin/releases/download/v2.2.0/SHA256SUMS.txt

# Download ZIP-Dateien
wget https://github.com/USER/miro-link-plugin/releases/download/v2.2.0/miro-link-plugin-chrome-v2.2.0.zip

# Verifizieren
sha256sum -c SHA256SUMS.txt
```

---

## 📚 Weitere Ressourcen

- [GitHub CLI Dokumentation](https://cli.github.com/manual/)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [Semantic Versioning](https://semver.org/)

---

**Version:** 2.2.0  
**Letzte Aktualisierung:** 29. Oktober 2025
#!/bin/bash

# Miro Link Plugin - Release Script
# Version: 2.2.0
# Datum: 29. Oktober 2025

set -e  # Exit bei Fehler

echo "🚀 Miro Link Plugin - Release Vorbereitung"
echo "==========================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variablen
VERSION="2.2.0"
CHROME_DIR="src"
FIREFOX_DIR="firefox-version/src"
RELEASE_DIR="releases/v${VERSION}"
DATE=$(date +"%Y-%m-%d")

echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Datum: ${DATE}${NC}"
echo ""

# Schritt 1: Prüfe ob Git sauber ist
echo -e "${YELLOW}Schritt 1: Git Status prüfen...${NC}"
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}❌ Es gibt uncommittete Änderungen!${NC}"
    echo "Bitte committe oder stashe alle Änderungen vor dem Release."
    git status -s
    exit 1
fi
echo -e "${GREEN}✅ Git ist sauber${NC}"
echo ""

# Schritt 2: Erstelle Release-Ordner
echo -e "${YELLOW}Schritt 2: Release-Ordner erstellen...${NC}"
mkdir -p "${RELEASE_DIR}"
echo -e "${GREEN}✅ Ordner erstellt: ${RELEASE_DIR}${NC}"
echo ""

# Schritt 3: Chrome Version packen
echo -e "${YELLOW}Schritt 3: Chrome Version packen...${NC}"
cd "${CHROME_DIR}"
zip -r "../${RELEASE_DIR}/miro-link-plugin-chrome-v${VERSION}.zip" \
    . \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map"
cd ..
echo -e "${GREEN}✅ Chrome ZIP erstellt${NC}"
echo ""

# Schritt 4: Firefox Version packen
echo -e "${YELLOW}Schritt 4: Firefox Version packen...${NC}"
cd "${FIREFOX_DIR}"
zip -r "../../${RELEASE_DIR}/miro-link-plugin-firefox-v${VERSION}.zip" \
    . \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map"
cd ../..
echo -e "${GREEN}✅ Firefox ZIP erstellt${NC}"
echo ""

# Schritt 5: Source Code packen
echo -e "${YELLOW}Schritt 5: Source Code packen...${NC}"
zip -r "${RELEASE_DIR}/miro-link-plugin-source-v${VERSION}.zip" \
    src \
    firefox-version \
    assets \
    docs \
    manifest.json \
    README.md \
    CHANGELOG.md \
    LICENSE \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map" \
    -x "*/node_modules/*"
echo -e "${GREEN}✅ Source ZIP erstellt${NC}"
echo ""

# Schritt 6: Release Notes generieren
echo -e "${YELLOW}Schritt 6: Release Notes generieren...${NC}"
cat > "${RELEASE_DIR}/RELEASE_NOTES.md" << EOF
# Miro Link Plugin v${VERSION}

**Release Datum:** ${DATE}

## 🎉 Highlights

### Chrome/Chromium
- ✅ Alle Features vollständig funktional
- ✅ Import/Export funktioniert perfekt im Popup
- ✅ "Alle Daten löschen" Modal implementiert
- ✅ Verbesserte Import-Logik mit Verifizierung

### Firefox
- ✅ Popup-Modus für schnellen Zugriff
- ✅ **NEU: Sidebar-Modus** für Import/Export
- ✅ "Alle Daten löschen" Modal implementiert
- ✅ Keyboard Shortcuts: Ctrl+Shift+L (Popup), Ctrl+Shift+B (Sidebar)

## 📦 Downloads

- **Chrome/Chromium/Edge:** \`miro-link-plugin-chrome-v${VERSION}.zip\`
- **Firefox:** \`miro-link-plugin-firefox-v${VERSION}.zip\`
- **Source Code:** \`miro-link-plugin-source-v${VERSION}.zip\`

## 🆕 Was ist neu?

### Neue Features
- ✅ Modal-basierte Bestätigung für "Alle Daten löschen"
- ✅ Drei Export-Optionen vor dem Löschen
- ✅ Import-Modal mit drei Modi (Replace/Merge/Update)
- ✅ Firefox Sidebar-Integration für zuverlässige Imports
- ✅ Verbesserte Import-Logik mit expliziter Feldzuweisung
- ✅ Storage-Verifizierung nach Import
- ✅ Console-Logging für Debugging

### Verbesserungen
- ✅ Z-Index Hierarchie optimiert (Modals über Settings)
- ✅ HTML-Struktur korrigiert (alle Modals auf gleicher Ebene)
- ✅ CSS für neue Modals hinzugefügt
- ✅ Event Handler für alle Modal-Buttons
- ✅ Escape-Key Support für alle Modals
- ✅ Click-outside zum Schließen

### Bug Fixes
- ✅ "Alle Daten löschen" Button zeigt jetzt Modal an
- ✅ Import speichert Daten korrekt in Storage
- ✅ Modals erscheinen vor Settings-Panel
- ✅ Firefox Import funktioniert via Sidebar

## 🔧 Technische Details

### Chrome Version
- Manifest V3 kompatibel
- Nutzt chrome.storage.sync API
- Popup-basierte UI

### Firefox Version
- Manifest V2 (Firefox-spezifisch)
- Nutzt browser.storage.sync API
- Dual-Mode: Popup + Sidebar
- Sidebar für Import erforderlich (Browser-Einschränkung)

## 📚 Dokumentation

Siehe \`docs/\` Ordner für:
- Chrome Installation & Nutzung
- Firefox Sidebar Guide
- Feature-Dokumentation
- Troubleshooting

## ⚠️ Wichtige Hinweise

### Firefox Nutzer
**Import-Feature:** Nutze die Sidebar (\`Ctrl+Shift+B\`) für Import-Operationen. 
Das Popup schließt sich bei File-Dialogs (Firefox Browser-Policy).

### Chrome Nutzer
Alle Features funktionieren wie gewohnt im Popup.

## 🐛 Bekannte Probleme

Keine bekannten kritischen Probleme.

## 🙏 Danke

Vielen Dank für die Nutzung von Miro Link Plugin!

---

**Installations-Hinweise:**

### Chrome/Chromium/Edge:
1. Entpacke \`miro-link-plugin-chrome-v${VERSION}.zip\`
2. Öffne \`chrome://extensions/\`
3. Aktiviere "Entwicklermodus"
4. Klicke "Entpackte Erweiterung laden"
5. Wähle den entpackten Ordner

### Firefox:
1. Entpacke \`miro-link-plugin-firefox-v${VERSION}.zip\`
2. Öffne \`about:debugging#/runtime/this-firefox\`
3. Klicke "Temporäres Add-on laden"
4. Wähle \`manifest.json\` aus dem entpackten Ordner

**Für permanente Installation in Firefox:** Signierung erforderlich (addons.mozilla.org)
EOF

echo -e "${GREEN}✅ Release Notes erstellt${NC}"
echo ""

# Schritt 7: Checksums erstellen
echo -e "${YELLOW}Schritt 7: Checksums erstellen...${NC}"
cd "${RELEASE_DIR}"
sha256sum *.zip > SHA256SUMS.txt
echo -e "${GREEN}✅ Checksums erstellt${NC}"
cd ../..
echo ""

# Schritt 8: Git Tag erstellen
echo -e "${YELLOW}Schritt 8: Git Tag erstellen...${NC}"
git tag -a "v${VERSION}" -m "Release v${VERSION} - ${DATE}"
echo -e "${GREEN}✅ Git Tag erstellt: v${VERSION}${NC}"
echo ""

# Zusammenfassung
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Release v${VERSION} vorbereitet!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "📦 Dateien erstellt in: ${RELEASE_DIR}/"
ls -lh "${RELEASE_DIR}/"
echo ""
echo "📝 Nächste Schritte:"
echo ""
echo "1. Prüfe die Release-Dateien:"
echo -e "   ${BLUE}ls -lh ${RELEASE_DIR}/${NC}"
echo ""
echo "2. Teste die ZIP-Dateien in beiden Browsern"
echo ""
echo "3. Pushe Tag zu GitHub:"
echo -e "   ${BLUE}git push origin v${VERSION}${NC}"
echo ""
echo "4. Erstelle GitHub Release:"
echo -e "   ${BLUE}./create-github-release.sh${NC}"
echo "   Oder manuell auf: https://github.com/DEIN-USERNAME/miro-link-plugin/releases/new"
echo ""
echo "5. Lade die ZIP-Dateien auf GitHub hoch"
echo ""
echo -e "${YELLOW}⚠️  Vergiss nicht die Checksums zu verifizieren!${NC}"
echo ""

