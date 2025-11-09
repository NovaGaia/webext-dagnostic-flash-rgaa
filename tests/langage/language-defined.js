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
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #333;">${t('testLanguageDefinedInfoTitle')}</h4>
        <div class="language-detected" id="test-${testId}-detected" style="display: none;"></div>
      </div>
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
  
  // Récupérer et afficher l'attribut lang de la balise html
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      const htmlElement = document.documentElement;
      const lang = htmlElement ? htmlElement.getAttribute('lang') : null;
      
      return {
        lang: lang
      };
    })()
  `, (result, isException) => {
    const infoElement = document.getElementById(`test-${testId}-info`);
    const detectedElement = document.getElementById(`test-${testId}-detected`);
    
    if (infoElement) {
      if (isException) {
        const errorMsg = isException.value || isException.description || isException.message || String(isException);
        infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorPageAnalysis') + ': ' + errorMsg);
        infoElement.className = 'auto-check failed';
        if (detectedElement) {
          detectedElement.style.display = 'none';
        }
      } else if (result) {
        // Le bloc Lang s'affiche en premier
        if (detectedElement) {
          if (result.lang) {
            const detectedHtml = `<div><strong>${t('testLanguageDefinedLabel')}</strong> <code style="background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${escapeHtml(result.lang)}</code></div>`;
            detectedElement.innerHTML = detectedHtml;
            detectedElement.style.display = 'block';
          } else {
            const detectedHtml = `<div style="color: #999;"><strong>${t('testLanguageDefinedLabel')}</strong> <em>${t('testLanguageDefinedNotFound')}</em></div>`;
            detectedElement.innerHTML = detectedHtml;
            detectedElement.style.display = 'block';
          }
        }
        
        // Le message "Test à valider manuellement" s'affiche après le bloc Lang
        infoElement.innerHTML = replaceEmojisInMessage(t('testLanguageDefinedInfo'));
        infoElement.className = 'auto-check';
      }
    }
  });
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateLanguageDefinedStatus(testId, input.value);
    });
  });
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

