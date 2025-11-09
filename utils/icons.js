// Système d'icônes SVG basées sur Heroicons (style outline, 24x24 viewBox)
// Toutes les icônes ont le même viewBox pour garantir l'homogénéité

// Fonction utilitaire pour créer une icône SVG Heroicons
function createHeroIcon(pathData, size = 24, color = 'currentColor') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('class', 'heroicon');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke', color);
  path.setAttribute('d', pathData);
  svg.appendChild(path);
  
  return svg;
}

// Icônes de catégories
function createNavigationIcon(size = 20, color = 'currentColor') {
  // Compass (Heroicons)
  return createHeroIcon('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', size, color);
}

function createLangageIcon(size = 20, color = 'currentColor') {
  // Globe (Heroicons)
  return createHeroIcon('M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

function createStructurationIcon(size = 20, color = 'currentColor') {
  // Clipboard (Heroicons)
  return createHeroIcon('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', size, color);
}

// Icônes d'actions
function createDownloadIcon(size = 16, color = 'currentColor') {
  // ArrowDownTray (Heroicons)
  return createHeroIcon('M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3', size, color);
}

function createMagnifyingGlassIcon(size = 16, color = 'currentColor') {
  // MagnifyingGlass (Heroicons)
  return createHeroIcon('M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z', size, color);
}

function createEyeIcon(size = 16, color = 'currentColor') {
  // Eye (Heroicons)
  return createHeroIcon('M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z', size, color);
}

// Icônes de statut
function createCheckIcon(size = 16, color = '#4caf50') {
  // CheckCircle (Heroicons)
  return createHeroIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

function createCrossIcon(size = 16, color = '#f44336') {
  // XCircle (Heroicons)
  return createHeroIcon('M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

function createWarningIcon(size = 16, color = '#ff9800') {
  // ExclamationTriangle (Heroicons)
  return createHeroIcon('M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', size, color);
}

function createInfoIcon(size = 16, color = '#2196f3') {
  // InformationCircle (Heroicons)
  return createHeroIcon('M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z', size, color);
}

// Icônes de statistiques
function createTotalIcon(size = 20, color = '#333') {
  // Hashtag (Heroicons) - représente un compteur/nombre total
  return createHeroIcon('M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5', size, color);
}

function createScoreIcon(size = 20, color = '#1976d2') {
  // ChartBar (Heroicons) - représente les statistiques/score
  return createHeroIcon('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', size, color);
}

function createPassedIcon(size = 20, color = '#4caf50') {
  // CheckCircle (Heroicons) - pour les tests réussis
  return createHeroIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

function createFailedIcon(size = 20, color = '#f44336') {
  // XCircle (Heroicons) - pour les tests échoués
  return createHeroIcon('M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

function createNotApplicableIcon(size = 20, color = '#9e9e9e') {
  // MinusCircle (Heroicons) - pour les tests non applicables
  return createHeroIcon('M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', size, color);
}

// Fonction pour obtenir une icône SVG en tant que string HTML (pour insertion dans innerHTML)
function getIconHTML(iconFunction, size = 16, color = 'currentColor') {
  const icon = iconFunction(size, color);
  const serializer = new XMLSerializer();
  return serializer.serializeToString(icon);
}

// Fonction pour remplacer les emojis dans un message par des icônes SVG
function replaceEmojisInMessage(message) {
  if (typeof message !== 'string') return message;
  
  // Mapping des emojis vers les fonctions d'icônes
  const emojiMap = {
    '🔍': () => getIconHTML(createMagnifyingGlassIcon, 14, '#666'),
    '✓': () => getIconHTML(createCheckIcon, 14, '#4caf50'),
    '✗': () => getIconHTML(createCrossIcon, 14, '#f44336'),
    '▲': () => getIconHTML(createWarningIcon, 14, '#ff9800'),
    '⚠': () => getIconHTML(createWarningIcon, 14, '#ff9800'),
    '⚠️': () => getIconHTML(createWarningIcon, 14, '#ff9800'),
    'ℹ️': () => getIconHTML(createInfoIcon, 14, '#2196f3'),
    'ℹ': () => getIconHTML(createInfoIcon, 14, '#2196f3'),
  };
  
  let result = message;
  for (const [emoji, iconFunction] of Object.entries(emojiMap)) {
    if (result.includes(emoji)) {
      result = result.replace(emoji, iconFunction());
    }
  }
  
  return result;
}

// Fonction pour créer un élément avec un message et des icônes SVG
function createMessageWithIcons(message) {
  const container = document.createElement('span');
  container.innerHTML = replaceEmojisInMessage(message);
  return container;
}

