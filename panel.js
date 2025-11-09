// Fichier principal du panneau DevTools
// Ce fichier orchestre tous les modules

// Connexion au service worker pour communiquer avec la page
const port = chrome.runtime.connect({
  name: 'devtools-panel'
});

// Éléments DOM
const categoriesDiv = document.getElementById('categories');
const statsDiv = document.getElementById('stats');
const resetBtn = document.getElementById('resetBtn');

// Lancer l'analyse automatiquement au chargement
function initTests() {
  // Afficher les catégories et statistiques
  categoriesDiv.style.display = 'block';
  statsDiv.style.display = 'flex';
  
  // Réinitialiser les résultats
  resetResults();
  
  // Lancer l'analyse
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      return {
        url: window.location.href,
        title: document.title,
        ready: true
      };
    })()
  `, (result, isException) => {
    if (isException) {
      showError(t('errorPageAnalysis') + ': ' + isException);
    } else {
      console.log('Page analysée:', result);
      // Lancer les tests
      simulateTests();
    }
  });
}

// Réinitialiser tous les tests (remise à zéro complète)
function resetAllTests() {
  // Nettoyer toutes les visualisations
  cleanupAllVisualizations();
  
  // Réinitialiser les catégories
  Object.keys(categories).forEach(categoryId => {
    categories[categoryId].tests = [];
  });
  
  // Réinitialiser tous les boutons radio à "Non testé"
  document.querySelectorAll('input[type="radio"][value="not-tested"]').forEach(radio => {
    radio.checked = true;
  });
  
  // Réinitialiser les classes CSS des tests (enlever passed, failed, warning)
  document.querySelectorAll('.test-item').forEach(item => {
    item.classList.remove('passed', 'failed', 'warning');
    item.className = 'test-item';
  });
  
  // Réinitialiser les boutons toggle (clavier, titres, landmarks)
  if (typeof window.headingsVisualizationActive !== 'undefined') {
    window.headingsVisualizationActive = false;
  }
  if (typeof window.landmarksVisualizationActive !== 'undefined') {
    window.landmarksVisualizationActive = false;
  }
  
  document.querySelectorAll('.button-toggle-headings, .button-toggle-landmarks').forEach(btn => {
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      const icon = btn.querySelector('.button-toggle-icon');
      if (icon) icon.textContent = '👁️';
    }
  });
  
  document.querySelectorAll('.button-small').forEach(btn => {
    if (btn.textContent.includes('Activer') || btn.textContent.includes('Deactivate')) {
      btn.textContent = t('testKeyboardNavigationToggle');
    } else if (btn.textContent.includes('Désactiver') || btn.textContent.includes('Activate')) {
      btn.textContent = t('testKeyboardNavigationToggle');
    }
  });
  
  // Relancer les tests pour réafficher l'interface
  resetResults();
  
  // Relancer l'analyse pour réafficher les tests
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      return {
        url: window.location.href,
        title: document.title,
        ready: true
      };
    })()
  `, (result, isException) => {
    if (isException) {
      showError(t('errorReset') + ': ' + isException);
    } else {
      simulateTests();
    }
  });
}

// Simuler des tests (à remplacer par de vrais tests plus tard)
function simulateTests() {
  // Tests de la catégorie navigation
  testResponsiveDesign();
  testKeyboardNavigation();
  testTwoNavigationMeans();
  testDownloadableFiles();
  
  // Tests de la catégorie langage
  testContrasts();
  testColorOnly();
  testMediaAlternatives();
  testLanguageDefined();
  testExplicitLinks();
  testTextResize();
  testAnimations();
  
  // Tests de la catégorie structuration
  testPageTitle();
  testHeadingsHierarchy();
  testFormFields();
  testDownloadInfo();
  
  updateStats();
}

// Écouteur pour le bouton de réinitialisation
resetBtn.addEventListener('click', () => {
  resetAllTests();
});

// Initialiser les traductions dans le DOM
function initTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Mettre à jour le bouton de réinitialisation
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.textContent = t('statsReset');
  }
}

// Initialiser l'affichage de la version
function initVersion() {
  try {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version || '0.0.0';
    const versionElement = document.getElementById('version-number');
    if (versionElement) {
      versionElement.textContent = version;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la version:', error);
    const versionElement = document.getElementById('version-number');
    if (versionElement) {
      versionElement.textContent = '?';
    }
  }
}

// Initialiser les onglets
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Désactiver tous les onglets
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Activer l'onglet sélectionné
      button.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });
}

// Initialiser les boutons d'export
function initExportChart() {
  const downloadChartBtn = document.getElementById('downloadChartBtn');
  if (downloadChartBtn) {
    downloadChartBtn.addEventListener('click', () => {
      downloadChartAsPNG();
    });
  }
  
  const downloadStatsBtn = document.getElementById('downloadStatsBtn');
  if (downloadStatsBtn) {
    downloadStatsBtn.addEventListener('click', () => {
      downloadStatsAsPNG();
    });
  }
}

// Initialisation
initTranslations();
initCategories();
initPopinEvents(); // Initialiser la popin
initVersion(); // Afficher la version
initTabs(); // Initialiser les onglets
initExportChart(); // Initialiser le bouton d'export
initTests(); // Lancer les tests automatiquement
console.log(t('panelInitialized'));
