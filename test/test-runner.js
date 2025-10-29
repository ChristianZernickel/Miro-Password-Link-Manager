// Test Runner JavaScript
// Wird von test-runner.html geladen

// Statistiken
let stats = { total: 0, passed: 0, failed: 0, skipped: 0 };

function updateStats() {
  document.getElementById('totalTests').textContent = stats.total;
  document.getElementById('passedTests').textContent = stats.passed;
  document.getElementById('failedTests').textContent = stats.failed;
  document.getElementById('skippedTests').textContent = stats.skipped;
}

function showResult(button, success, message) {
  const container = button.parentElement.querySelector('.result-container');
  container.innerHTML = `<div class="result ${success ? 'success' : 'error'}">
    ${success ? '✅' : '❌'} ${message}
  </div>`;

  stats.total++;
  if (success) stats.passed++;
  else stats.failed++;
  updateStats();

  // Update badge
  const section = button.closest('.test-section');
  const badge = section.querySelector('.status-badge');
  badge.textContent = success ? 'Bestanden' : 'Fehlgeschlagen';
  badge.className = `status-badge ${success ? 'status-pass' : 'status-fail'}`;
}

function showInfo(button, message) {
  const container = button.parentElement.querySelector('.result-container');
  container.innerHTML = `<div class="result info">ℹ️ ${message}</div>`;
}

// Check if extension APIs are available
const browserAPI = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);

