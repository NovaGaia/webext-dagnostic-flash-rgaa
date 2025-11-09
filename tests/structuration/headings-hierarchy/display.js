// Affichage de l'analyse de la hiérarchie des titres et des landmarks

/**
 * Afficher l'analyse de la hiérarchie des titres et des landmarks
 * @param {string} testId - ID du test
 * @param {object} results - Résultats de l'analyse
 */
function displayHeadingsHierarchy(testId, results) {
  const resultsElement = document.getElementById(`test-${testId}-results`);
  if (!resultsElement) return;
  
  // Créer l'interface d'affichage
  let html = `
    <div class="headings-hierarchy-analysis">
      <div class="headings-hierarchy-sections">
  `;
  
  // Section 1: Arborescence des titres
  html += `
    <div class="headings-hierarchy-section">
      <div class="headings-hierarchy-section-header">
        <h4 class="headings-hierarchy-section-title">Arborescence des titres</h4>
        <button class="button-toggle-headings" id="toggle-headings-visualization" title="${t('toggleHeadingsVisualization')}">
          <span class="button-toggle-icon"></span>
        </button>
      </div>
      <div class="headings-tree" id="headings-tree">
  `;
  
  if (results.headings && results.headings.length > 0) {
    // Construire l'arborescence avec indentation (format: "1 - Titre")
    results.headings.forEach((heading, index) => {
      const indent = (heading.level - 1) * 20; // 20px par niveau
      const marginLeft = indent + 'px';
      
      // Classe CSS pour les erreurs
      const errorClass = heading.hasError ? ' headings-tree-error' : '';
      
      html += `
        <div class="headings-tree-item${errorClass}" style="margin-left: ${marginLeft}; padding: 4px 0;">
          <span class="headings-tree-level">${heading.level} -</span>
          <span class="headings-tree-text">${escapeHtml(heading.text || '(titre vide)')}</span>
        </div>
      `;
    });
  } else {
    html += `
      <div class="headings-tree-empty">
        Aucun titre détecté sur la page
      </div>
    `;
  }
  
  html += `
      </div>
    </div>
  `;
  
  // Section 2: Landmarks
  html += `
    <div class="headings-hierarchy-section">
      <div class="headings-hierarchy-section-header">
        <h4 class="headings-hierarchy-section-title">Landmarks</h4>
        <button class="button-toggle-landmarks" id="toggle-landmarks-visualization" title="${t('toggleLandmarksVisualization')}">
          <span class="button-toggle-icon"></span>
        </button>
      </div>
      <div class="landmarks-tree" id="landmarks-tree">
  `;
  
  if (results.landmarks && results.landmarks.length > 0) {
    // Afficher les landmarks avec l'indentation appropriée
    // Utiliser le nestedLevel calculé (comme HeadingsMap)
    results.landmarks.forEach((landmark, index) => {
      // Le niveau d'imbrication est déjà calculé dans l'analyse
      // Indenter selon le niveau (niveau 1 = pas d'indentation, niveau 2+ = indentation)
      const indent = landmark.nestedLevel > 1 ? (landmark.nestedLevel - 1) * 20 : 0;
      
      const roleDisplay = landmark.role ? landmark.role : landmark.type;
      
      // Classes CSS : nested ET hasError (les deux peuvent être combinés)
      const classes = [];
      if (landmark.nested) {
        classes.push('landmark-nested');
      }
      if (landmark.hasError) {
        classes.push('landmark-error');
      }
      const classAttr = classes.length > 0 ? ' ' + classes.join(' ') : '';
      
      html += `
        <div class="landmarks-tree-item${classAttr}" style="margin-left: ${indent}px; padding: 4px 0;">
          <span class="landmarks-tree-label">${escapeHtml(landmark.label)}</span>
          <span class="landmarks-tree-role">[${escapeHtml(roleDisplay)}]</span>
        </div>
      `;
    });
  } else {
    html += `
      <div class="landmarks-tree-empty">
        Aucun landmark détecté sur la page
      </div>
    `;
  }
  
  html += `
      </div>
    </div>
  `;
  
  html += `
      </div>
    </div>
  `;
  
  // Désactiver les visualisations avant de remplacer le contenu
  // (pour éviter d'afficher d'anciens éléments)
  if (window.headingsVisualizationActive) {
    toggleHeadingsVisualization(testId, false, []);
    window.headingsVisualizationActive = false;
  }
  if (window.landmarksVisualizationActive) {
    toggleLandmarksVisualization(testId, false, []);
    window.landmarksVisualizationActive = false;
  }
  
  // Remplacer le contenu
  resultsElement.innerHTML = html;
  
  // Initialiser les boutons toggle (après avoir remplacé le HTML)
  setTimeout(() => {
    initVisualizationToggles(testId, results);
    // Initialiser les icônes dans les boutons toggle
    const toggleHeadingsBtn = document.getElementById('toggle-headings-visualization');
    if (toggleHeadingsBtn) {
      const iconEl = toggleHeadingsBtn.querySelector('.button-toggle-icon');
      if (iconEl && !iconEl.hasChildNodes()) {
        iconEl.appendChild(createEyeIcon(16, '#333'));
      }
    }
    const toggleLandmarksBtn = document.getElementById('toggle-landmarks-visualization');
    if (toggleLandmarksBtn) {
      const iconEl = toggleLandmarksBtn.querySelector('.button-toggle-icon');
      if (iconEl && !iconEl.hasChildNodes()) {
        iconEl.appendChild(createEyeIcon(16, '#333'));
      }
    }
  }, 0);
}

