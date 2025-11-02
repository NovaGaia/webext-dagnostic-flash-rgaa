// Test: La langue principale du site est bien définie

function testLanguageDefined() {
  const testId = 'language-defined';
  const content = document.getElementById('category-langage');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testLanguageDefinedName')}</div>
    <div class="test-description">${t('testLanguageDefinedDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${t('testLanguageDefinedInfo')}
      </div>
    </div>
    <div class="test-actions">
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
      </div>
    </div>
    ${createDocumentationBlock(testId, false)}
  `;
  
  content.appendChild(testItem);
  
  // Initialiser le bloc de documentation
  initDocumentationBlocks();
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateLanguageDefinedStatus(testId, input.value);
    });
  });
}

// Mettre à jour le statut du test
function updateLanguageDefinedStatus(testId, validationValue) {
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
  } else {
    // not-tested
    testItem.className = 'test-item';
    status = '';
    resultsMessage = t('statusPending');
  }
  
  // Mettre à jour les stats
  const testData = {
    name: t('testLanguageDefinedNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.langage.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    if (existingIndex >= 0) {
      categories.langage.tests.splice(existingIndex, 1);
    }
  } else {
    if (existingIndex >= 0) {
      categories.langage.tests[existingIndex] = testData;
    } else {
      categories.langage.tests.push(testData);
    }
  }
  
  updateStats();
}

