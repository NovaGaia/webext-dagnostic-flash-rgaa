// Service Worker pour l'extension
console.log('Service Worker de l\'extension chargé');

// Écouteur pour les connexions depuis le panneau DevTools
chrome.runtime.onConnect.addListener((port) => {
  console.log('Connexion établie depuis:', port.name);
  
  port.onMessage.addListener((msg) => {
    console.log('Message reçu:', msg);
  });
  
  port.onDisconnect.addListener(() => {
    console.log('Connexion fermée');
  });
});

// Gérer le clic sur l'icône de l'extension dans la barre d'outils
chrome.action.onClicked.addListener(async (tab) => {
  // Afficher la même notification que pour le menu contextuel
  await showDevToolsNotification();
});

// Créer le menu contextuel lors de l'installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installée:', details.reason);
  
  if (details.reason === 'install') {
    console.log('Première installation de l\'extension');
  }
  
  // Créer le menu contextuel
  chrome.contextMenus.create({
    id: 'open-rgaa-devtools',
    title: 'Ouvrir Diagnostic Flash RGAA',
    contexts: ['page', 'selection', 'link', 'editable', 'image', 'video', 'audio']
  });
});

// Fonction pour afficher la notification d'aide
async function showDevToolsNotification() {
  // Détecter le navigateur pour adapter le message
  let message = 'Appuyez sur F12 ou utilisez le raccourci clavier pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
  
  // Détecter le système d'exploitation
  const platform = navigator.platform.toLowerCase();
  const isMac = platform.includes('mac');
  
  if (isMac) {
    message = 'Appuyez sur Cmd+Option+I pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
  } else {
    message = 'Appuyez sur F12 ou Ctrl+Shift+I pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
  }
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-48.png',
    title: 'Diagnostic Flash RGAA',
    message: message
  }, (notificationId) => {
    // Supprimer la notification après 10 secondes
    setTimeout(() => {
      if (notificationId) {
        chrome.notifications.clear(notificationId);
      }
    }, 10000);
  });
}

// Gérer le clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'open-rgaa-devtools') {
    // Note: L'ouverture programmatique des DevTools depuis une extension est bloquée
    // par les navigateurs pour des raisons de sécurité. Il n'est pas possible
    // d'ouvrir les DevTools programmatiquement depuis une extension.
    
    // Essayer d'injecter un script (cela ne fonctionnera probablement pas)
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Les navigateurs bloquent la simulation de touches système
          // Cette tentative échouera, mais on essaie quand même
          console.log('Tentative d\'ouverture des DevTools (probablement bloquée par le navigateur)');
          return { attempted: true };
        }
      });
    } catch (e) {
      console.log('Impossible d\'injecter le script:', e);
    }
    
    // Afficher la notification avec les instructions
    await showDevToolsNotification();
  }
});
