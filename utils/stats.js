// Gestion des statistiques et des catégories

// Structure des catégories
const categories = {
  navigation: {
    name: t('categoryNavigation'),
    icon: '🧭',
    tests: [],
    totalTests: 4 // Nombre total de tests dans cette catégorie
  },
  langage: {
    name: t('categoryLangage'),
    icon: '🌐',
    tests: [],
    totalTests: 7 // Nombre total de tests dans cette catégorie
  },
  structuration: {
    name: t('categoryStructuration'),
    icon: '📋',
    tests: [],
    totalTests: 4 // Nombre total de tests dans cette catégorie
  }
};

// Mapping des tests avec leurs numéros et noms
const testsMapping = {
  // Navigation & utilisation
  'responsive-design': { number: 1, nameKey: 'testResponsiveDesignNameForStats', category: 'navigation' },
  'keyboard-navigation': { number: 2, nameKey: 'testKeyboardNavigationNameForStats', category: 'navigation' },
  'two-navigation-means': { number: 3, nameKey: 'testTwoNavigationMeansNameForStats', category: 'navigation' },
  'downloadable-files': { number: 4, nameKey: 'testDownloadableFilesNameForStats', category: 'navigation' },
  
  // Langage & interface
  'contrasts': { number: 5, nameKey: 'testContrastsNameForStats', category: 'langage' },
  'color-only': { number: 6, nameKey: 'testColorOnlyNameForStats', category: 'langage' },
  'media-alternatives': { number: 7, nameKey: 'testMediaAlternativesNameForStats', category: 'langage' },
  'language-defined': { number: 8, nameKey: 'testLanguageDefinedNameForStats', category: 'langage' },
  'explicit-links': { number: 9, nameKey: 'testExplicitLinksNameForStats', category: 'langage' },
  'text-resize': { number: 10, nameKey: 'testTextResizeNameForStats', category: 'langage' },
  'animations': { number: 11, nameKey: 'testAnimationsNameForStats', category: 'langage' },
  
  // Structuration de l'information
  'page-title': { number: 12, nameKey: 'testPageTitleNameForStats', category: 'structuration' },
  'headings-hierarchy': { number: 13, nameKey: 'testHeadingsHierarchyNameForStats', category: 'structuration' },
  'form-fields': { number: 14, nameKey: 'testFormFieldsNameForStats', category: 'structuration' },
  'download-info': { number: 15, nameKey: 'testDownloadInfoNameForStats', category: 'structuration' }
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
  
  // Mettre à jour les stats dans l'onglet Audit
  const totalEl = document.getElementById('totalTests');
  const passedEl = document.getElementById('passedTests');
  const failedEl = document.getElementById('failedTests');
  const notApplicableEl = document.getElementById('notApplicableTests');
  const scoreEl = document.getElementById('scoreValue');
  
  // Mettre à jour les stats dans l'onglet Scores
  const totalElScores = document.getElementById('totalTestsScores');
  const passedElScores = document.getElementById('passedTestsScores');
  const failedElScores = document.getElementById('failedTestsScores');
  const notApplicableElScores = document.getElementById('notApplicableTestsScores');
  const scoreElScores = document.getElementById('scoreValueScores');
  
  const updateStatElement = (el, value) => {
    if (el) {
      el.textContent = value;
    }
  };
  
  const updateScoreElement = (el, score) => {
    if (el) {
      el.textContent = score;
      // Changer la couleur selon le score
      if (score >= 90) {
        el.style.color = '#4caf50'; // Vert pour excellent
      } else if (score >= 75) {
        el.style.color = '#8bc34a'; // Vert clair pour bon
      } else if (score >= 50) {
        el.style.color = '#ff9800'; // Orange pour moyen
      } else {
        el.style.color = '#f44336'; // Rouge pour faible
      }
    }
  };
  
  updateStatElement(totalEl, total);
  updateStatElement(passedEl, passed);
  updateStatElement(failedEl, failed);
  updateStatElement(notApplicableEl, notApplicable);
  updateScoreElement(scoreEl, score);
  
  // Mettre à jour aussi dans l'onglet Scores
  updateStatElement(totalElScores, total);
  updateStatElement(passedElScores, passed);
  updateStatElement(failedElScores, failed);
  updateStatElement(notApplicableElScores, notApplicable);
  updateScoreElement(scoreElScores, score);
  
  if (!totalEl && !totalElScores) {
    console.warn(t('warningTotalTestsNotFound'));
  }
  
  // Mettre à jour le diagramme circulaire
  updatePieChart(passed, failed, notApplicable);
  
  // Mettre à jour les compteurs de progression par catégorie
  updateCategoryProgress();
  
  // Mettre à jour le tableau récapitulatif
  updateSummaryTable();
}

