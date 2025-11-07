// Fonctions de nettoyage des visualisations

// Fonction générique pour nettoyer tous les indicateurs visuels
function cleanupAllVisualizations() {
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      // Nettoyer la visualisation clavier
      if (window._rgaaKeyboardUpdate) {
        window.removeEventListener('scroll', window._rgaaKeyboardUpdate, true);
        window.removeEventListener('resize', window._rgaaKeyboardUpdate);
        delete window._rgaaKeyboardUpdate;
      }
      if (window._rgaaKeyboardDrawLines) {
        delete window._rgaaKeyboardDrawLines;
      }
      
      // Supprimer tous les overlays et SVG des visualisations
      const overlay = document.getElementById('rgaa-keyboard-overlay');
      const svg = document.getElementById('rgaa-keyboard-svg');
      if (overlay) overlay.remove();
      if (svg) svg.remove();
      
      // Nettoyer la mise en évidence des contrastes
      const highlighted = document.querySelectorAll('[data-contrast-highlight]');
      highlighted.forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.removeAttribute('data-contrast-highlight');
      });
      
      // Nettoyer la visualisation des titres
      const headingsOverlay = document.getElementById('rgaa-headings-overlay');
      if (headingsOverlay) headingsOverlay.remove();
      
      const headings = document.querySelectorAll('[data-rgaa-heading-border]');
      headings.forEach(h => {
        h.style.outline = '';
        h.style.outlineOffset = '';
        h.removeAttribute('data-rgaa-heading-border');
      });
      
      if (window._rgaaHeadingsUpdate) {
        window.removeEventListener('scroll', window._rgaaHeadingsUpdate, true);
        window.removeEventListener('resize', window._rgaaHeadingsUpdate);
        delete window._rgaaHeadingsUpdate;
      }
      
      // Nettoyer la visualisation des landmarks
      const landmarksOverlay = document.getElementById('rgaa-landmarks-overlay');
      if (landmarksOverlay) landmarksOverlay.remove();
      
      const landmarks = document.querySelectorAll('[data-rgaa-landmark-border]');
      landmarks.forEach(l => {
        l.style.outline = '';
        l.style.outlineOffset = '';
        l.removeAttribute('data-rgaa-landmark-border');
      });
      
      if (window._rgaaLandmarksUpdate) {
        window.removeEventListener('scroll', window._rgaaLandmarksUpdate, true);
        window.removeEventListener('resize', window._rgaaLandmarksUpdate);
        delete window._rgaaLandmarksUpdate;
      }
      
      // Nettoyer la visualisation des champs de formulaire
      const formFieldsOverlay = document.getElementById('rgaa-form-fields-overlay');
      if (formFieldsOverlay) formFieldsOverlay.remove();
      
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
      
      if (window._rgaaFormFieldsUpdate) {
        window.removeEventListener('scroll', window._rgaaFormFieldsUpdate, true);
        window.removeEventListener('resize', window._rgaaFormFieldsUpdate);
        delete window._rgaaFormFieldsUpdate;
      }
      
      return { cleaned: true };
    })()
  `, (result, isException) => {
    if (isException) {
      console.error('Erreur lors du nettoyage:', isException);
    }
  });
  
  // Retirer les classes highlight-active des lignes de contraste dans le panneau
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      document.querySelectorAll('.contrast-row.highlight-active').forEach(row => {
        row.classList.remove('highlight-active');
      });
    }, 100);
  }
  
  // Arrêter le MutationObserver des contrastes s'il est actif
  if (typeof stopContrastMutationObserver === 'function') {
    stopContrastMutationObserver();
  }
}

