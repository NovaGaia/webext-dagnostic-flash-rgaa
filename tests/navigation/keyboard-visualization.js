// Visualisation de la navigation clavier (ordre de tabulation)

// Activer/désactiver la visualisation de la navigation clavier
function toggleKeyboardVisualization(testId, isActive, showHidden = false) {
  if (!isActive) {
    // Désactiver la visualisation
    chrome.devtools.inspectedWindow.eval(`
      (function() {
        // Supprimer les event listeners
        if (window._rgaaKeyboardUpdate) {
          window.removeEventListener('scroll', window._rgaaKeyboardUpdate, true);
          window.removeEventListener('resize', window._rgaaKeyboardUpdate);
          delete window._rgaaKeyboardUpdate;
        }
        
        const overlay = document.getElementById('rgaa-keyboard-overlay');
        const svg = document.getElementById('rgaa-keyboard-svg');
        if (overlay) overlay.remove();
        if (svg) svg.remove();
        return { active: false };
      })()
    `, (result, isException) => {
      const infoElement = document.getElementById(`test-${testId}-info`);
      if (infoElement) {
        infoElement.innerHTML = replaceEmojisInMessage('ℹ️ Visualisation désactivée');
        infoElement.className = 'auto-check';
      }
    });
    return;
  }
  
  // Activer la visualisation
  const script = `
    (function(showHidden) {
      try {
        // Supprimer l'ancien overlay si il existe
        const existingOverlay = document.getElementById('rgaa-keyboard-overlay');
        if (existingOverlay && existingOverlay.parentNode) {
          existingOverlay.parentNode.removeChild(existingOverlay);
        }
        
        const existingSvg = document.getElementById('rgaa-keyboard-svg');
        if (existingSvg && existingSvg.parentNode) {
          existingSvg.parentNode.removeChild(existingSvg);
        }
        
        // Nettoyer les event listeners existants
        if (window._rgaaKeyboardUpdate) {
          window.removeEventListener('scroll', window._rgaaKeyboardUpdate, true);
          window.removeEventListener('resize', window._rgaaKeyboardUpdate);
          delete window._rgaaKeyboardUpdate;
        }
        if (window._rgaaKeyboardDrawLines) {
          delete window._rgaaKeyboardDrawLines;
        }
      } catch (e) {
        console.warn('Erreur lors du nettoyage:', e);
      }
      
      try {
      // Créer un overlay pour les annotations
      const overlay = document.createElement('div');
      overlay.id = 'rgaa-keyboard-overlay';
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999999;';
      document.body.appendChild(overlay);
      
      // Créer un SVG pour les lignes
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'rgaa-keyboard-svg';
      svg.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999998;';
      document.body.appendChild(svg);
      
      // Trouver tous les éléments interactifs focusables
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
        'details',
        'summary'
      ].join(', ');
      
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
      
      // Fonction pour vérifier si un élément est masqué mais accessible au clavier
      const isElementHidden = (el) => {
        const style = window.getComputedStyle(el);
        // Élément masqué mais toujours dans le DOM et potentiellement accessible
        // (dans un menu fermé, dropdown, etc.)
        return !isElementVisible(el);
      };
      
      // Trouver tous les éléments focusables (visibles et masqués)
      const allElements = Array.from(document.querySelectorAll(focusableSelectors));
      
      // Trier tous les éléments par ordre de tabindex et position dans le DOM
      // (sans filtrer, pour garder l'ordre réel de tabulation)
      allElements.sort((a, b) => {
        const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
        const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
        if (aTabIndex !== bTabIndex && aTabIndex > 0 && bTabIndex > 0) {
          return aTabIndex - bTabIndex;
        }
        // Comparer la position dans le DOM
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          return -1;
        }
        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
          return 1;
        }
        return 0;
      });
      
      // Séparer les éléments visibles et masqués après le tri
      const visibleElements = allElements.filter(el => isElementVisible(el));
      const hiddenElements = allElements.filter(el => isElementHidden(el));
      
      // Filtrer les éléments à afficher selon le paramètre showHidden
      const elementsToDisplay = showHidden ? allElements : visibleElements;
      
      // Créer les annotations uniquement pour les éléments à afficher
      const annotations = [];
      elementsToDisplay.forEach((el, displayIndex) => {
        // Trouver l'index réel dans allElements pour le numéro
        const realIndex = allElements.indexOf(el);
        const isHidden = hiddenElements.includes(el);
        let rect = el.getBoundingClientRect();
        
        // Pour les éléments masqués, si getBoundingClientRect() retourne des valeurs nulles,
        // forcer le calcul en rendant temporairement le parent visible de manière invisible
        if (isHidden && rect.width === 0 && rect.height === 0) {
          // Essayer de rendre le parent temporairement visible pour calculer la position
          let parent = el.parentElement;
          let parentDisplay = '';
          let parentVisibility = '';
          
          // Chercher un parent qui est masqué et le rendre temporairement "invisible mais présent"
          while (parent && parent !== document.body && parent !== document.documentElement) {
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display === 'none') {
              parentDisplay = parent.style.display;
              parentVisibility = parent.style.visibility;
              
              // Rendre le parent invisible mais présent dans le layout
              parent.style.display = 'block';
              parent.style.visibility = 'hidden';
              parent.style.opacity = '0';
              parent.style.position = 'absolute';
              parent.style.zIndex = '-9999';
              
              // Forcer le recalcul
              void parent.offsetHeight;
              void el.offsetHeight;
              
              // Obtenir la position réelle
              rect = el.getBoundingClientRect();
              
              // Restaurer le parent
              parent.style.display = parentDisplay;
              parent.style.visibility = parentVisibility;
              parent.style.opacity = '';
              parent.style.position = '';
              parent.style.zIndex = '';
              
              // Si on a obtenu une position valide, arrêter
              if (rect.width > 0 || rect.height > 0 || rect.left !== 0 || rect.top !== 0) {
                break;
              }
            }
            parent = parent.parentElement;
          }
        }
        
        // Utiliser les coordonnées réelles, avec une taille minimale si nécessaire
        let displayRect = {
          left: rect.left,
          top: rect.top,
          width: rect.width > 0 ? rect.width : 20,
          height: rect.height > 0 ? rect.height : 20
        };
        
        // Créer un badge numéroté avec position: fixed
        const badge = document.createElement('div');
        badge.className = 'rgaa-tab-badge' + (isHidden ? ' rgaa-tab-badge-hidden' : '');
        badge.textContent = realIndex + 1;
        
        // Style différent pour les éléments masqués
        const bgColor = isHidden ? '#ff9800' : '#1976d2';
        const badgeStyle = isHidden ? 'dashed' : 'solid';
        
        // Positionner le badge au centre de l'élément (ou du parent pour les éléments masqués)
        const badgeSize = 24;
        const badgeOffset = badgeSize / 2; // 12px pour centrer
        
        badge.style.cssText = \`
          position: fixed;
          left: \${displayRect.left + (displayRect.width / 2) - badgeOffset}px;
          top: \${displayRect.top + (displayRect.height / 2) - badgeOffset}px;
          background: \${bgColor};
          color: white;
          width: \${badgeSize}px;
          height: \${badgeSize}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          border: 2px \${badgeStyle} white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          z-index: 1000000;
          pointer-events: none;
          transform: translate(-50%, -50%);
        \`;
        
        // Ajouter un indicateur visuel pour les éléments masqués
        if (isHidden) {
          const indicator = document.createElement('div');
          indicator.textContent = '👁';
          indicator.style.cssText = \`
            position: absolute;
            top: -8px;
            right: -8px;
            font-size: 10px;
            background: rgba(255, 152, 0, 0.9);
            border-radius: 50%;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          \`;
          badge.appendChild(indicator);
        }
        
        overlay.appendChild(badge);
        
        // Stocker les coordonnées pour les lignes
        // Pour les éléments masqués, utiliser les coordonnées du parent ou approximer
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        annotations.push({
          element: el,
          number: realIndex + 1,
          isHidden: isHidden,
          x: displayRect.left + displayRect.width / 2 + scrollX,
          y: displayRect.top + displayRect.height / 2 + scrollY,
          badge: badge,
          displayRect: displayRect
        });
      });
      
      // Recalculer les compteurs après filtrage
      const visibleCount = elementsToDisplay.filter(el => isElementVisible(el)).length;
      const hiddenCount = elementsToDisplay.filter(el => isElementHidden(el)).length;
      
      // Fonction pour obtenir le rectangle d'affichage d'un élément
      const getDisplayRect = (ann) => {
        if (ann.isHidden) {
          // Pour les éléments masqués, utiliser le rect initial ou recalculer
          const rect = ann.element.getBoundingClientRect();
          // Si l'élément a maintenant des dimensions, l'utiliser, sinon utiliser le displayRect stocké
          if (rect.width > 0 && rect.height > 0) {
            return rect;
          }
          return ann.displayRect;
        }
        return ann.element.getBoundingClientRect();
      };
      
      // Fonction pour dessiner/mettre à jour les lignes
      const drawLines = () => {
        // Nettoyer les lignes existantes
        svg.innerHTML = '';
        
        for (let i = 0; i < annotations.length - 1; i++) {
          const current = annotations[i];
          const next = annotations[i + 1];
          
          // Utiliser getDisplayRect() pour obtenir les coordonnées viewport actuelles
          const currentRect = getDisplayRect(current);
          const nextRect = getDisplayRect(next);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', currentRect.left + currentRect.width / 2);
          line.setAttribute('y1', currentRect.top + currentRect.height / 2);
          line.setAttribute('x2', nextRect.left + nextRect.width / 2);
          line.setAttribute('y2', nextRect.top + nextRect.height / 2);
          
          // Style différent pour les lignes vers/entre éléments masqués
          const isHiddenLine = current.isHidden || next.isHidden;
          line.setAttribute('stroke', isHiddenLine ? '#ff9800' : '#1976d2');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', isHiddenLine ? '3,3' : '5,5');
          line.setAttribute('opacity', isHiddenLine ? '0.4' : '0.6');
          svg.appendChild(line);
        }
      };
      
      // Dessiner les lignes initiales
      drawLines();
      
      // Mettre à jour les positions lors du scroll
      let updateTimeout;
      const updatePositions = () => {
        // Debounce pour améliorer les performances
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          annotations.forEach(ann => {
            // Obtenir le rectangle d'affichage actuel
            let displayRect;
            if (ann.isHidden) {
              // Pour les éléments masqués, utiliser getBoundingClientRect() qui peut maintenant avoir des valeurs
              const rect = ann.element.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                // L'élément est maintenant visible, utiliser ses coordonnées réelles
                displayRect = rect;
                ann.displayRect = displayRect; // Mettre à jour
              } else {
                // Toujours masqué, utiliser le displayRect initial
                displayRect = ann.displayRect;
              }
            } else {
              // Pour les éléments visibles, utiliser toujours getBoundingClientRect()
              displayRect = ann.element.getBoundingClientRect();
              ann.displayRect = displayRect; // Mettre à jour le displayRect
            }
            
            // Utiliser position: fixed pour que les badges suivent correctement
            // Centrer le badge sur l'élément (transform: translate(-50%, -50%) gère le centrage)
            ann.badge.style.left = displayRect.left + (displayRect.width / 2) + 'px';
            ann.badge.style.top = displayRect.top + (displayRect.height / 2) + 'px';
          });
          
          // Redessiner les lignes avec les nouvelles positions
          drawLines();
        }, 10);
      };
      
      // Écouter les événements avec capture pour capturer tous les scrolls
      window.addEventListener('scroll', updatePositions, true);
      window.addEventListener('resize', updatePositions);
      
      // Stocker les fonctions pour pouvoir les nettoyer
      window._rgaaKeyboardUpdate = updatePositions;
      window._rgaaKeyboardDrawLines = drawLines;
      
      return { 
        active: true, 
        count: elementsToDisplay.length,
        visibleCount: visibleCount,
        hiddenCount: hiddenCount,
        totalCount: allElements.length
      };
      } catch (error) {
        // Nettoyer en cas d'erreur
        try {
          if (window._rgaaKeyboardUpdate) {
            try {
              window.removeEventListener('scroll', window._rgaaKeyboardUpdate, true);
            } catch (e) {}
            try {
              window.removeEventListener('resize', window._rgaaKeyboardUpdate);
            } catch (e) {}
            delete window._rgaaKeyboardUpdate;
          }
          
          try {
            const overlay = document.getElementById('rgaa-keyboard-overlay');
            if (overlay && overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          } catch (e) {}
          
          try {
            const svg = document.getElementById('rgaa-keyboard-svg');
            if (svg && svg.parentNode) {
              svg.parentNode.removeChild(svg);
            }
          } catch (e) {}
        } catch (cleanupError) {
          // Ignorer les erreurs de nettoyage silencieusement
        }
        
        // Extraire un message d'erreur lisible
        // Note: Les traductions seront appliquées côté panel
        let errorMsg = 'Erreur dans le script de visualisation';
        try {
          if (error) {
            if (error && typeof error === 'object') {
              if (error.message && typeof error.message === 'string') {
                errorMsg = error.message;
              } else if (error.name && typeof error.name === 'string') {
                errorMsg = error.name;
              } else if (error.toString && typeof error.toString === 'function') {
                const errorStr = error.toString();
                if (errorStr && errorStr !== '[object Object]' && errorStr !== 'Error') {
                  errorMsg = errorStr;
                }
              }
            } else if (typeof error === 'string') {
              errorMsg = error;
            } else {
              errorMsg = String(error);
            }
          }
        } catch (e) {
          errorMsg = 'Erreur lors de la gestion du message d erreur';
        }
        
        return {
          active: false,
          error: errorMsg
        };
      }
    })(${showHidden})
  `;
  
  chrome.devtools.inspectedWindow.eval(script, (result, isException) => {
    const infoElement = document.getElementById(`test-${testId}-info`);
    if (!infoElement) {
      console.warn(t('warningInfoNotFound') + ':', testId);
      return;
    }
    
    // Si result contient une erreur, la traiter
    if (result && result.error) {
      infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorVisualization') + ': ' + result.error);
      infoElement.className = 'auto-check failed';
      return;
    }
    
    // Si isException est présent, gérer l'exception
    if (isException) {
      // Gérer différents types d'erreurs de manière sécurisée
      let errorMessage = t('errorInjectedScript');
      try {
        if (typeof isException === 'string') {
          errorMessage = isException;
        } else if (isException !== null && typeof isException === 'object') {
          // Essayer différents champs possibles pour le message d'erreur
          if (isException.message && typeof isException.message === 'string') {
            errorMessage = isException.message;
          } else if (isException.description && typeof isException.description === 'string') {
            errorMessage = isException.description;
          } else if (isException.value !== undefined) {
            errorMessage = String(isException.value);
          } else {
            // Essayer toString() en dernier recours
            try {
              const errorStr = String(isException);
              if (errorStr && errorStr !== '[object Object]' && errorStr !== 'Error') {
                errorMessage = errorStr;
              }
            } catch (e) {
              // Ignorer
            }
          }
        } else if (isException !== null && isException !== undefined) {
          errorMessage = String(isException);
        }
      } catch (e) {
        // Si tout échoue, utiliser le message par défaut
        errorMessage = t('errorInjectedScript');
      }
      
      infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorVisualization') + ': ' + errorMessage);
      infoElement.className = 'auto-check failed';
      
      // Log minimal pour le débogage (sans passer l'objet directement)
      console.error(t('errorVisualization') + ':', errorMessage);
      return;
    }
    
    // Traiter le résultat
    if (result) {
      if (result.active === true) {
        let message = replaceEmojisInMessage(`✓ ${t('testKeyboardNavigationActive')}: ${result.count || 0} ${t('testKeyboardNavigationDisplayedCount')}`);
        if (result.totalCount && result.totalCount > result.count) {
          message += ' ' + t('testKeyboardNavigationTotalCount', { total: result.totalCount });
        }
        if (result.hiddenCount > 0 && showHidden) {
          message += ` (${result.visibleCount || 0} ${t('testKeyboardNavigationVisible')}, ${result.hiddenCount} ${t('testKeyboardNavigationHidden')})`;
        } else if (result.totalCount && result.totalCount > result.count) {
          message += ` (${result.totalCount - result.count} ${t('testKeyboardNavigationHiddenNotDisplayed')})`;
        }
        infoElement.innerHTML = message;
        infoElement.className = 'auto-check passed';
      } else if (result.error) {
        // Le script a retourné une erreur
        infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorVisualization') + ': ' + String(result.error));
        infoElement.className = 'auto-check failed';
      } else {
        // Résultat inattendu
        infoElement.innerHTML = replaceEmojisInMessage('ℹ️ ' + t('testKeyboardNavigationInactive'));
        infoElement.className = 'auto-check';
      }
    } else {
      // Pas de résultat
      infoElement.textContent = 'ℹ️ ' + t('testKeyboardNavigationInactive');
      infoElement.className = 'auto-check';
    }
  });
}

