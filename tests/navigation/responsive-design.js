// Test: Le site est optimisé pour toutes les tailles d'écran

function testResponsiveDesign() {
  const testId = 'responsive-design';
  const content = document.getElementById('category-navigation');
  content.innerHTML = '';
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testResponsiveDesignName')}</div>
    <div class="test-description">${t('testResponsiveDesignDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-viewport">
        ${replaceEmojisInMessage(t('testResponsiveDesignCheckViewport'))}
      </div>
      <div class="auto-check" id="test-${testId}-overflow">
        ${replaceEmojisInMessage(t('testResponsiveDesignCheckOverflow'))}
      </div>
      <div class="auto-check" id="test-${testId}-elements">
        ${replaceEmojisInMessage(t('testResponsiveDesignCheckElements'))}
      </div>
    </div>
    <div class="test-actions">
      <button class="button-small" id="test-${testId}-simulate">${t('testResponsiveDesignSimulate')}</button>
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
  
  // Lancer les vérifications automatiques
  runResponsiveDesignChecks(testId);
  
  // Écouteur pour le bouton de simulation
  document.getElementById(`test-${testId}-simulate`).addEventListener('click', () => {
    simulateMobileViewport();
  });
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateTestStatus(testId, input.value);
    });
  });
}

// Exécuter les vérifications automatiques du responsive design
function runResponsiveDesignChecks(testId) {
  // Préparer les traductions pour le script injecté
  const translations = {
    viewportPresent: t('testResponsiveDesignViewportPresent'),
    viewportMisconfigured: t('testResponsiveDesignViewportMisconfigured'),
    viewportMissing: t('testResponsiveDesignViewportMissing'),
    noOverflow: t('testResponsiveDesignNoOverflow'),
    overflowDetected: t('testResponsiveDesignOverflowDetected'),
    noInteractiveElements: t('testResponsiveDesignNoInteractiveElements'),
    allAccessible: t('testResponsiveDesignAllAccessible'),
    someHidden: t('testResponsiveDesignSomeHidden')
  };
  
  chrome.devtools.inspectedWindow.eval(`
    (function(translations) {
      const results = {
        viewport: { passed: false, message: '' },
        overflow: { passed: false, message: '' },
        elements: { passed: false, message: '' }
      };
      
      // Vérification 1: Meta viewport
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        const content = viewportMeta.getAttribute('content') || '';
        if (content.includes('width') || content.includes('device-width')) {
          results.viewport.passed = true;
          results.viewport.message = translations.viewportPresent;
        } else {
          results.viewport.passed = false;
          results.viewport.message = translations.viewportMisconfigured;
        }
      } else {
        results.viewport.passed = false;
        results.viewport.message = translations.viewportMissing;
      }
      
      // Vérification 2: Débordement horizontal (avec viewport mobile simulé)
      const body = document.body;
      const html = document.documentElement;
      const bodyWidth = body.scrollWidth;
      const htmlWidth = html.scrollWidth;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      
      // Vérifier si la largeur dépasse le viewport (simulation mobile 390px)
      const mobileWidth = 390;
      if (bodyWidth <= mobileWidth && htmlWidth <= mobileWidth) {
        results.overflow.passed = true;
        results.overflow.message = translations.noOverflow;
      } else {
        results.overflow.passed = false;
        const maxWidth = Math.max(bodyWidth, htmlWidth);
        results.overflow.message = translations.overflowDetected.replace('{width}', maxWidth);
      }
      
      // Vérification 3: Éléments critiques accessibles
      const links = document.querySelectorAll('a');
      const buttons = document.querySelectorAll('button, [role="button"]');
      const inputs = document.querySelectorAll('input, textarea, select');
      
      let accessibleElements = 0;
      let totalElements = links.length + buttons.length + inputs.length;
      
      [...links, ...buttons, ...inputs].forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          accessibleElements++;
        }
      });
      
      if (totalElements === 0) {
        results.elements.passed = true;
        results.elements.message = translations.noInteractiveElements;
      } else if (accessibleElements === totalElements) {
        results.elements.passed = true;
        results.elements.message = translations.allAccessible.replace('{count}', totalElements);
      } else {
        results.elements.passed = false;
        const hiddenCount = totalElements - accessibleElements;
        results.elements.message = translations.someHidden.replace('{hidden}', hiddenCount).replace('{total}', totalElements);
      }
      
      return results;
    })(${JSON.stringify(translations)})
  `, (results, isException) => {
    if (isException) {
      const errorMsg = t('errorInjectedScript') + ': ' + (isException.value || isException);
      updateCheckResult(testId, 'viewport', false, errorMsg);
      updateCheckResult(testId, 'overflow', false, errorMsg);
      updateCheckResult(testId, 'elements', false, errorMsg);
      return;
    }
    
    // Mettre à jour chaque vérification
    updateCheckResult(testId, 'viewport', results.viewport.passed, results.viewport.message);
    updateCheckResult(testId, 'overflow', results.overflow.passed, results.overflow.message);
    updateCheckResult(testId, 'elements', results.elements.passed, results.elements.message);
  });
}

// Mettre à jour le résultat d'une vérification automatique
function updateCheckResult(testId, checkType, passed, message) {
  const checkElement = document.getElementById(`test-${testId}-${checkType}`);
  if (checkElement) {
    checkElement.className = `auto-check ${passed ? 'passed' : (checkType === 'overflow' ? 'warning' : 'failed')}`;
    checkElement.innerHTML = replaceEmojisInMessage(message);
  }
}

// Simuler le viewport mobile
function simulateMobileViewport() {
  const instructions = t('testResponsiveDesignMobileInstructions').replace(/\\n/g, '\n');
  showPopin('Instructions', instructions);
}

// Mettre à jour le statut du test selon la validation manuelle
function updateTestStatus(testId, validationValue) {
  const testItem = document.getElementById(`test-${testId}`);
  if (!testItem) return;
  
  // Vérifier aussi les résultats automatiques
  const viewportCheck = document.getElementById(`test-${testId}-viewport`);
  const overflowCheck = document.getElementById(`test-${testId}-overflow`);
  const elementsCheck = document.getElementById(`test-${testId}-elements`);
  
  const autoChecksPassed = 
    viewportCheck?.classList.contains('passed') &&
    (overflowCheck?.classList.contains('passed') || overflowCheck?.classList.contains('warning')) &&
    elementsCheck?.classList.contains('passed');
  
  let status = '';
  let resultsMessage = '';
  
  if (validationValue === 'passed') {
    // L'utilisateur a validé manuellement, donc on marque comme "passed"
    // même si les vérifications automatiques n'ont pas toutes réussi
    testItem.className = 'test-item passed';
    status = 'passed';
    if (autoChecksPassed) {
      resultsMessage = t('statusPassed');
    } else {
      resultsMessage = t('statusWarning');
    }
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
    name: t('testResponsiveDesignNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.navigation.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    // Si on revient à "non testé", retirer le test du tableau pour qu'il ne soit pas compté
    if (existingIndex >= 0) {
      categories.navigation.tests.splice(existingIndex, 1);
    }
  } else {
    // Sinon, mettre à jour ou ajouter le test
    if (existingIndex >= 0) {
      categories.navigation.tests[existingIndex] = testData;
    } else {
      categories.navigation.tests.push(testData);
    }
  }
  
  updateStats();
}

