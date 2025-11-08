// Test: Les images, les vidéos et les fichiers audio ont une alternative textuelle

function testMediaAlternatives() {
  const testId = 'media-alternatives';
  const content = document.getElementById('category-langage');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testMediaAlternativesName')}</div>
    <div class="test-description">${t('testMediaAlternativesDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${t('testMediaAlternativesInfo')}
      </div>
      <button class="button-small" id="test-${testId}-analyze" style="margin-top: 10px;">Analyser les alternatives textuelles (beta)</button>
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
      analyzeMediaAlternatives(testId);
    });
  }
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateMediaAlternativesStatus(testId, input.value);
    });
  });
}

// Analyser les alternatives textuelles et afficher la visualisation
function analyzeMediaAlternatives(testId) {
  const analyzeBtn = document.getElementById(`test-${testId}-analyze`);
  if (!analyzeBtn) return;
  
  // Toggle de l'état actif
  const isActive = analyzeBtn.classList.contains('active');
  
  if (isActive) {
    // Désactiver la visualisation
    cleanupMediaAlternativesVisualization();
    analyzeBtn.classList.remove('active');
    analyzeBtn.textContent = 'Analyser les alternatives textuelles (beta)';
  } else {
    // Activer la visualisation
    analyzeBtn.classList.add('active');
    analyzeBtn.textContent = 'Désactiver l\'analyse';
    showMediaAlternativesVisualization(testId);
  }
}

