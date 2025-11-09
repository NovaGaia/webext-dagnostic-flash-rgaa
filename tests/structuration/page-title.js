// Test: Le titre de la page est unique et pertinent

function testPageTitle() {
  const testId = 'page-title';
  const content = document.getElementById('category-structuration');
  // Vider le contenu pour cette catégorie au premier test
  content.innerHTML = '';
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testPageTitleName')}</div>
    <div class="test-description">${t('testPageTitleDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div style="margin-bottom: 12px;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #333;">${t('testPageTitleInfoTitle')}</h4>
        <div class="page-title-detected" id="test-${testId}-detected" style="display: none;"></div>
      </div>
      <div class="auto-check" id="test-${testId}-info">
        ${t('testPageTitleInfo')}
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
  
  // Récupérer et afficher le titre et le H1 de la page
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      const titleElement = document.querySelector('title');
      const h1Element = document.querySelector('h1');
      
      return {
        title: titleElement ? titleElement.textContent.trim() : null,
        h1: h1Element ? h1Element.textContent.trim() : null
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
        // Le bloc Title/H1 s'affiche en premier
        if (detectedElement) {
          if (result.title || result.h1) {
            let detectedHtml = '';
            
            if (result.title) {
              detectedHtml += `<div style="margin-bottom: 8px;"><strong>${t('testPageTitleLabel')}</strong> <code style="background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${escapeHtml(result.title)}</code></div>`;
            } else {
              detectedHtml += `<div style="margin-bottom: 8px; color: #999;"><strong>${t('testPageTitleLabel')}</strong> <em>${t('testPageTitleNotFound')}</em></div>`;
            }
            
            if (result.h1) {
              detectedHtml += `<div><strong>${t('testPageTitleH1Label')}</strong> <code style="background-color: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${escapeHtml(result.h1)}</code></div>`;
            } else {
              detectedHtml += `<div style="color: #999;"><strong>${t('testPageTitleH1Label')}</strong> <em>${t('testPageTitleH1NotFound')}</em></div>`;
            }
            
            detectedElement.innerHTML = detectedHtml;
            detectedElement.style.display = 'block';
          } else {
            detectedElement.style.display = 'none';
          }
        }
        
        // Le message "Test à valider manuellement" s'affiche après le bloc Title/H1
        infoElement.innerHTML = replaceEmojisInMessage(t('testPageTitleInfo'));
        infoElement.className = 'auto-check';
      }
    }
  });
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updatePageTitleStatus(testId, input.value);
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
function updatePageTitleStatus(testId, validationValue) {
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
    name: t('testPageTitleNameForStats'),
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

