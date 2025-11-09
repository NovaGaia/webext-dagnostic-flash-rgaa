// Test: La hiérarchie des titres est complète et cohérente

function testHeadingsHierarchy() {
  const testId = 'headings-hierarchy';
  const content = document.getElementById('category-structuration');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testHeadingsHierarchyName')}</div>
    <div class="test-description">${t('testHeadingsHierarchyDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${replaceEmojisInMessage(t('testHeadingsHierarchyInfo'))}
      </div>
      <button class="button-small" id="test-${testId}-analyze" style="margin-top: 10px;">${t('testHeadingsHierarchyAnalyze')}</button>
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
              <div class="validation-option">
          <input type="radio" name="test-${testId}-validation" id="test-${testId}-not-applicable" value="not-applicable">
          <label for="test-${testId}-not-applicable">${t('validationNotApplicable')}</label>
        </div>
</div>
    </div>
    ${createDocumentationBlock(testId, false)}
  `;
  
  content.appendChild(testItem);
  
  // Initialiser le bloc de documentation
  initDocumentationBlocks();
  
  // Écouteur pour le bouton d'analyse
  const analyzeBtn = document.getElementById(`test-${testId}-analyze`);
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      analyzeBtn.textContent = t('testHeadingsHierarchyAnalyzing');
      analyzeBtn.disabled = true;
      
      analyzeHeadingsHierarchy((results) => {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = t('testHeadingsHierarchyAnalyze');
        
        if (results.error) {
          const infoElement = document.getElementById(`test-${testId}-info`);
          if (infoElement) {
            const errorMessage = typeof results.error === 'string' 
              ? results.error 
              : (results.error?.value || results.error?.description || results.error?.message || String(results.error));
            infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorPageAnalysis') + ': ' + errorMessage);
            infoElement.className = 'auto-check failed';
          }
        } else {
          displayHeadingsHierarchy(testId, results);
        }
      });
    });
  }
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateHeadingsHierarchyStatus(testId, input.value);
    });
  });
}

// Mettre à jour le statut du test
function updateHeadingsHierarchyStatus(testId, validationValue) {
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
    name: t('testHeadingsHierarchyNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.structuration.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    if (existingIndex >= 0) {
      categories.structuration.tests.splice(existingIndex, 1);
    }
  } else {
    if (existingIndex >= 0) {
      categories.structuration.tests[existingIndex] = testData;
    } else {
      categories.structuration.tests.push(testData);
    }
  }
  
  updateStats();
}

