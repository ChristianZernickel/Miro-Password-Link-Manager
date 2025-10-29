# ✅ Privacy Policy - Schnellstart

## 🎯 Was du jetzt tun musst:

### Option A: Automatisch mit Skript (EMPFOHLEN)

```bash
./deploy-privacy-policy.sh
```

Das Skript:
- ✅ Fügt die Privacy Policy zu Git hinzu
- ✅ Erstellt einen Commit
- ✅ Pusht zu GitHub
- ✅ Zeigt dir die finale URL

---

### Option B: Manuell

```bash
# 1. Privacy Policy zu Git hinzufügen
git add PRIVACY_POLICY.md PRIVACY_POLICY.html docs/PRIVACY_PUBLISHING_GUIDE.md README.md

# 2. Commit erstellen
git commit -m "Add privacy policy for Chrome Web Store"

# 3. Zu GitHub pushen
git push origin main
```

---

## 🌐 GitHub Pages aktivieren

1. Gehe zu deinem GitHub Repository
2. **Settings** → **Pages** (linkes Menü)
3. Source: **Deploy from a branch**
4. Branch: **main** / Folder: **/ (root)**
5. **Save** klicken
6. Warte 2-3 Minuten

---

## 📋 URL für Chrome Web Store

Deine Privacy Policy wird verfügbar sein unter:

```
https://DEIN-GITHUB-USERNAME.github.io/miro-link-plugin/PRIVACY_POLICY.html
```

**Diese URL trägst du im Chrome Web Store Developer Dashboard ein!**

---

## 🧪 Testen

Nach 2-3 Minuten öffne die URL im Browser:
- ✅ Sollte eine schön formatierte HTML-Seite zeigen
- ✅ In Englisch und Deutsch
- ✅ Mit allen 14 Abschnitten der Datenschutzerklärung

---

## 📞 Hilfe benötigt?

Siehe die vollständige Anleitung:
- [PRIVACY_PUBLISHING_GUIDE.md](PRIVACY_PUBLISHING_GUIDE.md)

---

## 🎉 Fertig!

Sobald die URL funktioniert:
1. Gehe zum Chrome Web Store Developer Dashboard
2. Privacy practices → Privacy Policy URL
3. Füge die URL ein
4. Speichern & einreichen! 🚀