// Variables globales pour l'état des visualisations
window.headingsVisualizationActive = false;
window.landmarksVisualizationActive = false;

/**
 * Initialiser les boutons toggle pour la visualisation
 */
function initVisualizationToggles(testId, results) {
  // Toggle pour les titres
  const toggleHeadingsBtn = document.getElementById('toggle-headings-visualization');
  
  if (toggleHeadingsBtn) {
    // Réinitialiser l'état si le bouton existe déjà (éviter les doubles événements)
    const existingClickHandler = toggleHeadingsBtn._rgaaClickHandler;
    if (existingClickHandler) {
      toggleHeadingsBtn.removeEventListener('click', existingClickHandler);
    }
    
    const clickHandler = () => {
      window.headingsVisualizationActive = !window.headingsVisualizationActive;
      toggleHeadingsVisualization(testId, window.headingsVisualizationActive, results.headings);
      updateToggleButtonState(toggleHeadingsBtn, window.headingsVisualizationActive);
    };
    
    toggleHeadingsBtn._rgaaClickHandler = clickHandler;
    toggleHeadingsBtn.addEventListener('click', clickHandler);
    
    // Mettre à jour l'état visuel initial
    updateToggleButtonState(toggleHeadingsBtn, window.headingsVisualizationActive);
  }
  
  // Toggle pour les landmarks
  const toggleLandmarksBtn = document.getElementById('toggle-landmarks-visualization');
  
  if (toggleLandmarksBtn) {
    // Réinitialiser l'état si le bouton existe déjà (éviter les doubles événements)
    const existingClickHandler = toggleLandmarksBtn._rgaaClickHandler;
    if (existingClickHandler) {
      toggleLandmarksBtn.removeEventListener('click', existingClickHandler);
    }
    
    const clickHandler = () => {
      window.landmarksVisualizationActive = !window.landmarksVisualizationActive;
      toggleLandmarksVisualization(testId, window.landmarksVisualizationActive, results.landmarks);
      updateToggleButtonState(toggleLandmarksBtn, window.landmarksVisualizationActive);
    };
    
    toggleLandmarksBtn._rgaaClickHandler = clickHandler;
    toggleLandmarksBtn.addEventListener('click', clickHandler);
    
    // Mettre à jour l'état visuel initial
    updateToggleButtonState(toggleLandmarksBtn, window.landmarksVisualizationActive);
  }
}

