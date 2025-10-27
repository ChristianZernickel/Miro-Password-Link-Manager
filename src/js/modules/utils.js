// Utils Modul - Hilfsfunktionen

// Eindeutige ID generieren
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Datum formatieren
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) {
    return 'Gerade eben';
  }

  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Vor ${minutes} Minute${minutes !== 1 ? 'n' : ''}`;
  }

  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  }

  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Vor ${days} Tag${days !== 1 ? 'en' : ''}`;
  }

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// HTML escapen (XSS-Schutz)
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Favicon-URL generieren
export function getFallbackFavicon(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch {
    return null;
  }
}

// Favicon HTML rendern
export function renderFavicon(bookmark) {
  const favicon = bookmark.favicon || getFallbackFavicon(bookmark.url);

  if (!favicon) {
    const initial = bookmark.title.charAt(0).toUpperCase();
    return `<div class="favicon-placeholder">${escapeHtml(initial)}</div>`;
  }

  return `<img src="${favicon}" class="bookmark-favicon" alt="Icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="favicon-placeholder" style="display:none;">${escapeHtml(bookmark.title.charAt(0).toUpperCase())}</div>`;
}

// Tags HTML rendern
export function renderTags(tags) {
  if (!tags || tags.length === 0) {
    return '';
  }

  return `
    <div class="bookmark-tags">
      ${tags.map(tag => `<span class="tag-badge">${escapeHtml(tag)}</span>`).join('')}
    </div>
  `;
}

// Message anzeigen
export function showMessage(text, type = 'success') {
  const messageDiv = document.getElementById('message');
  if (!messageDiv) return;

  messageDiv.textContent = text;
  messageDiv.className = `message show ${type}`;

  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 3000);
}

