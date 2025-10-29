#!/bin/bash
# GitHub Release Creation Script
# Version wird automatisch aus manifest.json gelesen
set -e

echo "🚀 GitHub Release erstellen"
echo "============================"
echo ""

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Version automatisch aus manifest.json auslesen
VERSION=$(grep -o '"version": "[^"]*"' manifest.json | head -1 | sed 's/"version": "\(.*\)"/\1/')

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Fehler: Version konnte nicht aus manifest.json gelesen werden!${NC}"
    exit 1
fi

# Variablen
RELEASE_DIR="releases/v${VERSION}"

# GitHub Repository - BITTE ANPASSEN!
REPO_OWNER="ChristianZernickel"
REPO_NAME="Miro-Password-Link-Manager"

echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
echo ""

echo -e "${YELLOW}⚠️  Hinweis: GitHub CLI (gh) muss installiert sein!${NC}"
echo ""

# Prüfe ob gh installiert ist
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) nicht installiert!${NC}"
    echo "Installation: brew install gh"
    exit 1
fi

# Prüfe Authentifizierung
echo -e "${YELLOW}Prüfe GitHub Authentifizierung...${NC}"
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Nicht authentifiziert!${NC}"
    echo "Bitte ausführen: gh auth login"
    exit 1
fi
echo -e "${GREEN}✅ Authentifiziert${NC}"
echo ""

# Prüfe ob Release-Ordner existiert
if [ ! -d "${RELEASE_DIR}" ]; then
    echo -e "${RED}❌ Release-Ordner ${RELEASE_DIR} existiert nicht!${NC}"
    echo "Bitte zuerst: ./scripts/prepare-release.sh"
    exit 1
fi

# Prüfe ob alle Release-Dateien existieren
CHROME_ZIP="${RELEASE_DIR}/miro-link-plugin-chrome-v${VERSION}.zip"
FIREFOX_ZIP="${RELEASE_DIR}/miro-link-plugin-firefox-v${VERSION}.zip"
SOURCE_ZIP="${RELEASE_DIR}/miro-link-plugin-source-v${VERSION}.zip"
CHECKSUMS="${RELEASE_DIR}/SHA256SUMS.txt"
RELEASE_NOTES="${RELEASE_DIR}/RELEASE_NOTES.md"

for file in "$CHROME_ZIP" "$FIREFOX_ZIP" "$SOURCE_ZIP" "$CHECKSUMS" "$RELEASE_NOTES"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Datei nicht gefunden: $file${NC}"
        echo "Bitte zuerst: ./scripts/prepare-release.sh"
        exit 1
    fi
done
echo -e "${GREEN}✅ Alle Release-Dateien vorhanden${NC}"
echo ""

# Prüfe Tag
echo -e "${YELLOW}Prüfe Git Tag...${NC}"
if ! git rev-parse "v${VERSION}" >/dev/null 2>&1; then
    echo -e "${RED}❌ Tag v${VERSION} existiert nicht lokal!${NC}"
    echo "Erstelle Tag..."
    git tag -a "v${VERSION}" -m "Release v${VERSION}"
    echo -e "${GREEN}✅ Tag erstellt${NC}"
else
    echo -e "${GREEN}✅ Tag existiert${NC}"
fi
echo ""

# Pushe Tag
echo -e "${YELLOW}Pushe Tag zu GitHub...${NC}"
if git ls-remote --tags origin | grep -q "refs/tags/v${VERSION}"; then
    echo -e "${YELLOW}⚠️  Tag v${VERSION} existiert bereits auf GitHub${NC}"
    read -p "Überschreiben? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin ":refs/tags/v${VERSION}" 2>/dev/null || true
        git push origin "v${VERSION}"
        echo -e "${GREEN}✅ Tag neu gepusht${NC}"
    fi
else
    git push origin "v${VERSION}"
    echo -e "${GREEN}✅ Tag gepusht${NC}"
fi
echo ""

# Prüfe ob Release bereits existiert
echo -e "${YELLOW}Prüfe ob GitHub Release bereits existiert...${NC}"
if gh release view "v${VERSION}" --repo "${REPO_OWNER}/${REPO_NAME}" &>/dev/null; then
    echo -e "${YELLOW}⚠️  Release v${VERSION} existiert bereits auf GitHub${NC}"
    read -p "Release löschen und neu erstellen? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh release delete "v${VERSION}" --repo "${REPO_OWNER}/${REPO_NAME}" --yes
        echo -e "${GREEN}✅ Altes Release gelöscht${NC}"
    else
        echo -e "${YELLOW}Abgebrochen${NC}"
        exit 1
    fi
fi
echo ""

# Erstelle Release
echo -e "${YELLOW}Erstelle GitHub Release...${NC}"
gh release create "v${VERSION}" \
    --repo "${REPO_OWNER}/${REPO_NAME}" \
    --title "Miro Link Plugin v${VERSION}" \
    --notes-file "${RELEASE_NOTES}" \
    "${CHROME_ZIP}#Chrome/Chromium/Edge Version" \
    "${FIREFOX_ZIP}#Firefox Version" \
    "${SOURCE_ZIP}#Source Code" \
    "${CHECKSUMS}#Checksums"

echo ""
echo -e "${GREEN}✅ GitHub Release erfolgreich erstellt!${NC}"
echo ""
echo -e "${BLUE}🔗 https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/v${VERSION}${NC}"
echo ""
echo -e "${YELLOW}Nächste Schritte:${NC}"
echo "1. Release auf GitHub überprüfen"
echo "2. Bei Bedarf Release-Notes auf GitHub bearbeiten"
echo "3. Release als 'Latest' markieren (falls gewünscht)"
echo ""