/**
 * Mettre à jour l'état visuel du bouton toggle
 */
function updateToggleButtonState(button, isActive) {
  if (isActive) {
    button.classList.add('active');
    const iconEl = button.querySelector('.button-toggle-icon');
    if (iconEl) {
      iconEl.innerHTML = '';
      const eyeIcon = createEyeIcon(16, '#333');
      const checkIcon = createCheckIcon(16, '#4caf50');
      iconEl.appendChild(eyeIcon);
      iconEl.appendChild(checkIcon);
    }
  } else {
    button.classList.remove('active');
    const iconEl = button.querySelector('.button-toggle-icon');
    if (iconEl) {
      iconEl.innerHTML = '';
      iconEl.appendChild(createEyeIcon(16, '#333'));
    }
  }
}

/**
 * Toggle la visualisation des titres sur la page
 */
function toggleHeadingsVisualization(testId, isActive, headings) {
  if (!isActive) {
    // Désactiver : nettoyer
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const overlay = document.getElementById('rgaa-headings-overlay');
        if (overlay) overlay.remove();
        
        // Nettoyer les bordures
        const headings = document.querySelectorAll('[data-rgaa-heading-border]');
        headings.forEach(h => {
          h.style.outline = '';
          h.style.outlineOffset = '';
          h.removeAttribute('data-rgaa-heading-border');
        });
        
        // Nettoyer les event listeners
        if (window._rgaaHeadingsUpdate) {
          window.removeEventListener('scroll', window._rgaaHeadingsUpdate, true);
          window.removeEventListener('resize', window._rgaaHeadingsUpdate);
          delete window._rgaaHeadingsUpdate;
        }
        
        return { cleaned: true };
      })()
    `, (result, isException) => {
      if (isException) {
        console.error('Erreur lors du nettoyage des titres:', isException);
      }
    });
    return;
  }
  
  // Activer : injecter le script de visualisation
  if (!headings || headings.length === 0) {
    return;
  }
  
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'ancien overlay si il existe
        const existingOverlay = document.getElementById('rgaa-headings-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Nettoyer les bordures existantes
        const headings = document.querySelectorAll('[data-rgaa-heading-border]');
        headings.forEach(h => {
          h.style.outline = '';
          h.style.outlineOffset = '';
          h.removeAttribute('data-rgaa-heading-border');
        });
        
        // Nettoyer les event listeners existants
        if (window._rgaaHeadingsUpdate) {
          window.removeEventListener('scroll', window._rgaaHeadingsUpdate, true);
          window.removeEventListener('resize', window._rgaaHeadingsUpdate);
          delete window._rgaaHeadingsUpdate;
        }
        
        // Créer un overlay pour les badges
        const overlay = document.createElement('div');
        overlay.id = 'rgaa-headings-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
        document.body.appendChild(overlay);
        
        // Fonction pour mettre à jour les positions
        const updatePositions = () => {
          const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]');
          
          // Supprimer tous les badges existants et restaurer les styles
          overlay.innerHTML = '';
          headings.forEach(h => {
            if (h.hasAttribute('data-rgaa-heading-border')) {
              h.style.outline = '';
              h.style.outlineOffset = '';
              h.removeAttribute('data-rgaa-heading-border');
            }
          });
          
          headings.forEach((heading, index) => {
            const rect = heading.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            
            // Obtenir le niveau
            let level = 0;
            const tagName = heading.tagName.toLowerCase();
            if (tagName.match(/^h[1-6]$/)) {
              level = parseInt(tagName.charAt(1));
            } else if (heading.getAttribute('role') === 'heading') {
              const ariaLevel = heading.getAttribute('aria-level');
              level = ariaLevel ? parseInt(ariaLevel) : 2;
            } else {
              return;
            }
            
            // Ajouter une bordure autour de l'élément
            heading.style.setProperty('outline', '2px solid #2e7d32', 'important');
            heading.style.setProperty('outline-offset', '2px', 'important');
            heading.setAttribute('data-rgaa-heading-border', 'true');
            
            // Créer un badge (position en haut à droite du titre)
            const badge = document.createElement('div');
            badge.className = 'rgaa-heading-badge';
            badge.textContent = 'h' + level;
            badge.style.cssText = \`
              position: fixed;
              top: \${rect.top}px;
              right: \${window.innerWidth - rect.right}px;
              background-color: #2e7d32;
              color: white;
              padding: 2px 6px;
              font-size: 11px;
              font-weight: bold;
              border-radius: 3px;
              z-index: 1000000;
              pointer-events: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            \`;
            
            overlay.appendChild(badge);
          });
        };
        
        // Mettre à jour initialement
        updatePositions();
        
        // Debounce pour scroll/resize
        let updateTimeout = null;
        const debouncedUpdate = () => {
          if (updateTimeout) clearTimeout(updateTimeout);
          updateTimeout = setTimeout(updatePositions, 100);
        };
        
        window._rgaaHeadingsUpdate = debouncedUpdate;
        window.addEventListener('scroll', debouncedUpdate, true);
        window.addEventListener('resize', debouncedUpdate);
        
        return { success: true };
      } catch (e) {
        return { error: String(e) };
      }
    })()
  `, (result, isException) => {
    if (isException) {
      const errorMsg = isException.value || isException.description || isException.message || String(isException);
      console.error('Erreur lors de la visualisation des titres:', errorMsg);
    }
  });
}

