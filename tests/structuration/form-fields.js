// Test: Chaque champ de formulaire est clairement associé à son intitulé

function testFormFields() {
  const testId = 'form-fields';
  const content = document.getElementById('category-structuration');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testFormFieldsName')}</div>
    <div class="test-description">${t('testFormFieldsDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${t('testFormFieldsInfo')}
      </div>
      <button class="button-small" id="test-${testId}-analyze" style="margin-top: 10px;">Analyser les champs de formulaire (beta)</button>
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
      analyzeFormFields(testId);
    });
  }
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateFormFieldsStatus(testId, input.value);
    });
  });
}

// Analyser les champs de formulaire et afficher la visualisation
function analyzeFormFields(testId) {
  const analyzeBtn = document.getElementById(`test-${testId}-analyze`);
  if (!analyzeBtn) return;
  
  // Toggle de l'état actif
  const isActive = analyzeBtn.classList.contains('active');
  
  if (isActive) {
    // Désactiver la visualisation
    cleanupFormFieldsVisualization();
    analyzeBtn.classList.remove('active');
    analyzeBtn.textContent = 'Analyser les champs de formulaire (beta)';
  } else {
    // Activer la visualisation
    analyzeBtn.classList.add('active');
    analyzeBtn.textContent = 'Désactiver l\'analyse';
    showFormFieldsVisualization(testId);
  }
}

