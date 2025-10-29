#!/bin/bash
# Miro Link Plugin - Release Script
# Version: 2.3.0
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
VERSION="2.3.0"
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
cat > "${RELEASE_DIR}/RELEASE_NOTES.md" << 'EOF'
# Miro Link Plugin v2.3.0
**Release Datum:** $(date +"%d. %B %Y")
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
- **Chrome/Chromium/Edge:** miro-link-plugin-chrome-v2.3.0.zip
- **Firefox:** miro-link-plugin-firefox-v2.3.0.zip
- **Source Code:** miro-link-plugin-source-v2.3.0.zip
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
## 📚 Dokumentation
Siehe docs/ Ordner für vollständige Dokumentation.
## ⚠️ Wichtige Hinweise
### Firefox Nutzer
**Import-Feature:** Nutze die Sidebar (Ctrl+Shift+B) für Import-Operationen.
### Chrome Nutzer
Alle Features funktionieren wie gewohnt im Popup.
EOF
echo -e "${GREEN}✅ Release Notes erstellt${NC}"
echo ""
# Schritt 7: Checksums erstellen
echo -e "${YELLOW}Schritt 7: Checksums erstellen...${NC}"
cd "${RELEASE_DIR}"
shasum -a 256 *.zip > SHA256SUMS.txt
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
echo "📦 Dateien in: ${RELEASE_DIR}/"
ls -lh "${RELEASE_DIR}/"
echo ""
echo "📝 Nächste Schritte:"
echo "  1. Teste die ZIP-Dateien"
echo "  2. ./create-github-release.sh"
echo ""
