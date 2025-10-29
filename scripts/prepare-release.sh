#!/bin/bash
# Miro Link Plugin - Release Script
# Version wird automatisch aus manifest.json gelesen
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

# Version automatisch aus manifest.json auslesen
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | head -1 | sed 's/"version": "\(.*\)"/\1/')

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Fehler: Version konnte nicht aus manifest.json gelesen werden!${NC}"
    exit 1
fi

# Variablen
RELEASE_DIR="releases/v${VERSION}"
DATE=$(date +"%Y-%m-%d")

echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Datum: ${DATE}${NC}"
echo ""

# Prüfe ob Firefox manifest.json auch die gleiche Version hat
FIREFOX_VERSION=$(grep -o '"version": "[^"]*"' firefox-version/manifest.json | head -1 | sed 's/"version": "\(.*\)"/\1/')
if [ "$VERSION" != "$FIREFOX_VERSION" ]; then
    echo -e "${YELLOW}⚠️  Warnung: Chrome Version ($VERSION) != Firefox Version ($FIREFOX_VERSION)${NC}"
    read -p "Trotzdem fortfahren? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

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

# Schritt 2: Prüfe ob Release bereits existiert
if [ -d "${RELEASE_DIR}" ]; then
    echo -e "${YELLOW}⚠️  Release-Ordner ${RELEASE_DIR} existiert bereits!${NC}"
    read -p "Überschreiben? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    rm -rf "${RELEASE_DIR}"
fi

# Schritt 3: Erstelle Release-Ordner
echo -e "${YELLOW}Schritt 2: Release-Ordner erstellen...${NC}"
mkdir -p "${RELEASE_DIR}"
echo -e "${GREEN}✅ Ordner erstellt: ${RELEASE_DIR}${NC}"
echo ""

# Schritt 4: Chrome Version packen
echo -e "${YELLOW}Schritt 3: Chrome Version packen...${NC}"
zip -r "${RELEASE_DIR}/miro-link-plugin-chrome-v${VERSION}.zip" \
    manifest.json \
    src \
    assets \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map"
echo -e "${GREEN}✅ Chrome ZIP erstellt${NC}"
echo ""

# Schritt 5: Firefox Version packen
echo -e "${YELLOW}Schritt 4: Firefox Version packen...${NC}"
cd firefox-version
zip -r "../${RELEASE_DIR}/miro-link-plugin-firefox-v${VERSION}.zip" \
    manifest.json \
    src \
    assets \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map" \
    -x "*.zip"
cd ..
echo -e "${GREEN}✅ Firefox ZIP erstellt${NC}"
echo ""

# Schritt 6: Source Code packen
echo -e "${YELLOW}Schritt 5: Source Code packen...${NC}"
zip -r "${RELEASE_DIR}/miro-link-plugin-source-v${VERSION}.zip" \
    src \
    firefox-version \
    assets \
    scripts \
    test \
    manifest.json \
    README.md \
    CHANGELOG.md \
    LICENSE \
    -x "*.DS_Store" \
    -x "*/\.*" \
    -x "*.map" \
    -x "*/node_modules/*" \
    -x "docs/*" \
    -x "*.zip"
echo -e "${GREEN}✅ Source ZIP erstellt${NC}"
echo ""

# Schritt 7: Release Notes generieren
echo -e "${YELLOW}Schritt 6: Release Notes generieren...${NC}"
cat > "${RELEASE_DIR}/RELEASE_NOTES.md" << EOF
# Miro Link Plugin v${VERSION}

**Release Datum:** ${DATE}

## 🎉 Highlights

Diese Version bringt folgende Verbesserungen:

### Chrome/Chromium
- ✅ Alle Features vollständig funktional
- ✅ Import/Export funktioniert perfekt im Popup
- ✅ "Alle Daten löschen" Modal implementiert
- ✅ Verbesserte Passwort-Sicherheit

### Firefox
- ✅ Popup-Modus für schnellen Zugriff
- ✅ Sidebar-Modus für Import/Export
- ✅ "Alle Daten löschen" Modal implementiert
- ✅ Keyboard Shortcuts: Ctrl+Shift+L (Popup), Ctrl+Shift+B (Sidebar)

## 📦 Downloads

- **Chrome/Chromium/Edge:** miro-link-plugin-chrome-v${VERSION}.zip
- **Firefox:** miro-link-plugin-firefox-v${VERSION}.zip
- **Source Code:** miro-link-plugin-source-v${VERSION}.zip

## 🆕 Was ist neu?

Siehe [CHANGELOG.md](../../CHANGELOG.md) für alle Änderungen.

## 📚 Dokumentation

- [Chrome Installation](../../README.md)
- [Firefox Installation](../../firefox-version/README.md)
- [Vollständige Dokumentation](../../docs/README.md)

## 🔐 Sicherheit

Alle Passwörter werden:
- Lokal im Browser gespeichert (chrome.storage.sync)
- Nicht in Klartext im HTML-DOM angezeigt
- Mit Click-to-Reveal geschützt
- Nach 3 Sekunden automatisch verborgen

## ⚙️ Installation

### Chrome/Chromium/Edge
1. ZIP herunterladen und entpacken
2. \`chrome://extensions/\` öffnen
3. "Entwicklermodus" aktivieren
4. "Entpackte Erweiterung laden"
5. Entpackten Ordner auswählen

### Firefox
1. ZIP herunterladen (nicht entpacken!)
2. \`about:addons\` öffnen
3. Zahnrad-Icon → "Add-on aus Datei installieren"
4. ZIP-Datei auswählen

## 🐛 Bug Reports

Probleme bitte als Issue im Repository melden mit:
- Browser + Version
- Fehlerbeschreibung
- Reproduktionsschritte
- Screenshots (falls relevant)

---

**Checksums:** Siehe SHA256SUMS.txt
EOF

echo -e "${GREEN}✅ Release Notes erstellt${NC}"
echo ""

# Schritt 8: Checksums generieren
echo -e "${YELLOW}Schritt 7: Checksums generieren...${NC}"
cd "${RELEASE_DIR}"
shasum -a 256 *.zip > SHA256SUMS.txt
cd ../..
echo -e "${GREEN}✅ Checksums erstellt${NC}"
echo ""

# Schritt 9: Git Tag erstellen
echo -e "${YELLOW}Schritt 8: Git Tag erstellen...${NC}"
if git rev-parse "v${VERSION}" >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Tag v${VERSION} existiert bereits!${NC}"
    read -p "Tag neu erstellen? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "v${VERSION}"
        git tag -a "v${VERSION}" -m "Release v${VERSION}"
        echo -e "${GREEN}✅ Tag neu erstellt${NC}"
    fi
else
    git tag -a "v${VERSION}" -m "Release v${VERSION}"
    echo -e "${GREEN}✅ Tag erstellt: v${VERSION}${NC}"
fi
echo ""

# Zusammenfassung
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       ✅ Release erfolgreich erstellt!     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Version:${NC} ${VERSION}"
echo -e "${BLUE}Ordner:${NC} ${RELEASE_DIR}"
echo ""
echo -e "${YELLOW}Nächste Schritte:${NC}"
echo "1. Prüfe die Release-Dateien in ${RELEASE_DIR}"
echo "2. Führe ./scripts/create-github-release.sh aus (Tag wird gepusht)"
echo "3. Oder pushe manuell: git push origin v${VERSION}"
echo ""

