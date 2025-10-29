#!/bin/bash
# GitHub Release Creation Script
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
# Variablen
VERSION="2.3.0"
RELEASE_DIR="releases/v${VERSION}"
REPO_OWNER="ChristianZernickel"  # ⚠️ ANPASSEN!
REPO_NAME="Miro-Password-Link-Manager"  # ⚠️ ANPASSEN!
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
    echo "Bitte: gh auth login"
    exit 1
fi
echo -e "${GREEN}✅ Authentifiziert${NC}"
echo ""
# Prüfe Tag
echo -e "${YELLOW}Prüfe Tag...${NC}"
if ! git tag | grep -q "^v${VERSION}$"; then
    echo -e "${RED}❌ Tag v${VERSION} existiert nicht!${NC}"
    echo "Erstelle zuerst: ./prepare-release.sh"
    exit 1
fi
echo -e "${GREEN}✅ Tag existiert${NC}"
echo ""
# Pushe Tag
echo -e "${YELLOW}Pushe Tag zu GitHub...${NC}"
git push origin "v${VERSION}" 2>/dev/null || echo "(bereits gepusht)"
echo -e "${GREEN}✅ Tag gepusht${NC}"
echo ""
# Erstelle Release
echo -e "${YELLOW}Erstelle GitHub Release...${NC}"
gh release create "v${VERSION}" \
    --repo "${REPO_OWNER}/${REPO_NAME}" \
    --title "Miro Link Plugin v${VERSION}" \
    --notes-file "${RELEASE_DIR}/RELEASE_NOTES.md" \
    "${RELEASE_DIR}/miro-link-plugin-chrome-v${VERSION}.zip#Chrome/Chromium/Edge Version" \
    "${RELEASE_DIR}/miro-link-plugin-firefox-v${VERSION}.zip#Firefox Version" \
    "${RELEASE_DIR}/miro-link-plugin-source-v${VERSION}.zip#Source Code" \
    "${RELEASE_DIR}/SHA256SUMS.txt#Checksums"
echo ""
echo -e "${GREEN}✅ GitHub Release erstellt!${NC}"
echo ""
echo "🔗 https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/v${VERSION}"
echo ""
