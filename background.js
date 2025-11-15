// Background script pour l'extension (compatible Chrome service worker et Firefox background script)
console.log('Background script de l\'extension chargé');

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
// Compatible Manifest V2 (browserAction) et V3 (action)
if (chrome.action) {
  // Manifest V3 (Chrome)
  chrome.action.onClicked.addListener(async (tab) => {
    await showDevToolsNotification();
  });
} else if (chrome.browserAction) {
  // Manifest V2 (Firefox)
  chrome.browserAction.onClicked.addListener(async (tab) => {
    await showDevToolsNotification();
  });
}

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
  // Détecter le système d'exploitation
  // Note: navigator peut ne pas être disponible dans un service worker (Chrome)
  // On utilise une détection alternative via l'API runtime
  let message = 'Appuyez sur F12 ou Ctrl+Shift+I pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
  
  // Détecter le système d'exploitation si navigator est disponible
  try {
    if (typeof navigator !== 'undefined' && navigator.platform) {
      const platform = navigator.platform.toLowerCase();
      const isMac = platform.includes('mac');
      
      if (isMac) {
        message = 'Appuyez sur Cmd+Option+I pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
      }
    } else {
      // Fallback: utiliser l'API runtime pour détecter l'OS
      const platformInfo = await chrome.runtime.getPlatformInfo();
      if (platformInfo.os === 'mac') {
        message = 'Appuyez sur Cmd+Option+I pour ouvrir les DevTools, puis sélectionnez l\'onglet "Diagnostic Flash RGAA"';
      }
    }
  } catch (e) {
    // Si la détection échoue, on garde le message par défaut
    console.log('Impossible de détecter l\'OS:', e);
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
    // Compatible Manifest V2 (tabs.executeScript) et V3 (scripting.executeScript)
    try {
      if (chrome.scripting && chrome.scripting.executeScript) {
        // Manifest V3 (Chrome)
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            console.log('Tentative d\'ouverture des DevTools (probablement bloquée par le navigateur)');
            return { attempted: true };
          }
        });
      } else if (chrome.tabs && chrome.tabs.executeScript) {
        // Manifest V2 (Firefox)
        await chrome.tabs.executeScript(tab.id, {
          code: 'console.log("Tentative d\'ouverture des DevTools (probablement bloquée par le navigateur)")'
        });
      }
    } catch (e) {
      console.log('Impossible d\'injecter le script:', e);
    }
    
    // Afficher la notification avec les instructions
    await showDevToolsNotification();
  }
});
