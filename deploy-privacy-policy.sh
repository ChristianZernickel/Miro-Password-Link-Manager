#!/bin/bash

# 🚀 Privacy Policy Deployment Script
# Dieses Skript hilft dir, die Datenschutzerklärung zu GitHub zu pushen

echo "🔒 Miro Link Plugin - Privacy Policy Deployment"
echo "================================================"
echo ""

# Schritt 1: Privacy Policy Dateien zu Git hinzufügen
echo "📝 Füge Privacy Policy Dateien hinzu..."
git add PRIVACY_POLICY.md PRIVACY_POLICY.html docs/PRIVACY_PUBLISHING_GUIDE.md

# Schritt 2: Commit erstellen
echo "💾 Erstelle Commit..."
git commit -m "Add privacy policy for Chrome Web Store submission"

# Schritt 3: Zu GitHub pushen
echo "⬆️  Pushe zu GitHub..."
git push origin main

echo ""
echo "✅ Fertig!"
echo ""
echo "🌐 Deine Privacy Policy wird in wenigen Minuten verfügbar sein unter:"
echo ""

# GitHub Username aus der Remote URL extrahieren
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
if [[ $REMOTE_URL =~ github\.com[:/]([^/]+)/([^/\.]+) ]]; then
    USERNAME="${BASH_REMATCH[1]}"
    REPO="${BASH_REMATCH[2]}"
    echo "   https://${USERNAME}.github.io/${REPO}/PRIVACY_POLICY.html"
else
    echo "   https://DEIN-USERNAME.github.io/miro-link-plugin/PRIVACY_POLICY.html"
    echo ""
    echo "⚠️  Hinweis: Ersetze DEIN-USERNAME mit deinem GitHub Username"
fi

echo ""
echo "📋 Nächste Schritte:"
echo ""
echo "1. Gehe zu: https://github.com/${USERNAME:-DEIN-USERNAME}/${REPO:-miro-link-plugin}/settings/pages"
echo "2. Aktiviere GitHub Pages (Branch: main, Folder: / root)"
echo "3. Warte 2-3 Minuten"
echo "4. Öffne die URL oben im Browser zum Testen"
echo "5. Kopiere die URL in den Chrome Web Store"
echo ""
echo "🎉 Viel Erfolg!"