// Afficher la visualisation des alternatives textuelles
function showMediaAlternativesVisualization(testId) {
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'ancien overlay si il existe
        const existingOverlay = document.getElementById('rgaa-media-alternatives-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Nettoyer les bordures existantes
        const mediaElements = document.querySelectorAll('[data-rgaa-media-border]');
        mediaElements.forEach(el => {
          el.style.outline = '';
          el.style.outlineOffset = '';
          el.removeAttribute('data-rgaa-media-border');
        });
        
        // Nettoyer les event listeners existants
        if (window._rgaaMediaAlternativesUpdate) {
          window.removeEventListener('scroll', window._rgaaMediaAlternativesUpdate, true);
          window.removeEventListener('resize', window._rgaaMediaAlternativesUpdate);
          delete window._rgaaMediaAlternativesUpdate;
        }
        
        // Créer un overlay pour les bulles
        const overlay = document.createElement('div');
        overlay.id = 'rgaa-media-alternatives-overlay';
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
        
        // Fonction pour obtenir l'alternative textuelle d'un élément
        const getAlternativeText = (element) => {
          // Vérifier si l'élément est décoratif (pas besoin d'alternative)
          const role = element.getAttribute('role');
          const ariaHidden = element.getAttribute('aria-hidden');
          
          if (role === 'presentation' || role === 'none' || ariaHidden === 'true') {
            return { text: 'Décoratif', method: 'role=' + role + (ariaHidden === 'true' ? ' + aria-hidden=true' : ''), decorative: true };
          }
          
          const tagName = element.tagName.toLowerCase();
          
          // Fonction helper pour récupérer le nom accessible d'un élément
          // Suit les règles de calcul du nom accessible selon ARIA
          // Note: title n'est PAS inclus dans le calcul du nom accessible pour aria-labelledby
          const getAccessibleName = (element) => {
            if (!element) return null;
            
            // 1. Vérifier aria-label (priorité la plus haute)
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && ariaLabel.trim()) {
              return ariaLabel.trim();
            }
            
            // 2. Vérifier aria-labelledby (récursion)
            const ariaLabelledBy = element.getAttribute('aria-labelledby');
            if (ariaLabelledBy) {
              const ids = ariaLabelledBy.split(/\\s+/).map(id => id.trim()).filter(id => id);
              const texts = [];
              ids.forEach(id => {
                const refElement = document.getElementById(id);
                if (refElement) {
                  const refName = getAccessibleName(refElement);
                  if (refName) {
                    texts.push(refName);
                  }
                }
              });
              if (texts.length > 0) {
                return texts.join(' ');
              }
            }
            
            // 3. Vérifier alt (pour les images)
            if (element.tagName && element.tagName.toLowerCase() === 'img') {
              const alt = element.getAttribute('alt');
              if (alt !== null && alt.trim()) {
                return alt.trim();
              }
            }
            
            // 4. Vérifier textContent (contenu textuel visible)
            if (element.textContent && element.textContent.trim()) {
              return element.textContent.trim();
            }
            
            // title n'est PAS utilisé dans le calcul du nom accessible pour aria-labelledby
            // car son support par les technologies d'assistance est limité et incohérent
            
            return null;
          };
          
          // Fonction helper pour récupérer le texte via aria-labelledby
          const getAriaLabelledByText = (element) => {
            const labelledBy = element.getAttribute('aria-labelledby');
            if (labelledBy) {
              const ids = labelledBy.split(/\\s+/).map(id => id.trim()).filter(id => id);
              const texts = [];
              ids.forEach(id => {
                const labelElement = document.getElementById(id);
                if (labelElement) {
                  const accessibleName = getAccessibleName(labelElement);
                  if (accessibleName) {
                    texts.push(accessibleName);
                  }
                }
              });
              if (texts.length > 0) {
                return { text: texts.join(' '), method: 'aria-labelledby' };
              }
            }
            return null;
          };
          
          // Pour les images
          if (tagName === 'img') {
            const alt = element.getAttribute('alt');
            if (alt !== null) {
              return { text: alt, method: 'alt' };
            }
            const ariaLabelledBy = getAriaLabelledByText(element);
            if (ariaLabelledBy) {
              return ariaLabelledBy;
            }
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
              return { text: ariaLabel, method: 'aria-label' };
            }
            const title = element.getAttribute('title');
            if (title) {
              return { text: title, method: 'title' };
            }
            return { text: null, method: null };
          }
          
          // Pour les SVG
          if (tagName === 'svg') {
            const ariaLabelledBy = getAriaLabelledByText(element);
            if (ariaLabelledBy) {
              return ariaLabelledBy;
            }
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
              return { text: ariaLabel, method: 'aria-label' };
            }
            const title = element.getAttribute('title');
            if (title) {
              return { text: title, method: 'title' };
            }
            // Chercher un élément <title> dans le SVG
            const svgTitle = element.querySelector('title');
            if (svgTitle && svgTitle.textContent) {
              return { text: svgTitle.textContent.trim(), method: 'svg-title' };
            }
            // Vérifier si le SVG a un rôle img avec aria-label
            if (role === 'img') {
              const ariaLabelRole = element.getAttribute('aria-label');
              if (ariaLabelRole) {
                return { text: ariaLabelRole, method: 'role=img + aria-label' };
              }
            }
            return { text: null, method: null };
          }
          
          // Pour les vidéos et audio
          if (tagName === 'video' || tagName === 'audio') {
            const ariaLabelledBy = getAriaLabelledByText(element);
            if (ariaLabelledBy) {
              return ariaLabelledBy;
            }
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
              return { text: ariaLabel, method: 'aria-label' };
            }
            const title = element.getAttribute('title');
            if (title) {
              return { text: title, method: 'title' };
            }
            return { text: null, method: null };
          }
          
          return { text: null, method: null };
        };
        
        // Fonction pour mettre à jour les positions
        const updatePositions = () => {
          // Supprimer toutes les bulles existantes et restaurer les styles
          overlay.innerHTML = '';
          
          const images = document.querySelectorAll('img, svg, video, audio');
          
          images.forEach((element) => {
            if (!isElementVisible(element)) return;
            
            const rect = element.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            
            const altInfo = getAlternativeText(element);
            
            // Couleur de la bordure selon si l'alternative existe ou si c'est décoratif
            let borderColor = '#f44336'; // Rouge par défaut (pas d'alternative)
            if (altInfo.decorative) {
              borderColor = '#4caf50'; // Vert (décoratif = OK)
            } else if (altInfo.text) {
              borderColor = '#4caf50'; // Vert (alternative présente)
            }
            
            // Ajouter une bordure autour de l'élément
            element.style.setProperty('outline', '2px solid ' + borderColor, 'important');
            element.style.setProperty('outline-offset', '2px', 'important');
            element.setAttribute('data-rgaa-media-border', 'true');
            
            // Créer une bulle avec l'alternative textuelle ou l'info décorative
            if (altInfo.text || altInfo.decorative) {
              const tooltip = document.createElement('div');
              tooltip.className = 'rgaa-media-tooltip';
              
              // Limiter la longueur du texte pour l'affichage
              const displayText = altInfo.decorative 
                ? altInfo.text 
                : (altInfo.text.length > 100 
                    ? altInfo.text.substring(0, 100) + '...' 
                    : altInfo.text);
              
              tooltip.innerHTML = '<div class="rgaa-media-tooltip-content">' +
                '<div class="rgaa-media-tooltip-text">' + displayText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' +
                (altInfo.method ? '<div class="rgaa-media-tooltip-method">Méthode: ' + altInfo.method.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' : '') +
                '</div>';
              
              // Positionner la bulle au-dessus de l'élément
              tooltip.style.cssText = 'position: fixed; ' +
                'top: ' + (rect.top - 5) + 'px; ' +
                'left: ' + rect.left + 'px; ' +
                'max-width: 300px; ' +
                'background: #333; ' +
                'color: white; ' +
                'padding: 8px 12px; ' +
                'font-size: 12px; ' +
                'border-radius: 4px; ' +
                'pointer-events: none; ' +
                'z-index: 1000000; ' +
                'box-shadow: 0 2px 8px rgba(0,0,0,0.3); ' +
                'transform: translateY(-100%); ' +
                'margin-top: -5px; ' +
                'word-wrap: break-word; ' +
                'line-height: 1.4;';
              
              // Ajuster la position si la bulle dépasse à gauche
              if (rect.left < 150) {
                tooltip.style.left = '10px';
              }
              // Ajuster la position si la bulle dépasse à droite
              if (rect.left + 300 > window.innerWidth) {
                tooltip.style.left = (window.innerWidth - 310) + 'px';
              }
              
              overlay.appendChild(tooltip);
            } else {
              // Pas d'alternative, afficher un indicateur
              const indicator = document.createElement('div');
              indicator.className = 'rgaa-media-no-alt';
              indicator.textContent = 'Pas d' + String.fromCharCode(39) + 'alternative';
              indicator.style.cssText = 'position: fixed; ' +
                'top: ' + (rect.top + rect.height + 5) + 'px; ' +
                'left: ' + rect.left + 'px; ' +
                'background: #f44336; ' +
                'color: white; ' +
                'padding: 4px 8px; ' +
                'font-size: 11px; ' +
                'font-weight: bold; ' +
                'border-radius: 3px; ' +
                'pointer-events: none; ' +
                'z-index: 1000000; ' +
                'box-shadow: 0 2px 4px rgba(0,0,0,0.2);';
              
              overlay.appendChild(indicator);
            }
          });
        };
        
        // Mettre à jour les positions initiales
        updatePositions();
        
        // Mettre à jour lors du scroll et resize
        let updateTimeout = null;
        const updateHandler = () => {
          if (updateTimeout) clearTimeout(updateTimeout);
          updateTimeout = setTimeout(updatePositions, 10);
        };
        
        window.addEventListener('scroll', updateHandler, true);
        window.addEventListener('resize', updateHandler);
        
        // Stocker la fonction pour pouvoir la nettoyer
        window._rgaaMediaAlternativesUpdate = updateHandler;
        
        return { success: true };
      } catch (e) {
        return { error: String(e) };
      }
    })()
  `, (result, isException) => {
    if (isException) {
      // Extraire un message d'erreur descriptif de l'exception
      let errorMessage = 'Erreur inconnue';
      if (typeof isException === 'string') {
        errorMessage = isException;
      } else if (isException && typeof isException === 'object') {
        errorMessage = isException.value || isException.description || isException.message || isException.toString() || JSON.stringify(isException);
      } else {
        errorMessage = String(isException);
      }
      console.error('Erreur lors de l\'analyse des alternatives textuelles:', errorMessage);
      if (isException && typeof isException === 'object' && isException.stack) {
        console.error('Stack trace:', isException.stack);
      }
      const analyzeBtn = document.getElementById(`test-${testId}-analyze`);
      if (analyzeBtn) {
        analyzeBtn.classList.remove('active');
        analyzeBtn.textContent = 'Analyser les alternatives textuelles (beta)';
      }
    }
  });
}

// Nettoyer la visualisation des alternatives textuelles
function cleanupMediaAlternativesVisualization() {
  // Désactiver le bouton dans le panneau
  const analyzeBtn = document.getElementById('test-media-alternatives-analyze');
  if (analyzeBtn) {
    analyzeBtn.classList.remove('active');
    analyzeBtn.textContent = 'Analyser les alternatives textuelles (beta)';
  }
  
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'overlay
        const overlay = document.getElementById('rgaa-media-alternatives-overlay');
        if (overlay) overlay.remove();
        
        // Nettoyer les bordures
        const mediaElements = document.querySelectorAll('[data-rgaa-media-border]');
        mediaElements.forEach(el => {
          el.style.outline = '';
          el.style.outlineOffset = '';
          el.removeAttribute('data-rgaa-media-border');
        });
        
        // Nettoyer les event listeners
        if (window._rgaaMediaAlternativesUpdate) {
          window.removeEventListener('scroll', window._rgaaMediaAlternativesUpdate, true);
          window.removeEventListener('resize', window._rgaaMediaAlternativesUpdate);
          delete window._rgaaMediaAlternativesUpdate;
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
function updateMediaAlternativesStatus(testId, validationValue) {
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
    name: t('testMediaAlternativesNameForStats'),
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

