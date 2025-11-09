// Test: La navigation peut s'effectuer entièrement au clavier

function testKeyboardNavigation() {
  const testId = 'keyboard-navigation';
  const content = document.getElementById('category-navigation');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testKeyboardNavigationName')}</div>
    <div class="test-description">${t('testKeyboardNavigationDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${replaceEmojisInMessage(t('testKeyboardNavigationInfo'))}
      </div>
    </div>
    <div class="test-actions">
      <div class="test-controls">
        <button class="button-small" id="test-${testId}-toggle">${t('testKeyboardNavigationToggle')}</button>
        <label class="checkbox-label">
          <input type="checkbox" id="test-${testId}-show-hidden">
          <span>${t('testKeyboardNavigationShowHidden')}</span>
        </label>
      </div>
      <div class="test-validation">
        <div class="validation-option">
          <input type="radio" name="test-${testId}-validation" id="test-${testId}-passed" value="passed">
          <label for="test-${testId}-passed">${t('validationPassed')}</label>
        </div>
        <div class="validation-option">
          <input type="radio" name="test-${testId}-validation" id="test-${testId}-failed" value="failed">
          <label for="test-${testId}-failed">${t('validationFailed')}</label>
        </div>
        <div class="validation-option">
          <input type="radio" name="test-${testId}-validation" id="test-${testId}-not-tested" value="not-tested" checked>
          <label for="test-${testId}-not-tested">${t('validationNotTested')}</label>
        </div>
              <div class="validation-option">
          <input type="radio" name="test-${testId}-validation" id="test-${testId}-not-applicable" value="not-applicable">
          <label for="test-${testId}-not-applicable">${t('validationNotApplicable')}</label>
        </div>
</div>
    </div>
    ${createDocumentationBlock(testId, true)}
  `;
  
  content.appendChild(testItem);
  
  // Initialiser le bloc de documentation
  initDocumentationBlocks();
  
  let isVisualizationActive = false;
  let showHiddenElements = false;
  
  // Fonction pour mettre à jour la visualisation avec les paramètres actuels
  const updateVisualization = () => {
    if (isVisualizationActive) {
      toggleKeyboardVisualization(testId, true, showHiddenElements);
    }
  };
  
  // Écouteur pour le bouton toggle
  const toggleBtn = document.getElementById(`test-${testId}-toggle`);
  toggleBtn.addEventListener('click', () => {
    isVisualizationActive = !isVisualizationActive;
    toggleKeyboardVisualization(testId, isVisualizationActive, showHiddenElements);
    toggleBtn.textContent = isVisualizationActive ? t('testKeyboardNavigationToggleOff') : t('testKeyboardNavigationToggle');
  });
  
  // Écouteur pour la checkbox d'éléments masqués
  const showHiddenCheckbox = document.getElementById(`test-${testId}-show-hidden`);
  showHiddenCheckbox.addEventListener('change', () => {
    showHiddenElements = showHiddenCheckbox.checked;
    updateVisualization();
  });
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateKeyboardTestStatus(testId, input.value);
    });
  });
}

// Mettre à jour le statut du test de navigation clavier
function updateKeyboardTestStatus(testId, validationValue) {
  const testItem = document.getElementById(`test-${testId}`);
  if (!testItem) return;
  
  let status = '';
  let resultsMessage = '';
  
  if (validationValue === 'passed') {
    testItem.className = 'test-item passed';
    status = 'passed';
    resultsMessage = t('statusPassed');
  } else if (validationValue === 'failed') {
    testItem.className = 'test-item failed';
    status = 'failed';
    resultsMessage = t('statusFailed');
  } else if (validationValue === 'not-applicable') {
    testItem.className = 'test-item not-applicable';
    status = 'not-applicable';
    resultsMessage = t('validationNotApplicable');
  } else {
    // not-tested
    testItem.className = 'test-item';
    status = '';
    resultsMessage = t('statusPending');
  }
  
  // Mettre à jour les stats
  const testData = {
    name: t('testKeyboardNavigationNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.navigation.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    if (existingIndex >= 0) {
      categories.navigation.tests.splice(existingIndex, 1);
    }
  } else {
    if (existingIndex >= 0) {
      categories.navigation.tests[existingIndex] = testData;
    } else {
      categories.navigation.tests.push(testData);
    }
  }
  
  updateStats();
}