// Mettre à jour le diagramme circulaire
function updatePieChart(passed, failed, notApplicable) {
  const svg = document.getElementById('pieChart');
  const legend = document.getElementById('pieChartLegend');
  
  if (!svg || !legend) return;
  
  // Vider le SVG et la légende
  svg.innerHTML = '';
  legend.innerHTML = '';
  
  const total = passed + failed + notApplicable;
  
  // Si aucun test validé, afficher un cercle gris
  if (total === 0) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '100');
    circle.setAttribute('cy', '100');
    circle.setAttribute('r', '80');
    circle.setAttribute('fill', '#e0e0e0');
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '110');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#999');
    text.textContent = t('emptyState');
    svg.appendChild(text);
    return;
  }
  
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  
  // Calculer les angles pour chaque catégorie
  const passedAngle = (passed / total) * 360;
  const failedAngle = (failed / total) * 360;
  const notApplicableAngle = (notApplicable / total) * 360;
  
  // Couleurs
  const colors = {
    passed: '#4caf50',
    failed: '#f44336',
    notApplicable: '#9e9e9e'
  };
  
  // Dessiner les arcs
  let currentAngle = -90; // Commencer en haut
  
  function createArc(startAngle, endAngle, color) {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', color);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
  }
  
  // Dessiner les arcs dans l'ordre
  if (passed > 0) {
    createArc(currentAngle, currentAngle + passedAngle, colors.passed);
    currentAngle += passedAngle;
  }
  
  if (failed > 0) {
    createArc(currentAngle, currentAngle + failedAngle, colors.failed);
    currentAngle += failedAngle;
  }
  
  if (notApplicable > 0) {
    createArc(currentAngle, currentAngle + notApplicableAngle, colors.notApplicable);
  }
  
  // Créer la légende
  const legendItems = [
    { label: t('statsPassed'), color: colors.passed, count: passed },
    { label: t('statsFailed'), color: colors.failed, count: failed },
    { label: t('statsNotApplicable'), color: colors.notApplicable, count: notApplicable }
  ].filter(item => item.count > 0);
  
  legendItems.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'pie-chart-legend-item';
    
    const colorBox = document.createElement('span');
    colorBox.className = 'pie-chart-legend-color';
    colorBox.style.backgroundColor = item.color;
    
    const label = document.createElement('span');
    label.textContent = `${item.label}: ${item.count}`;
    
    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);
    legend.appendChild(legendItem);
  });
}

