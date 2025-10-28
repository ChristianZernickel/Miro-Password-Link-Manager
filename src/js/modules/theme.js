// Theme Modul

export class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.mediaQuery = null;
  }

  // Theme laden und anwenden
  async init() {
    try {
      const result = await chrome.storage.local.get(['theme']);
      this.currentTheme = result.theme || 'light';

      if (!result.theme) {
        // Verwende globalThis statt window (moderne Best Practice)
        const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = prefersDark ? 'dark' : 'light';
      }

      this.apply();
      this.setupSystemThemeListener();
      return this.currentTheme;
    } catch (error) {
      console.error('Fehler beim Laden des Themes:', error);
      return 'light';
    }
  }

  // System Theme Änderungen beobachten (moderne Methode)
  setupSystemThemeListener() {
    // Verwende addEventListener statt deprecated addListener
    this.mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

    // Moderne addEventListener API (nicht deprecated)
    this.mediaQuery.addEventListener('change', (e) => {
      // Nur reagieren, wenn kein manuelles Theme gesetzt wurde
      chrome.storage.local.get(['theme'], (result) => {
        if (!result.theme) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.apply();
        }
      });
    });
  }

  // Theme anwenden
  apply() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Icon aktualisieren
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
      }
    }
  }

  // Theme umschalten
  async toggle() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

    try {
      await chrome.storage.local.set({ theme: this.currentTheme });
      this.apply();

      // Animation
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          themeToggle.style.transform = '';
        }, 300);
      }

      return this.currentTheme;
    } catch (error) {
      console.error('Fehler beim Speichern des Themes:', error);
      throw error;
    }
  }

  // Aktuelles Theme abrufen
  getCurrent() {
    return this.currentTheme;
  }
}