/**
 * Toggle la visualisation des landmarks sur la page
 */
function toggleLandmarksVisualization(testId, isActive, landmarks) {
  if (!isActive) {
    // Désactiver : nettoyer
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        const overlay = document.getElementById('rgaa-landmarks-overlay');
        if (overlay) overlay.remove();
        
        // Nettoyer les bordures
        const landmarks = document.querySelectorAll('[data-rgaa-landmark-border]');
        landmarks.forEach(l => {
          l.style.outline = '';
          l.style.outlineOffset = '';
          l.removeAttribute('data-rgaa-landmark-border');
        });
        
        // Nettoyer les event listeners
        if (window._rgaaLandmarksUpdate) {
          window.removeEventListener('scroll', window._rgaaLandmarksUpdate, true);
          window.removeEventListener('resize', window._rgaaLandmarksUpdate);
          delete window._rgaaLandmarksUpdate;
        }
        
        return { cleaned: true };
      })()
    `, (result, isException) => {
      if (isException) {
        console.error('Erreur lors du nettoyage des landmarks:', isException);
      }
    });
    return;
  }
  
  // Activer : injecter le script de visualisation
  if (!landmarks || landmarks.length === 0) {
    return;
  }
  
  // Passer les informations des landmarks au script injecté
  const landmarksInfo = landmarks.map(l => ({
    type: l.type,
    tag: l.tag,
    role: l.role || l.type
  }));
  
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      try {
        // Supprimer l'ancien overlay si il existe
        const existingOverlay = document.getElementById('rgaa-landmarks-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        // Nettoyer les bordures existantes
        const landmarks = document.querySelectorAll('[data-rgaa-landmark-border]');
        landmarks.forEach(l => {
          l.style.outline = '';
          l.style.outlineOffset = '';
          l.removeAttribute('data-rgaa-landmark-border');
        });
        
        // Nettoyer les event listeners existants
        if (window._rgaaLandmarksUpdate) {
          window.removeEventListener('scroll', window._rgaaLandmarksUpdate, true);
          window.removeEventListener('resize', window._rgaaLandmarksUpdate);
          delete window._rgaaLandmarksUpdate;
        }
        
        // Créer un overlay pour les badges
        const overlay = document.createElement('div');
        overlay.id = 'rgaa-landmarks-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
        document.body.appendChild(overlay);
        
        // Sélecteurs pour les landmarks
        const landmarkSelectors = [
          'header',
          'nav',
          'main',
          'aside',
          'footer',
          '[role="banner"]',
          '[role="navigation"]',
          '[role="main"]',
          '[role="complementary"]',
          '[role="contentinfo"]',
          '[role="search"]',
          'form[role="search"]'
        ].join(', ');
        
        // Fonction pour obtenir le type de landmark
        const getLandmarkType = (element) => {
          const tagName = element.tagName.toLowerCase();
          const role = element.getAttribute('role');
          
          if (tagName === 'header' || role === 'banner') return 'banner';
          if (tagName === 'nav' || role === 'navigation') return 'navigation';
          if (tagName === 'main' || role === 'main') return 'main';
          if (tagName === 'aside' || role === 'complementary') return 'complementary';
          if (tagName === 'footer' || role === 'contentinfo') return 'contentinfo';
          if (role === 'search' || (tagName === 'form' && role === 'search')) return 'search';
          return null;
        };
        
        // Fonction pour mettre à jour les positions
        const updatePositions = () => {
          const landmarks = document.querySelectorAll(landmarkSelectors);
          
          // Supprimer tous les badges existants et restaurer les styles
          overlay.innerHTML = '';
          landmarks.forEach(l => {
            if (l.hasAttribute('data-rgaa-landmark-border')) {
              l.style.outline = '';
              l.style.outlineOffset = '';
              l.removeAttribute('data-rgaa-landmark-border');
            }
          });
          
          landmarks.forEach((landmark) => {
            const rect = landmark.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            
            const type = getLandmarkType(landmark);
            if (!type) return;
            
            // Couleur selon le type
            const colors = {
              'banner': '#1976d2',
              'navigation': '#388e3c',
              'main': '#f57c00',
              'complementary': '#7b1fa2',
              'contentinfo': '#c2185b',
              'search': '#0097a7'
            };
            
            const borderColor = colors[type] || '#666';
            
            // Ajouter une bordure autour de l'élément
            landmark.style.setProperty('outline', '2px solid ' + borderColor, 'important');
            landmark.style.setProperty('outline-offset', '2px', 'important');
            landmark.setAttribute('data-rgaa-landmark-border', 'true');
            
            // Créer un badge (position en haut à gauche du landmark)
            const badge = document.createElement('div');
            badge.className = 'rgaa-landmark-badge';
            badge.textContent = type;
            badge.style.cssText = \`
              position: fixed;
              top: \${rect.top}px;
              left: \${rect.left}px;
              background-color: \${borderColor};
              color: white;
              padding: 2px 6px;
              font-size: 11px;
              font-weight: bold;
              border-radius: 3px;
              z-index: 1000000;
              pointer-events: none;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              border: 1px solid white;
            \`;
            
            overlay.appendChild(badge);
          });
        };
        
        // Mettre à jour initialement
        updatePositions();
        
        // Debounce pour scroll/resize
        let updateTimeout = null;
        const debouncedUpdate = () => {
          if (updateTimeout) clearTimeout(updateTimeout);
          updateTimeout = setTimeout(updatePositions, 100);
        };
        
        window._rgaaLandmarksUpdate = debouncedUpdate;
        window.addEventListener('scroll', debouncedUpdate, true);
        window.addEventListener('resize', debouncedUpdate);
        
        return { success: true };
      } catch (e) {
        return { error: String(e) };
      }
    })()
  `, (result, isException) => {
    if (isException) {
      const errorMsg = isException.value || isException.description || isException.message || String(isException);
      console.error('Erreur lors de la visualisation des landmarks:', errorMsg);
    }
  });
}

/**
 * Fonction utilitaire pour échapper le HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