// Mettre à jour les compteurs de progression par catégorie
function updateCategoryProgress() {
  Object.keys(categories).forEach(categoryId => {
    const category = categories[categoryId];
    const categoryTests = category.tests;
    
    // Compter les tests par statut dans cette catégorie
    let passed = 0;
    let failed = 0;
    let notApplicable = 0;
    
    categoryTests.forEach(test => {
      if (test.status === 'passed') {
        passed++;
      } else if (test.status === 'failed') {
        failed++;
      } else if (test.status === 'not-applicable') {
        notApplicable++;
      }
    });
    
    // Calculer le total validé (réussis + échoués + non applicables)
    const validated = passed + failed + notApplicable;
    const total = category.totalTests;
    
    // Trouver le header de la catégorie
    const header = document.querySelector(`[data-category-toggle="${categoryId}"]`);
    if (!header) return;
    
    // Trouver ou créer l'élément de compteur
    let counterEl = header.querySelector('.category-progress-counter');
    if (!counterEl) {
      counterEl = document.createElement('span');
      counterEl.className = 'category-progress-counter';
      // Insérer après le titre
      const titleSpan = header.querySelector('span[data-i18n]');
      if (titleSpan) {
        titleSpan.parentNode.insertBefore(counterEl, titleSpan.nextSibling);
      }
    }
    
    // Mettre à jour le compteur avec le format : (validé / total)
    counterEl.textContent = `(${validated} / ${total})`;
    counterEl.style.marginLeft = '8px';
    counterEl.style.fontSize = '12px';
    counterEl.style.color = validated === total ? '#4caf50' : '#666';
    counterEl.style.fontWeight = 'normal';
  });
}

// Réinitialiser les résultats
function resetResults() {
  Object.keys(categories).forEach(categoryId => {
    const content = document.getElementById(`category-${categoryId}`);
    content.innerHTML = `<div class="empty-state">${t('emptyState')}</div>`;
    categories[categoryId].tests = [];
  });
  updateStats();
  // Initialiser le tableau récapitulatif même s'il n'y a pas de tests
  updateSummaryTable();
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

// Mettre à jour le tableau récapitulatif
function updateSummaryTable() {
  const tableContainer = document.getElementById('summary-table-container');
  if (!tableContainer) return;
  
  // Créer le tableau
  const table = document.createElement('table');
  table.className = 'summary-table';
  
  // Créer l'en-tête
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  // En-tête : Critères
  const thCriteria = document.createElement('th');
  thCriteria.className = 'summary-header-criteria';
  thCriteria.textContent = 'Critères';
  headerRow.appendChild(thCriteria);
  
  // En-tête : Résultat
  const thResult = document.createElement('th');
  thResult.className = 'summary-header-result';
  thResult.textContent = 'Résultat';
  headerRow.appendChild(thResult);
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Créer le corps du tableau avec une ligne par test
  const tbody = document.createElement('tbody');
  
  Object.keys(testsMapping).forEach(testId => {
    const testInfo = testsMapping[testId];
    const row = document.createElement('tr');
    
    // Cellule : Numéro et nom du test
    const tdCriteria = document.createElement('td');
    tdCriteria.className = 'summary-criteria';
    tdCriteria.textContent = `${testInfo.number}. ${t(testInfo.nameKey)}`;
    row.appendChild(tdCriteria);
    
    // Cellule : Résultat
    const tdResult = document.createElement('td');
    tdResult.className = 'summary-result';
    
    // Chercher le test dans la catégorie correspondante
    const categoryTests = categories[testInfo.category].tests;
    const expectedName = t(testInfo.nameKey);
    const test = categoryTests.find(t => t.name === expectedName);
    
    if (test) {
      if (test.status === 'passed') {
        tdResult.textContent = 'OK';
        tdResult.className += ' summary-ok';
      } else if (test.status === 'failed') {
        tdResult.textContent = 'KO';
        tdResult.className += ' summary-ko';
      } else if (test.status === 'not-applicable') {
        tdResult.textContent = 'N/A';
        tdResult.className += ' summary-na';
      } else {
        tdResult.textContent = '-';
        tdResult.className += ' summary-pending';
      }
    } else {
      tdResult.textContent = '-';
      tdResult.className += ' summary-pending';
    }
    
    row.appendChild(tdResult);
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  
  // Remplacer le contenu du conteneur
  tableContainer.innerHTML = '';
  tableContainer.appendChild(table);
}

