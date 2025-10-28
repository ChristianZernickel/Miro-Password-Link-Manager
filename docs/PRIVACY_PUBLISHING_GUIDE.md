# 📄 Datenschutzerklärung Publishing Guide

## ✅ Was wurde erstellt?

1. **PRIVACY_POLICY.md** - Markdown-Version für GitHub
2. **PRIVACY_POLICY.html** - Schöne HTML-Version für das Web

---

## 🚀 Publishing-Optionen

### **Option 1: GitHub Pages (EMPFOHLEN)** ⭐

Die einfachste und professionellste Lösung:

#### Schritt 1: Repository auf GitHub hochladen

```bash
# Wenn du noch kein Git-Repository hast:
cd /Users/czern/IdeaProjects/miro-link-plugin
git init
git add .
git commit -m "Add privacy policy"

# Repository auf GitHub erstellen und pushen
git remote add origin https://github.com/DEIN-USERNAME/miro-link-plugin.git
git branch -M main
git push -u origin main
```

#### Schritt 2: GitHub Pages aktivieren

1. Gehe zu deinem GitHub Repository
2. Klicke auf **Settings** (Zahnrad-Symbol)
3. Scrolle zu **Pages** (linkes Menü)
4. Bei **Source** wähle: **Deploy from a branch**
5. Branch: **main** / Folder: **/ (root)**
6. Klicke auf **Save**

#### Schritt 3: URL kopieren

Nach 1-2 Minuten ist deine Privacy Policy verfügbar unter:

```
https://DEIN-USERNAME.github.io/miro-link-plugin/PRIVACY_POLICY.html
```

**Diese URL verwendest du im Chrome Web Store!** 🎯

---

### **Option 2: GitHub Raw URL** 📦

Schnelle Alternative ohne GitHub Pages:

1. Pushe die Datei zu GitHub (siehe oben)
2. Öffne `PRIVACY_POLICY.md` auf GitHub
3. Klicke auf **Raw** Button
4. Kopiere die URL:

```
https://raw.githubusercontent.com/DEIN-USERNAME/miro-link-plugin/main/PRIVACY_POLICY.md
```

**Hinweis:** Diese URL zeigt den rohen Markdown-Text ohne Formatierung.

---

### **Option 3: Eigene Website** 🌐

Falls du eine eigene Domain hast:

1. Lade `PRIVACY_POLICY.html` auf deinen Webserver hoch
2. Verwende eine URL wie: `https://deine-domain.com/privacy-policy.html`

---

### **Option 4: Gist (GitHub)** 📝

Für eine einfache Lösung ohne Repository:

1. Gehe zu [gist.github.com](https://gist.github.com)
2. Erstelle ein neues Gist
3. Filename: `PRIVACY_POLICY.md`
4. Kopiere den Inhalt aus `PRIVACY_POLICY.md`
5. Erstelle als **Public** Gist
6. Klicke auf **Raw** und kopiere die URL

---

## 🎯 Chrome Web Store Einreichung

### Wo die URL eingeben?

1. Gehe zum [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Wähle deine Extension
3. Gehe zum Tab **"Privacy practices"** oder **"Store listing"**
4. Suche das Feld **"Privacy Policy URL"**
5. Füge deine URL ein (z.B. GitHub Pages URL)

### Beispiel-URLs:

```
✅ https://username.github.io/miro-link-plugin/PRIVACY_POLICY.html
✅ https://raw.githubusercontent.com/username/miro-link-plugin/main/PRIVACY_POLICY.md
✅ https://gist.githubusercontent.com/username/abc123/raw/PRIVACY_POLICY.md
✅ https://deine-website.com/privacy-policy.html
```

---

## 📋 Schnell-Checkliste

- [ ] `PRIVACY_POLICY.md` und `PRIVACY_POLICY.html` erstellt ✅
- [ ] Repository auf GitHub hochgeladen
- [ ] GitHub Pages aktiviert ODER Alternative gewählt
- [ ] Privacy Policy URL kopiert
- [ ] URL im Chrome Web Store Developer Dashboard eingefügt
- [ ] In manifest.json optional hinzufügen (siehe unten)

---

## 🔧 Optional: In manifest.json verlinken

Du kannst die Privacy Policy auch in deiner `manifest.json` verlinken:

```json
{
  "manifest_version": 3,
  "name": "Miro Link Plugin",
  "version": "2.2.0",
  "description": "Speichere Links mit Passwörtern/Hinweisen...",
  "homepage_url": "https://github.com/DEIN-USERNAME/miro-link-plugin",
  ...
}
```

---

## 🧪 URL Testen

Bevor du die URL einreichst, teste sie:

```bash
# Mit curl:
curl -I https://deine-url.com/PRIVACY_POLICY.html

# Sollte zeigen:
# HTTP/2 200 OK
# content-type: text/html
```

Oder öffne die URL einfach in einem Browser! 🌐

---

## 📞 Häufige Probleme

### Problem: "404 Not Found" bei GitHub Pages

**Lösung:**
- Warte 5-10 Minuten nach Aktivierung
- Prüfe, ob der Branch "main" heißt (nicht "master")
- Stelle sicher, dass `PRIVACY_POLICY.html` im Root liegt

### Problem: "URL is not accessible"

**Lösung:**
- URL muss **öffentlich** zugänglich sein
- Prüfe mit Inkognito-Modus
- Keine Authentifizierung erforderlich

### Problem: GitHub Raw zeigt falschen Content-Type

**Lösung:**
- Verwende GitHub Pages statt Raw URL
- Oder verwende einen Service wie [rawgit.com](https://rawgit.com) (deprecated)
- Oder hoste selbst

---

## 🎨 Anpassungen

### Kontakt-Info hinzufügen

In beiden Dateien, ändere Abschnitt 13:

```markdown
### 13. Contact

For privacy concerns or questions:
- GitHub Issues: https://github.com/DEIN-USERNAME/miro-link-plugin/issues
- Email: deine-email@example.com
```

### Datum aktualisieren

Bei zukünftigen Änderungen das Datum aktualisieren:

```markdown
**Last Updated:** [Neues Datum]
```

---

## ✨ Fertig!

Deine Datenschutzerklärung ist jetzt bereit zur Veröffentlichung! 🎉

**Empfohlene Reihenfolge:**

1. ✅ Repository zu GitHub pushen
2. ✅ GitHub Pages aktivieren
3. ✅ URL im Chrome Web Store eintragen
4. ✅ Extension einreichen

---

## 📚 Zusätzliche Ressourcen

- [Chrome Web Store Developer Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [GitHub Pages Dokumentation](https://docs.github.com/en/pages)
- [DSGVO Compliance Guide](https://gdpr.eu/)

---

**Viel Erfolg bei der Einreichung!** 🚀

