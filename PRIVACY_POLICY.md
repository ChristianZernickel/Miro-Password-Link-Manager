# Privacy Policy / Datenschutzerklärung

## Miro Link Plugin

**Last Updated / Letzte Aktualisierung:** October 28, 2025  
**Version:** 2.2.0

---

## English Version

### 1. Overview

Miro Link Plugin ("the Extension") is a browser extension that helps users manage bookmarks with passwords and tags. This Privacy Policy explains how the Extension handles user data.

### 2. Data Collection

**The Extension does NOT collect, transmit, or share any personal data with external servers or third parties.**

All data is stored locally on your device using Chrome's built-in storage API (`chrome.storage.sync` and `chrome.storage.local`).

### 3. Data Stored Locally

The Extension stores the following data **locally on your device only**:

- **Bookmarks**: URLs, titles, passwords, notes, and tags that you manually save
- **Settings**: Theme preferences (light/dark mode), sort order, and display options
- **Metadata**: Creation and modification timestamps for your bookmarks

### 4. How Data is Used

Your data is used exclusively for:

- Displaying your saved bookmarks in the Extension popup
- Copying passwords to clipboard when you click "Open" on a bookmark
- Organizing bookmarks with tags and search functionality
- Syncing your bookmarks across devices logged into the same Chrome/browser account (via `chrome.storage.sync`)

### 5. Chrome Storage Sync

The Extension uses Chrome's storage synchronization feature (`chrome.storage.sync`) to sync your bookmarks across devices where you're logged into the same Chrome account. This synchronization is handled entirely by Google Chrome and follows Google's privacy policies.

**Important:** All sync data remains within Google's Chrome infrastructure. The Extension developer has no access to your synced data.

### 6. Clipboard Access

When you click "Open" on a bookmark, the Extension copies the associated password to your clipboard using the `clipboardWrite` permission. This happens **only when you explicitly click the button** and the data remains local to your device.

### 7. Permissions Used

The Extension requests the following permissions:

- **storage**: Store bookmarks and settings locally
- **activeTab**: Read current page URL and title when adding bookmarks
- **clipboardWrite**: Copy passwords to clipboard
- **contextMenus**: Add right-click context menu option
- **notifications**: Display success/error messages
- **scripting**: Enable context menu input prompts

**None of these permissions are used to collect, transmit, or share your data externally.**

### 8. Third-Party Services

The Extension does **NOT**:

- Connect to any external servers
- Send data to analytics services
- Use tracking cookies or beacons
- Communicate with third-party APIs
- Load remote code or scripts

### 9. Data Security

- All passwords and bookmarks are stored using Chrome's secure storage API
- No data is transmitted over the internet by the Extension
- Data security depends on your Chrome account security and device security

### 10. Data Deletion

You can delete your data at any time:

- **Individual bookmarks**: Click the delete button on any bookmark
- **All data**: Uninstall the Extension, which removes all stored data
- **Manual deletion**: Use Chrome's "Clear browsing data" feature and select "Hosted app data"

### 11. Children's Privacy

The Extension does not knowingly collect data from children under 13 years of age. The Extension is suitable for all ages as it does not collect any personal information.

### 12. Changes to Privacy Policy

Any changes to this Privacy Policy will be reflected in the Extension's documentation and in the Chrome Web Store listing. Continued use of the Extension after changes constitutes acceptance of the updated policy.

### 13. Contact

For privacy concerns or questions:
- GitHub Issues: [Report an issue on GitHub]
- Email: [Your contact email if desired]

### 14. Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

**Your Rights:**
- Access your data: All data is accessible within the Extension
- Delete your data: Uninstall the Extension or delete individual bookmarks
- Data portability: Export your bookmarks as JSON using the built-in export feature

---

## Deutsche Version

### 1. Überblick

Miro Link Plugin ("die Erweiterung") ist eine Browser-Erweiterung, die Benutzern hilft, Lesezeichen mit Passwörtern und Tags zu verwalten. Diese Datenschutzerklärung erklärt, wie die Erweiterung mit Benutzerdaten umgeht.

### 2. Datenerfassung

**Die Erweiterung erfasst, überträgt oder teilt KEINE personenbezogenen Daten mit externen Servern oder Dritten.**

Alle Daten werden lokal auf Ihrem Gerät mit der integrierten Chrome-Speicher-API (`chrome.storage.sync` und `chrome.storage.local`) gespeichert.

### 3. Lokal gespeicherte Daten

Die Erweiterung speichert folgende Daten **ausschließlich lokal auf Ihrem Gerät**:

- **Lesezeichen**: URLs, Titel, Passwörter, Notizen und Tags, die Sie manuell speichern
- **Einstellungen**: Theme-Präferenzen (Hell-/Dunkelmodus), Sortierreihenfolge und Anzeigeoptionen
- **Metadaten**: Erstellungs- und Änderungszeitstempel Ihrer Lesezeichen

### 4. Datenverwendung

Ihre Daten werden ausschließlich verwendet für:

