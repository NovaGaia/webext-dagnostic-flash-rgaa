// Gestion des statistiques et des catégories

// Structure des catégories
const categories = {
  navigation: {
    name: t('categoryNavigation'),
    icon: '🧭',
    tests: []
  },
  langage: {
    name: t('categoryLangage'),
    icon: '🌐',
    tests: []
  },
  structuration: {
    name: t('categoryStructuration'),
    icon: '📋',
    tests: []
  }
};

// Mettre à jour les statistiques
function updateStats() {
  const TOTAL_CRITERIA = 15; // Nombre total de critères RGAA
  
  let total = 0;
  let passed = 0;
  let failed = 0;
  let notApplicable = 0;
  
  Object.keys(categories).forEach(categoryId => {
    const categoryTests = categories[categoryId].tests;
    total += categoryTests.length;
    categoryTests.forEach(test => {
      if (test.status === 'passed') {
        passed++;
      } else if (test.status === 'failed') {
        failed++;
      } else if (test.status === 'not-applicable') {
        notApplicable++;
      }
      // Les tests avec status 'warning' sont comptés dans total mais pas dans passed/failed
    });
  });
  
  // Calcul du score sur 100
  // Algorithme: (nb total de critères (15) - nb de critères non applicables) / nb de critères validés
  // Score = (nb_validés / (15 - nb_non_applicables)) * 100
  let score = 0;
  const applicableCriteria = TOTAL_CRITERIA - notApplicable;
  if (applicableCriteria > 0) {
    score = Math.round((passed / applicableCriteria) * 100);
  } else {
    // Si tous les critères sont non applicables, score = 0 ou non défini
    score = 0;
  }
  
  const totalEl = document.getElementById('totalTests');
  const passedEl = document.getElementById('passedTests');
  const failedEl = document.getElementById('failedTests');
  const notApplicableEl = document.getElementById('notApplicableTests');
  const scoreEl = document.getElementById('scoreValue');
  
  if (totalEl) {
    totalEl.textContent = total;
  } else {
    console.warn(t('warningTotalTestsNotFound'));
  }
  if (passedEl) {
    passedEl.textContent = passed;
  } else {
    console.warn(t('warningPassedTestsNotFound'));
  }
  if (failedEl) {
    failedEl.textContent = failed;
  } else {
    console.warn(t('warningFailedTestsNotFound'));
  }
  if (notApplicableEl) {
    notApplicableEl.textContent = notApplicable;
  }
  if (scoreEl) {
    scoreEl.textContent = score;
    // Changer la couleur selon le score
    if (score >= 90) {
      scoreEl.style.color = '#4caf50'; // Vert pour excellent
    } else if (score >= 75) {
      scoreEl.style.color = '#8bc34a'; // Vert clair pour bon
    } else if (score >= 50) {
      scoreEl.style.color = '#ff9800'; // Orange pour moyen
    } else {
      scoreEl.style.color = '#f44336'; // Rouge pour faible
    }
  }
}

// Réinitialiser les résultats
function resetResults() {
  Object.keys(categories).forEach(categoryId => {
    const content = document.getElementById(`category-${categoryId}`);
    content.innerHTML = `<div class="empty-state">${t('emptyState')}</div>`;
    categories[categoryId].tests = [];
  });
  updateStats();
}

// Afficher un test dans une catégorie
function displayTest(categoryId, testData) {
  const content = document.getElementById(`category-${categoryId}`);
  const emptyState = content.querySelector('.empty-state');
  
  if (emptyState) {
    content.innerHTML = '';
  }
  
  const testItem = document.createElement('div');
  testItem.className = `test-item ${testData.status || ''}`;
  
  testItem.innerHTML = `
    <div class="test-name">${testData.name || 'Test'}</div>
    ${testData.description ? `<div class="test-description">${testData.description}</div>` : ''}
    ${testData.results ? `<div class="test-results">${testData.results}</div>` : ''}
  `;
  
  content.appendChild(testItem);
  categories[categoryId].tests.push(testData);
  updateStats();
}

// Afficher une erreur
function showError(message) {
  console.error(message);
  // Afficher l'erreur dans la première catégorie
  displayTest('navigation', {
    name: 'Erreur',
    description: message,
    status: 'failed'
  });
}

