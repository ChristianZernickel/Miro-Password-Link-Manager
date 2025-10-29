#!/bin/bash
# Quick Release Script - Ruft die Skripte im scripts/ Ordner auf
set -e
echo "🚀 Miro Link Plugin - Vollständiger Release"
echo "==========================================="
echo ""
# Prüfe ob wir im Root-Verzeichnis sind
if [ ! -f "manifest.json" ]; then
    echo "❌ Fehler: Bitte im Root-Verzeichnis des Projekts ausführen!"
    exit 1
fi
# Schritt 1: Release vorbereiten
echo "=== Schritt 1: Release vorbereiten ==="
./scripts/prepare-release.sh
echo ""
echo "=== Schritt 2: GitHub Release ===="
echo ""
read -p "GitHub Release jetzt erstellen? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/create-github-release.sh
    echo ""
    echo "✅ Release-Prozess abgeschlossen!"
else
    echo ""
    echo "⏭️  Übersprungen. Später ausführen mit: ./scripts/create-github-release.sh"
fi
echo ""
echo "📝 Vergiss nicht:"
echo "   - CHANGELOG.md zu aktualisieren"
echo "   - README.md bei Bedarf zu aktualisieren"
echo "   - Chrome Web Store / Firefox Add-ons zu aktualisieren"
echo ""