- Anzeige Ihrer gespeicherten Lesezeichen im Erweiterungs-Popup
- Kopieren von Passwörtern in die Zwischenablage, wenn Sie bei einem Lesezeichen auf "Öffnen" klicken
- Organisation von Lesezeichen mit Tags und Suchfunktionalität
- Synchronisation Ihrer Lesezeichen über Geräte hinweg, die mit demselben Chrome/Browser-Konto angemeldet sind (über `chrome.storage.sync`)

### 5. Chrome Storage Sync

Die Erweiterung verwendet die Speichersynchronisationsfunktion von Chrome (`chrome.storage.sync`), um Ihre Lesezeichen über Geräte zu synchronisieren, auf denen Sie mit demselben Chrome-Konto angemeldet sind. Diese Synchronisation wird vollständig von Google Chrome verwaltet und folgt den Datenschutzrichtlinien von Google.

**Wichtig:** Alle Sync-Daten verbleiben in Googles Chrome-Infrastruktur. Der Entwickler der Erweiterung hat keinen Zugriff auf Ihre synchronisierten Daten.

### 6. Zwischenablage-Zugriff

Wenn Sie bei einem Lesezeichen auf "Öffnen" klicken, kopiert die Erweiterung das zugehörige Passwort mit der `clipboardWrite`-Berechtigung in Ihre Zwischenablage. Dies geschieht **nur, wenn Sie explizit auf die Schaltfläche klicken**, und die Daten bleiben lokal auf Ihrem Gerät.

### 7. Verwendete Berechtigungen

Die Erweiterung fordert folgende Berechtigungen an:

- **storage**: Lokale Speicherung von Lesezeichen und Einstellungen
- **activeTab**: Lesen der aktuellen Seiten-URL und des Titels beim Hinzufügen von Lesezeichen
- **clipboardWrite**: Kopieren von Passwörtern in die Zwischenablage
- **contextMenus**: Hinzufügen einer Rechtsklick-Kontextmenü-Option
- **notifications**: Anzeige von Erfolgs-/Fehlermeldungen
- **scripting**: Aktivierung von Kontextmenü-Eingabeaufforderungen

**Keine dieser Berechtigungen wird verwendet, um Ihre Daten extern zu erfassen, zu übertragen oder zu teilen.**

### 8. Drittanbieter-Dienste

Die Erweiterung verwendet **KEINE**:

- Verbindungen zu externen Servern
- Datenübertragung an Analyse-Dienste
- Tracking-Cookies oder Beacons
- Kommunikation mit Drittanbieter-APIs
- Laden von Remote-Code oder -Skripten

### 9. Datensicherheit

- Alle Passwörter und Lesezeichen werden mit Chromes sicherer Speicher-API gespeichert
- Keine Daten werden von der Erweiterung über das Internet übertragen
- Die Datensicherheit hängt von Ihrer Chrome-Konto-Sicherheit und Gerätesicherheit ab

### 10. Datenlöschung

Sie können Ihre Daten jederzeit löschen:

- **Einzelne Lesezeichen**: Klicken Sie auf die Löschen-Schaltfläche bei jedem Lesezeichen
- **Alle Daten**: Deinstallieren Sie die Erweiterung, wodurch alle gespeicherten Daten entfernt werden
- **Manuelle Löschung**: Verwenden Sie Chromes Funktion "Browserdaten löschen" und wählen Sie "Daten gehosteter Apps"

### 11. Datenschutz für Kinder

Die Erweiterung erfasst wissentlich keine Daten von Kindern unter 13 Jahren. Die Erweiterung ist für alle Altersgruppen geeignet, da sie keine personenbezogenen Informationen erfasst.

### 12. Änderungen der Datenschutzerklärung

Änderungen dieser Datenschutzerklärung werden in der Dokumentation der Erweiterung und im Chrome Web Store-Eintrag angezeigt. Die fortgesetzte Nutzung der Erweiterung nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.

### 13. Kontakt

Für Datenschutzanliegen oder Fragen:
- GitHub Issues: [Problem auf GitHub melden]
- E-Mail: [Ihre Kontakt-E-Mail falls gewünscht]

### 14. Compliance

Diese Erweiterung erfüllt:
- Chrome Web Store Entwickler-Programmrichtlinien
- Datenschutz-Grundverordnung (DSGVO)
- California Consumer Privacy Act (CCPA)

**Ihre Rechte:**
- Zugriff auf Ihre Daten: Alle Daten sind innerhalb der Erweiterung zugänglich
- Löschung Ihrer Daten: Deinstallieren Sie die Erweiterung oder löschen Sie einzelne Lesezeichen
- Datenübertragbarkeit: Exportieren Sie Ihre Lesezeichen als JSON mit der integrierten Exportfunktion

---

## Summary / Zusammenfassung

**English:** This Extension stores all data locally on your device and does not collect, transmit, or share any personal information with external parties. Your privacy is fully protected.

**Deutsch:** Diese Erweiterung speichert alle Daten lokal auf Ihrem Gerät und erfasst, überträgt oder teilt keine personenbezogenen Informationen mit externen Parteien. Ihre Privatsphäre ist vollständig geschützt.

---

**Privacy Policy URL for Chrome Web Store:**
Once published, this policy will be available at:
- GitHub Pages: `https://[your-username].github.io/miro-link-plugin/PRIVACY_POLICY.html`
- Or: Raw GitHub URL (see publishing instructions below)

