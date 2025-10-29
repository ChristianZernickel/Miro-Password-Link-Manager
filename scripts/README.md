# Scripts Directory

Dieser Ordner enthält alle Build- und Release-Skripte für das Miro Link Plugin.

## 📜 Verfügbare Skripte

### 🚀 Release-Skripte

#### `release.sh` - Vollständiger Release-Prozess
Führt den kompletten Release-Prozess aus (prepare + create GitHub release).

```bash
./scripts/release.sh
```

**Was es tut:**
1. Ruft `prepare-release.sh` auf
2. Fragt ob GitHub Release erstellt werden soll
3. Ruft optional `create-github-release.sh` auf

---

#### `prepare-release.sh` - Release vorbereiten
Erstellt Release-Artefakte (ZIP-Dateien, Release Notes, etc.).

```bash
./scripts/prepare-release.sh
```

**Was es tut:**
1. Liest Version automatisch aus `manifest.json`
2. Prüft Git-Status (muss sauber sein)
3. Erstellt `releases/vX.Y.Z/` Ordner
4. Packt Chrome-Version (src/)
5. Packt Firefox-Version (firefox-version/src/)
6. Packt Source Code
7. Generiert Release Notes
8. Erstellt SHA256-Checksums
9. Erstellt Git-Tag `vX.Y.Z`

**Ausgabe:**
- `releases/vX.Y.Z/miro-link-plugin-chrome-vX.Y.Z.zip`
- `releases/vX.Y.Z/miro-link-plugin-firefox-vX.Y.Z.zip`
- `releases/vX.Y.Z/miro-link-plugin-source-vX.Y.Z.zip`
- `releases/vX.Y.Z/RELEASE_NOTES.md`
- `releases/vX.Y.Z/SHA256SUMS.txt`

---

#### `create-github-release.sh` - GitHub Release erstellen
Erstellt einen GitHub Release mit allen Artefakten.

```bash
./scripts/create-github-release.sh
```

**Voraussetzungen:**
- GitHub CLI (`gh`) installiert: `brew install gh`
- Authentifiziert: `gh auth login`
- `prepare-release.sh` muss bereits ausgeführt sein

**Was es tut:**
1. Liest Version aus `manifest.json`
2. Prüft ob alle Release-Dateien existieren
3. Pusht Git-Tag zu GitHub
4. Erstellt GitHub Release
5. Uploaded alle ZIP-Dateien und Checksums

---

## 🔧 Konfiguration

### Version ändern
Die Version wird automatisch aus `manifest.json` gelesen. Um eine neue Version zu erstellen:

1. Ändere `"version"` in `manifest.json`
2. Ändere `"version"` in `firefox-version/manifest.json`
3. Aktualisiere `CHANGELOG.md`
4. Führe `./scripts/release.sh` aus

### GitHub Repository
Die Repository-Informationen sind in `create-github-release.sh` konfiguriert:

```bash
REPO_OWNER="ChristianZernickel"
REPO_NAME="Miro-Password-Link-Manager"
```

## 📋 Workflow

### Standard Release-Workflow

```bash
# 1. Version in manifest.json(s) ändern
vim manifest.json
vim firefox-version/manifest.json

# 2. CHANGELOG.md aktualisieren
vim CHANGELOG.md

# 3. Änderungen committen
git add .
git commit -m "chore: bump version to X.Y.Z"

# 4. Release erstellen
./scripts/release.sh

# 5. Optional: Pushe Commits
git push origin main
```

### Nur Release vorbereiten (ohne GitHub)

```bash
./scripts/prepare-release.sh
# Prüfe die Dateien in releases/vX.Y.Z/
# Später: ./scripts/create-github-release.sh
```

### Nur GitHub Release (nach prepare)

```bash
./scripts/create-github-release.sh
```

## 🐛 Troubleshooting

### "Version konnte nicht gelesen werden"
- Prüfe ob `manifest.json` existiert
- Prüfe ob `"version": "X.Y.Z"` korrekt formatiert ist

### "Git ist nicht sauber"
- Committe oder stashe alle Änderungen
- `git status` zeigt uncommittete Dateien

### "Tag existiert bereits"
- Das Skript fragt ob der Tag überschrieben werden soll
- Oder manuell löschen: `git tag -d vX.Y.Z`

### "gh nicht installiert"
```bash
brew install gh
gh auth login
```

### "Release existiert bereits auf GitHub"
- Das Skript fragt ob es überschrieben werden soll
- Oder manuell löschen: `gh release delete vX.Y.Z`

## 📝 Best Practices

1. **Immer CHANGELOG.md aktualisieren** vor Release
2. **Beide manifest.json synchron halten** (Chrome + Firefox)
3. **Git Tag matcht Version** in manifest.json
4. **Release Notes prüfen** vor GitHub Upload
5. **Checksums verifizieren** nach Download

## 🔐 Sicherheit

- Skripte prüfen Git-Status vor Release
- Keine sensiblen Daten in Release Notes
- SHA256-Checksums für Integrität
- Git-Tags signieren (optional): `git tag -s vX.Y.Z`

## 📚 Weiterführende Links

- [GitHub CLI Dokumentation](https://cli.github.com/manual/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