// Afficher la visualisation des champs de formulaire
function showFormFieldsVisualization(testId) {
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'ancien overlay si il existe
        const existingOverlay = document.getElementById('rgaa-form-fields-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Nettoyer les bordures existantes
        const labels = document.querySelectorAll('[data-rgaa-label-border]');
        labels.forEach(l => {
          l.style.outline = '';
          l.style.outlineOffset = '';
          l.removeAttribute('data-rgaa-label-border');
        });
        
        const inputs = document.querySelectorAll('[data-rgaa-input-border]');
        inputs.forEach(i => {
          i.style.outline = '';
          i.style.outlineOffset = '';
          i.removeAttribute('data-rgaa-input-border');
        });
        
        // Nettoyer les event listeners existants
        if (window._rgaaFormFieldsUpdate) {
          window.removeEventListener('scroll', window._rgaaFormFieldsUpdate, true);
          window.removeEventListener('resize', window._rgaaFormFieldsUpdate);
          delete window._rgaaFormFieldsUpdate;
        }
        
        // Créer un overlay pour les badges
        const overlay = document.createElement('div');
        overlay.id = 'rgaa-form-fields-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
        document.body.appendChild(overlay);
        
        // Fonction pour vérifier si un élément est visible
        const isElementVisible = (el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 style.opacity !== '0' &&
                 rect.width > 0 && 
                 rect.height > 0;
        };
        
        // Fonction pour vérifier si un input est lié à un label
        const isInputLinkedToLabel = (input) => {
          // Vérifier si l'input a un id et qu'un label a un for correspondant
          const inputId = input.id;
          if (inputId) {
            const label = document.querySelector('label[for="' + inputId + '"]');
            if (label) return { linked: true, method: 'for/id', label: label };
          }
          
          // Vérifier si l'input est dans un label (wrapping)
          const parentLabel = input.closest('label');
          if (parentLabel) return { linked: true, method: 'wrapping', label: parentLabel };
          
          // Vérifier aria-labelledby
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          if (ariaLabelledBy) {
            const labelElement = document.getElementById(ariaLabelledBy);
            if (labelElement) return { linked: true, method: 'aria-labelledby', label: labelElement };
          }
          
          // Vérifier aria-label
          const ariaLabel = input.getAttribute('aria-label');
          if (ariaLabel && ariaLabel.trim()) return { linked: true, method: 'aria-label', label: null };
          
          return { linked: false, method: null, label: null };
        };
        
        // Fonction pour mettre à jour les positions
        const updatePositions = () => {
          // Supprimer tous les badges existants et restaurer les styles
          overlay.innerHTML = '';
          
          const labels = document.querySelectorAll('label');
          const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
          
          // Traiter les labels
          labels.forEach((label, index) => {
            if (!isElementVisible(label)) return;
            
            const rect = label.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            
            // Ajouter une bordure verte autour du label
            label.style.setProperty('outline', '2px solid #4caf50', 'important');
            label.style.setProperty('outline-offset', '2px', 'important');
            label.setAttribute('data-rgaa-label-border', 'true');
            
            // Créer un badge pour le label
            const badge = document.createElement('div');
            badge.className = 'rgaa-label-badge';
            badge.textContent = 'Label';
            badge.style.cssText = 'position: fixed; ' +
              'top: ' + rect.top + 'px; ' +
              'left: ' + rect.left + 'px; ' +
              'background: #4caf50; ' +
              'color: white; ' +
              'padding: 2px 6px; ' +
              'font-size: 11px; ' +
              'font-weight: bold; ' +
              'border-radius: 3px; ' +
              'pointer-events: none; ' +
              'z-index: 1000000; ' +
              'transform: translateY(-100%); ' +
              'margin-top: -2px;';
            overlay.appendChild(badge);
          });
          
          // Traiter les inputs
          inputs.forEach((input, index) => {
            if (!isElementVisible(input)) return;
            
            const rect = input.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            
            const linkInfo = isInputLinkedToLabel(input);
            
            // Couleur de la bordure selon si l'input est lié ou non
            const borderColor = linkInfo.linked ? '#1976d2' : '#f44336';
            const badgeText = linkInfo.linked ? 'Input ✓' : 'Input ✗';
            const badgeBg = linkInfo.linked ? '#1976d2' : '#f44336';
            
            // Ajouter une bordure autour de l'input
            input.style.setProperty('outline', '2px solid ' + borderColor, 'important');
            input.style.setProperty('outline-offset', '2px', 'important');
            input.setAttribute('data-rgaa-input-border', 'true');
            
            // Créer un badge pour l'input
            const badge = document.createElement('div');
            badge.className = 'rgaa-input-badge';
            badge.textContent = badgeText;
            badge.style.cssText = 'position: fixed; ' +
              'top: ' + (rect.top + rect.height + 2) + 'px; ' +
              'left: ' + rect.left + 'px; ' +
              'background: ' + badgeBg + '; ' +
              'color: white; ' +
              'padding: 2px 6px; ' +
              'font-size: 11px; ' +
              'font-weight: bold; ' +
              'border-radius: 3px; ' +
              'pointer-events: none; ' +
              'z-index: 1000000;';
            overlay.appendChild(badge);
            
            // Si lié, afficher la méthode de liaison
            if (linkInfo.linked && linkInfo.method) {
              const methodBadge = document.createElement('div');
              methodBadge.className = 'rgaa-input-method-badge';
              methodBadge.textContent = linkInfo.method;
              methodBadge.style.cssText = 'position: fixed; ' +
                'top: ' + (rect.top + rect.height + 20) + 'px; ' +
                'left: ' + rect.left + 'px; ' +
                'background: #666; ' +
                'color: white; ' +
                'padding: 1px 4px; ' +
                'font-size: 10px; ' +
                'border-radius: 2px; ' +
                'pointer-events: none; ' +
                'z-index: 1000000;';
              overlay.appendChild(methodBadge);
            }
          });
        };
        
        // Mettre à jour les positions initiales
        updatePositions();
        
        // Mettre à jour lors du scroll et resize
        const updateHandler = () => {
          updatePositions();
        };
        
        window.addEventListener('scroll', updateHandler, true);
        window.addEventListener('resize', updateHandler);
        
        // Stocker la fonction pour pouvoir la nettoyer
        window._rgaaFormFieldsUpdate = updateHandler;
        
        return { success: true };
      } catch (e) {
        return { error: String(e) };
      }
    })()
  `, (result, isException) => {
    if (isException) {
      console.error('Erreur lors de l\'analyse des champs de formulaire:', isException);
      const analyzeBtn = document.getElementById(`test-${testId}-analyze`);
      if (analyzeBtn) {
        analyzeBtn.classList.remove('active');
        analyzeBtn.textContent = 'Analyser les champs de formulaire (beta)';
      }
    }
  });
}

// Nettoyer la visualisation des champs de formulaire
function cleanupFormFieldsVisualization() {
  // Désactiver le bouton dans le panneau
  const analyzeBtn = document.getElementById('test-form-fields-analyze');
  if (analyzeBtn) {
    analyzeBtn.classList.remove('active');
    analyzeBtn.textContent = 'Analyser les champs de formulaire (beta)';
  }
  
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'overlay
        const overlay = document.getElementById('rgaa-form-fields-overlay');
        if (overlay) overlay.remove();
        
        // Nettoyer les bordures des labels
        const labels = document.querySelectorAll('[data-rgaa-label-border]');
        labels.forEach(l => {
          l.style.outline = '';
          l.style.outlineOffset = '';
          l.removeAttribute('data-rgaa-label-border');
        });
        
        // Nettoyer les bordures des inputs
        const inputs = document.querySelectorAll('[data-rgaa-input-border]');
        inputs.forEach(i => {
          i.style.outline = '';
          i.style.outlineOffset = '';
          i.removeAttribute('data-rgaa-input-border');
        });
        
        // Nettoyer les event listeners
        if (window._rgaaFormFieldsUpdate) {
          window.removeEventListener('scroll', window._rgaaFormFieldsUpdate, true);
          window.removeEventListener('resize', window._rgaaFormFieldsUpdate);
          delete window._rgaaFormFieldsUpdate;
        }
        
        return { cleaned: true };
      } catch (e) {
        return { error: String(e) };
      }
    })()
  `, (result, isException) => {
    if (isException) {
      console.error('Erreur lors du nettoyage:', isException);
    }
  });
}

// Mettre à jour le statut du test
function updateFormFieldsStatus(testId, validationValue) {
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
    name: t('testFormFieldsNameForStats'),
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