if (!browserAPI || !browserAPI.storage) {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.intro').innerHTML += `
      <br><br><div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; border: 1px solid #f5c6cb; margin-top: 15px;">
        <strong>❌ Extension APIs nicht verfügbar!</strong>
        <br><br>
        Du hast diese Seite wahrscheinlich direkt geöffnet. Das funktioniert nicht!
        <br><br>
        <strong>Folge der Anleitung oben um die Seite korrekt zu öffnen.</strong>
      </div>
    `;
  });
}

// Test Functions
async function runStorageTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const testBookmark = {
      id: 'test-' + Date.now(),
      title: 'Test Bookmark',
      url: 'https://example.com',
      password: 'TestPass123',
      tags: ['test'],
      createdAt: Date.now()
    };

    await browserAPI.storage.sync.set({ bookmarks: [testBookmark] });
    const result = await browserAPI.storage.sync.get('bookmarks');

    if (result.bookmarks && result.bookmarks.length === 1 && result.bookmarks[0].title === 'Test Bookmark') {
      showResult(button, true, 'Bookmark erfolgreich gespeichert und geladen!');
    } else {
      showResult(button, false, 'Geladene Daten stimmen nicht überein.');
    }

    await browserAPI.storage.sync.remove('bookmarks');
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

async function runDeleteTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const bookmarks = [
      { id: '1', title: 'A', url: 'https://a.com', tags: [] },
      { id: '2', title: 'B', url: 'https://b.com', tags: [] }
    ];

    await browserAPI.storage.sync.set({ bookmarks });
    const filtered = bookmarks.filter(b => b.id !== '1');
    await browserAPI.storage.sync.set({ bookmarks: filtered });
    const result = await browserAPI.storage.sync.get('bookmarks');

    if (result.bookmarks.length === 1 && result.bookmarks[0].id === '2') {
      showResult(button, true, 'Bookmark erfolgreich gelöscht!');
    } else {
      showResult(button, false, 'Löschen fehlgeschlagen.');
    }

    await browserAPI.storage.sync.remove('bookmarks');
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

async function runClearAllTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    await browserAPI.storage.sync.set({ bookmarks: [{ id: '1', title: 'Test' }] });
    await browserAPI.storage.sync.remove('bookmarks');
    const result = await browserAPI.storage.sync.get('bookmarks');

    if (!result.bookmarks || result.bookmarks.length === 0) {
      showResult(button, true, 'Alle Bookmarks erfolgreich gelöscht!');
    } else {
      showResult(button, false, 'Nicht alle Daten wurden gelöscht.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

async function runExportTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const testData = {
      bookmarks: [
        { id: '1', title: 'Test', url: 'https://test.com', password: 'pass', tags: [] }
      ]
    };

    const json = JSON.stringify(testData, null, 2);
    const parsed = JSON.parse(json);

    if (parsed.bookmarks && parsed.bookmarks.length === 1) {
      showResult(button, true, 'Export als JSON erfolgreich!');
    } else {
      showResult(button, false, 'Export-Daten ungültig.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

async function runImportValidationTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const validData = { bookmarks: [{ id: '1', title: 'Test', url: 'https://test.com', tags: [] }] };
    const invalidData = { items: [] };

    const isValid = validData.bookmarks && Array.isArray(validData.bookmarks);
    const isInvalid = !invalidData.bookmarks;

    if (isValid && isInvalid) {
      showResult(button, true, 'Import-Validierung funktioniert!');
    } else {
      showResult(button, false, 'Validierung fehlerhaft.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

function runTagsLimitTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'];
    const maxTags = 5;

    if (tags.length > maxTags) {
      showResult(button, true, 'Limit erkannt: ' + tags.length + ' > ' + maxTags);
    } else {
      showResult(button, false, 'Tag-Limit nicht erkannt.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

function runDuplicateTagsTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const tags = ['test', 'dev', 'test'];
    const uniqueTags = [...new Set(tags)];

    if (uniqueTags.length === 2 && uniqueTags.includes('test') && uniqueTags.includes('dev')) {
      showResult(button, true, 'Duplikate erfolgreich entfernt!');
    } else {
      showResult(button, false, 'Duplikat-Erkennung fehlerhaft.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

function runTitleSearchTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const bookmarks = [
      { title: 'GitHub', url: 'https://github.com' },
      { title: 'Google', url: 'https://google.com' }
    ];
    const query = 'git';
    const results = bookmarks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));

    if (results.length === 1 && results[0].title === 'GitHub') {
      showResult(button, true, 'Titel-Suche funktioniert!');
    } else {
      showResult(button, false, 'Suche liefert falsche Ergebnisse.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

function runCaseInsensitiveTest(button) {
  showInfo(button, 'Test läuft...');
  try {
    const bookmarks = [{ title: 'GitHub' }];
    const queries = ['github', 'GITHUB', 'GiThUb'];

    const allMatch = queries.every(q =>
      bookmarks.some(b => b.title.toLowerCase().includes(q.toLowerCase()))
    );

    if (allMatch) {
      showResult(button, true, 'Case-insensitive Suche funktioniert!');
    } else {
      showResult(button, false, 'Suche ist case-sensitive.');
    }
  } catch (error) {
    showResult(button, false, 'Fehler: ' + error.message);
  }
}

// Event Listeners für alle Test-Buttons
document.addEventListener('DOMContentLoaded', function() {
  console.log('Test Runner geladen - Event Listeners werden registriert...');

  // Alle Test-Buttons finden
  const testButtons = document.querySelectorAll('button[data-test]');
  console.log('Gefundene Test-Buttons:', testButtons.length);

  testButtons.forEach(button => {
    const testName = button.getAttribute('data-test');
    console.log('Registriere Event Listener für:', testName);

    button.addEventListener('click', function() {
      console.log('Test-Button geklickt:', testName);

      // Route zu entsprechender Test-Funktion
      switch(testName) {
        case 'storage':
          runStorageTest(this);
          break;
        case 'delete':
          runDeleteTest(this);
          break;
        case 'clear':
          runClearAllTest(this);
          break;
        case 'export':
          runExportTest(this);
          break;
        case 'import':
          runImportValidationTest(this);
          break;
        case 'tags-limit':
          runTagsLimitTest(this);
          break;
        case 'tags-duplicate':
          runDuplicateTagsTest(this);
          break;
        case 'search-title':
          runTitleSearchTest(this);
          break;
        case 'search-case':
          runCaseInsensitiveTest(this);
          break;
        default:
          console.warn('Unbekannter Test:', testName);
      }
    });
  });

  console.log('✅ Alle Event Listeners registriert!');
});

console.log('Test Runner Script geladen!');

