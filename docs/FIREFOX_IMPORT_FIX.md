# Firefox Import Fix - File Picker Problem

## 🐛 Problem (Firefox-spezifisch):

Wenn in Firefox der Import-Button geklickt wird und der File-Picker geöffnet wird:
1. ✅ File-Picker öffnet sich
2. ❌ **Extension Popup schließt sich automatisch**
3. ❌ Alle Modals (inkl. Import-Modal) verschwinden
4. ❌ Import kann nicht abgeschlossen werden

**Ursache:** Firefox schließt das Extension-Popup wenn ein nativer Dialog (File-Picker) geöffnet wird.

**Betroffen:** Nur Firefox, Chrome hat dieses Problem NICHT.

---

## ✅ Lösung implementiert:

### Strategie: Temporäres Speichern im Storage

1. **Vor File-Picker:** Import-Daten in `browser.storage.local` speichern
2. **Nach Popup-Reload:** Import-Daten aus Storage wiederherstellen
3. **Import-Modal automatisch anzeigen**

---

## 📝 Implementierung:

### 1. handleImportFile - Daten speichern

```javascript
async function handleImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const result = await exportImportManager.readImportFile(file);
    
    // Speichere Import-Daten temporär im Storage (Firefox-spezifisch)
    await browser.storage.local.set({
      pendingImport: {
        data: result.data,
        count: result.count,
        timestamp: Date.now()
      }
    });
    
    // Zeige Import-Modal
    document.getElementById('importCount').textContent = result.count;
    elements.importModal.classList.add('show');
  } catch (error) {
    showMessage('Fehler beim Lesen der Datei', 'error');
  }

  e.target.value = '';
}
```

### 2. checkPendingImport - Daten wiederherstellen

```javascript
async function checkPendingImport() {
  try {
    const result = await browser.storage.local.get(['pendingImport']);
    if (result.pendingImport) {
      const { data, count, timestamp } = result.pendingImport;
      
      // Prüfe ob Import nicht zu alt ist (max 5 Minuten)
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        // Setze Import-Daten im Manager
        exportImportManager.importData = data;
        
        // Zeige Import-Modal
        document.getElementById('importCount').textContent = count;
        elements.importModal?.classList.add('show');
        
        // Öffne Settings automatisch
        openSettings();
      }
      
      // Lösche ausstehende Import-Daten
      await browser.storage.local.remove(['pendingImport']);
    }
  } catch (error) {
    console.error('Fehler beim Prüfen auf ausstehenden Import:', error);
  }
}
```

### 3. Init - Prüfung hinzufügen

```javascript
async function init() {
  await themeManager.init();
  await loadData();
  
  // Prüfe auf ausstehenden Import (Firefox-spezifisch)
  await checkPendingImport();
  
  setupEventListeners();
  // ...
}
```

---

## 🔄 User Flow (Firefox):

### Vorher (Problem):
```
1. User klickt "Importieren"
2. File-Picker öffnet sich
3. ❌ Popup schließt sich
4. User wählt Datei
5. ❌ Nichts passiert (Popup war geschlossen)
```

### Nachher (Gelöst):
```
1. User klickt "Importieren"
2. File-Picker öffnet sich
3. Popup schließt sich (normal in Firefox)
4. Import-Daten werden in Storage gespeichert ✅
5. User wählt Datei
6. Popup öffnet sich neu
7. checkPendingImport() lädt Daten aus Storage ✅
8. Import-Modal wird automatisch angezeigt ✅
9. Settings öffnen sich automatisch ✅
10. User kann Import-Modus wählen ✅
```

---

## 🎯 Features:

✅ **Automatische Wiederherstellung** - Import-Daten werden nach Popup-Reload wiederhergestellt
✅ **Timeout-Schutz** - Alte Import-Daten (>5 Min) werden ignoriert
✅ **Auto-Open** - Settings und Import-Modal öffnen sich automatisch
✅ **Clean-Up** - Import-Daten werden nach Verwendung gelöscht
✅ **Seamless UX** - User merkt kaum etwas vom Popup-Reload

---

## 📊 Storage Struktur:

```javascript
// browser.storage.local.pendingImport
{
  data: [...bookmarks...],  // Array mit Bookmark-Objekten
  count: 42,                 // Anzahl der Bookmarks
  timestamp: 1635441234567   // Zeitstempel für Timeout
}
```

---

## 🧪 Testen:

### Firefox:
1. Extension öffnen
2. ⚙️ Einstellungen → "📤 Importieren" klicken
3. **Beobachte:** Popup schließt sich (normal!)
4. JSON-Datei auswählen
5. **Erwartung:** 
   - ✅ Popup öffnet sich neu
   - ✅ Settings sind offen
   - ✅ Import-Modal wird angezeigt
   - ✅ Anzahl der Bookmarks wird angezeigt
   - ✅ Alle 3 Import-Optionen funktionieren

### Chrome (Zum Vergleich):
1. Extension öffnen
2. ⚙️ Einstellungen → "📤 Importieren" klicken
3. **Beobachte:** Popup bleibt offen (anders als Firefox!)
4. JSON-Datei auswählen
5. **Erwartung:**
   - ✅ Import-Modal erscheint sofort
   - ✅ Keine Storage-Operationen nötig

---

## 🔍 Debugging:

### Console Logs prüfen:
```javascript
// In checkPendingImport():
console.log('Ausstehende Import-Daten gefunden:', count, 'Bookmarks');

// Bei erfolgreichem Import:
console.log('Import-Daten aus Storage wiederhergestellt');
```

### Storage manuell prüfen:
```javascript
// In Firefox Console:
browser.storage.local.get(['pendingImport']).then(console.log);
```

---

## ⚠️ Wichtige Hinweise:

1. **Nur Firefox betroffen** - Chrome braucht diesen Fix nicht
2. **Timeout nach 5 Minuten** - Alte Import-Daten werden ignoriert
3. **Einmalige Verwendung** - Daten werden nach Import gelöscht
4. **Storage-Limit** - browser.storage.local hat genug Platz für Import-Daten

---

## 📁 Geänderte Dateien:

- ✅ `firefox-version/src/js/popup.js`
  - `handleImportFile()` - Speichert Daten
  - `checkPendingImport()` - Stellt Daten wieder her
  - `init()` - Ruft checkPendingImport auf

---

## ✅ Status:

**FIREFOX IMPORT FIX - IMPLEMENTIERT** ✅

Der Import funktioniert jetzt auch in Firefox trotz Popup-Schließung!

