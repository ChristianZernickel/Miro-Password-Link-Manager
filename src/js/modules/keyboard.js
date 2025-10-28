// Keyboard Shortcuts Modul

export class KeyboardManager {
  constructor(callbacks) {
    this.callbacks = callbacks;
    this.selectedBookmarkIndex = -1;
    this.isMac = this.detectMac();
  }

  // Moderne Mac-Detection (navigator.platform ist deprecated)
  detectMac() {
    // Moderne Methode mit userAgentData (wenn verfügbar)
    if (navigator.userAgentData) {
      return navigator.userAgentData.platform === 'macOS';
    }

    // Fallback: userAgent statt deprecated platform
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  // Event Handler initialisieren
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  // Keyboard Event Handler
  handleKeyboard(e) {
    const activeElement = document.activeElement;
    const isInputActive = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA'
    );

    const ctrlOrCmd = this.isMac ? e.metaKey : e.ctrlKey;

    // Escape - Schließt Modals, löscht Suche
    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.callbacks.onEscape) {
        this.callbacks.onEscape();
      }
      return;
    }

    // Shortcuts die nicht in Inputs funktionieren
    if (isInputActive) return;

    // Ctrl/Cmd + N: Neuer Link
    if (ctrlOrCmd && e.key === 'n') {
      e.preventDefault();
      if (this.callbacks.onNewLink) this.callbacks.onNewLink();
      return;
    }

    // Ctrl/Cmd + F: Suche fokussieren
    if (ctrlOrCmd && e.key === 'f') {
      e.preventDefault();
      if (this.callbacks.onFocusSearch) this.callbacks.onFocusSearch();
      return;
    }

    // Ctrl/Cmd + E: Export
    if (ctrlOrCmd && e.key === 'e') {
      e.preventDefault();
      if (this.callbacks.onExport) this.callbacks.onExport();
      return;
    }

    // Ctrl/Cmd + ,: Settings
    if (ctrlOrCmd && e.key === ',') {
      e.preventDefault();
      if (this.callbacks.onToggleSettings) this.callbacks.onToggleSettings();
      return;
    }

    // ?: Hilfe
    if (e.key === '?' && !e.shiftKey && !ctrlOrCmd) {
      e.preventDefault();
      this.showHelp();
      return;
    }

    // Navigation (nur wenn kein Modal offen)
    if (this.callbacks.isNavigationAllowed && this.callbacks.isNavigationAllowed()) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateDown();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateUp();
        return;
      }

      if (e.key === 'Enter' && this.selectedBookmarkIndex >= 0) {
        e.preventDefault();
        if (this.callbacks.onOpenSelected) {
          this.callbacks.onOpenSelected(this.selectedBookmarkIndex);
        }
        return;
      }
    }
  }

  // Navigation nach unten
  navigateDown() {
    const bookmarkItems = document.querySelectorAll('.bookmark-item');
    if (bookmarkItems.length === 0) return;

    if (this.selectedBookmarkIndex >= 0 && this.selectedBookmarkIndex < bookmarkItems.length) {
      bookmarkItems[this.selectedBookmarkIndex].classList.remove('keyboard-selected');
    }

    this.selectedBookmarkIndex = Math.min(this.selectedBookmarkIndex + 1, bookmarkItems.length - 1);

    const selectedItem = bookmarkItems[this.selectedBookmarkIndex];
    selectedItem.classList.add('keyboard-selected');
    selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Navigation nach oben
  navigateUp() {
    const bookmarkItems = document.querySelectorAll('.bookmark-item');
    if (bookmarkItems.length === 0) return;

    if (this.selectedBookmarkIndex >= 0 && this.selectedBookmarkIndex < bookmarkItems.length) {
      bookmarkItems[this.selectedBookmarkIndex].classList.remove('keyboard-selected');
    }

    this.selectedBookmarkIndex = Math.max(this.selectedBookmarkIndex - 1, 0);

    const selectedItem = bookmarkItems[this.selectedBookmarkIndex];
    selectedItem.classList.add('keyboard-selected');
    selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Navigation zurücksetzen
  resetNavigation() {
    this.selectedBookmarkIndex = -1;
    document.querySelectorAll('.bookmark-item.keyboard-selected').forEach(item => {
      item.classList.remove('keyboard-selected');
    });
  }

  // Hilfe anzeigen
  showHelp() {
    const ctrlKey = this.isMac ? '⌘' : 'Ctrl';

    const helpText = `🎹 KEYBOARD SHORTCUTS

📝 Allgemein:
${ctrlKey}+N         Neuer Link speichern
${ctrlKey}+F         Suche fokussieren
${ctrlKey}+E         Bookmarks exportieren
${ctrlKey}+,         Einstellungen öffnen
Esc              Schließen / Zurücksetzen

🔍 Navigation:
↑ / ↓            Durch Bookmarks navigieren
Enter            Ausgewähltes Bookmark öffnen

❓ Hilfe:
?                Diese Hilfe anzeigen`;

    alert(helpText);
  }
}

