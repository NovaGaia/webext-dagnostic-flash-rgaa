// Test: Le contenu reste lisible lorsque la taille de caractères est portée à 200% de la taille par défaut dans le navigateur

function testTextResize() {
  const testId = 'text-resize';
  const content = document.getElementById('category-langage');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testTextResizeName')}</div>
    <div class="test-description">${t('testTextResizeDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-viewport">
        ${replaceEmojisInMessage(t('testTextResizeCheckViewport'))}
      </div>
      <div class="auto-check" id="test-${testId}-units">
        ${replaceEmojisInMessage(t('testTextResizeCheckUnits'))}
      </div>
      <div class="auto-check" id="test-${testId}-overflow">
        ${replaceEmojisInMessage(t('testTextResizeCheckOverflow'))}
      </div>
    </div>
    <div class="test-actions">
      <button class="button-small" id="test-${testId}-instructions">Instructions</button>
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
  runTextResizeChecks(testId);
  
  // Écouteur pour le bouton d'instructions
  document.getElementById(`test-${testId}-instructions`).addEventListener('click', () => {
    showTextResizeInstructions();
  });
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateTextResizeStatus(testId, input.value);
    });
  });
}

// Exécuter les vérifications automatiques du redimensionnement texte
function runTextResizeChecks(testId) {
  // Préparer les traductions pour le script injecté
  const translations = {
    viewportOk: t('testTextResizeViewportOk'),
    viewportBlocked: t('testTextResizeViewportBlocked'),
    viewportMissing: t('testTextResizeViewportMissing'),
    unitsFlexible: t('testTextResizeUnitsFlexible'),
    unitsFixed: t('testTextResizeUnitsFixed'),
    noOverflow: t('testTextResizeNoOverflow'),
    overflowDetected: t('testTextResizeOverflowDetected')
  };
  
  chrome.devtools.inspectedWindow.eval(`
    (function(translations) {
      const results = {
        viewport: { passed: false, message: '' },
        units: { passed: false, message: '' },
        overflow: { passed: false, message: '' }
      };
      
      // Vérification 1: Meta viewport et user-scalable
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        const content = viewportMeta.getAttribute('content') || '';
        if (content.includes('user-scalable=no') || content.includes('user-scalable=0')) {
          results.viewport.passed = false;
          results.viewport.message = translations.viewportBlocked;
        } else {
          results.viewport.passed = true;
          results.viewport.message = translations.viewportOk;
        }
      } else {
        results.viewport.passed = true; // Pas de viewport = zoom autorisé par défaut
        results.viewport.message = translations.viewportOk;
      }
      
      // Vérification 2: Unités de taille utilisées
      const allElements = document.querySelectorAll('*');
      let pxCount = 0;
      let flexibleCount = 0;
      
      allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const fontSize = style.fontSize;
        
        // Compter les tailles en px vs rem/em/%
        if (fontSize && fontSize.includes('px')) {
          const pxValue = parseFloat(fontSize);
          if (pxValue > 0 && pxValue < 20) { // Petites tailles fixes plus problématiques
            pxCount++;
          }
        } else if (fontSize && (fontSize.includes('rem') || fontSize.includes('em') || fontSize.includes('%'))) {
          flexibleCount++;
        }
      });
      
      // Si plus de tailles flexibles que fixes, c'est bon
      if (flexibleCount > pxCount || pxCount < 10) {
        results.units.passed = true;
        results.units.message = translations.unitsFlexible;
      } else {
        results.units.passed = false;
        results.units.message = translations.unitsFixed;
      }
      
      // Vérification 3: Éléments avec largeurs fixes qui pourraient causer des débordements
      let fixedWidthElements = 0;
      const criticalElements = document.querySelectorAll('body *');
      
      criticalElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const width = style.width;
        const maxWidth = style.maxWidth;
        const overflow = style.overflow;
        
        // Détecter les largeurs fixes en px qui sont petites (< 400px)
        if (width && width.includes('px')) {
          const widthValue = parseFloat(width);
          if (widthValue > 0 && widthValue < 400 && !maxWidth.includes('100%')) {
            fixedWidthElements++;
          }
        }
        
        // Détecter les overflow hidden qui masquent le contenu
        if (overflow === 'hidden' && (width.includes('px') || maxWidth.includes('px'))) {
          fixedWidthElements++;
        }
      });
      
      if (fixedWidthElements === 0 || fixedWidthElements < 5) {
        results.overflow.passed = true;
        results.overflow.message = translations.noOverflow;
      } else {
        results.overflow.passed = false;
        results.overflow.message = translations.overflowDetected;
      }
      
      return results;
    })(${JSON.stringify(translations)})
  `, (results, isException) => {
    if (isException) {
      const errorMsg = t('errorInjectedScript') + ': ' + (isException.value || isException);
      updateTextResizeCheckResult(testId, 'viewport', false, errorMsg);
      updateTextResizeCheckResult(testId, 'units', false, errorMsg);
      updateTextResizeCheckResult(testId, 'overflow', false, errorMsg);
      return;
    }
    
    // Mettre à jour chaque vérification
    updateTextResizeCheckResult(testId, 'viewport', results.viewport.passed, results.viewport.message);
    updateTextResizeCheckResult(testId, 'units', results.units.passed, results.units.message);
    updateTextResizeCheckResult(testId, 'overflow', results.overflow.passed, results.overflow.message);
  });
}

// Mettre à jour le résultat d'une vérification automatique
function updateTextResizeCheckResult(testId, checkType, passed, message) {
  const checkElement = document.getElementById(`test-${testId}-${checkType}`);
  if (checkElement) {
    checkElement.className = `auto-check ${passed ? 'passed' : 'warning'}`;
    checkElement.innerHTML = replaceEmojisInMessage(message);
  }
}

// Afficher les instructions pour tester le redimensionnement
function showTextResizeInstructions() {
  const instructions = t('testTextResizeInstructions').replace(/\\n/g, '\n');
  showPopin('Instructions', instructions);
}

// Mettre à jour le statut du test
function updateTextResizeStatus(testId, validationValue) {
  const testItem = document.getElementById(`test-${testId}`);
  if (!testItem) return;
  
  // Vérifier aussi les résultats automatiques
  const viewportCheck = document.getElementById(`test-${testId}-viewport`);
  const unitsCheck = document.getElementById(`test-${testId}-units`);
  const overflowCheck = document.getElementById(`test-${testId}-overflow`);
  
  const autoChecksPassed = 
    viewportCheck?.classList.contains('passed') &&
    (unitsCheck?.classList.contains('passed') || unitsCheck?.classList.contains('warning')) &&
    (overflowCheck?.classList.contains('passed') || overflowCheck?.classList.contains('warning'));
  
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
    name: t('testTextResizeNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.langage.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    // Si on revient à "non testé", retirer le test du tableau pour qu'il ne soit pas compté
    if (existingIndex >= 0) {
      categories.langage.tests.splice(existingIndex, 1);
    }
  } else {
    // Sinon, mettre à jour ou ajouter le test
    if (existingIndex >= 0) {
      categories.langage.tests[existingIndex] = testData;
    } else {
      categories.langage.tests.push(testData);
    }
  }
  
  updateStats();
}

