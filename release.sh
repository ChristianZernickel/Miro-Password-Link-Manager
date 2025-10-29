#!/bin/bash
# Quick Release Script
set -e
echo "🚀 Miro Link Plugin - Vollständiger Release"
echo "==========================================="
echo ""
# Schritt 1: Release vorbereiten
echo "=== Schritt 1: Release vorbereiten ==="
./prepare-release.sh
echo ""
echo "=== Schritt 2: GitHub Release ===="
echo ""
read -p "GitHub Release jetzt erstellen? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./create-github-release.sh
    echo ""
    echo "✅ Release-Prozess abgeschlossen!"
else
    echo ""
    echo "Übersprungen. Später: ./create-github-release.sh"
fi
echo ""
