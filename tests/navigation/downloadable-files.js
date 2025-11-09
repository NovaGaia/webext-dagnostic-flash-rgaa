// Test: Les fichiers bureautiques téléchargeables sont proposés dans un format ouvert et sont accessibles

function testDownloadableFiles() {
  const testId = 'downloadable-files';
  const content = document.getElementById('category-navigation');
  
  // Créer l'élément de test
  const testItem = document.createElement('div');
  testItem.className = 'test-item';
  testItem.id = `test-${testId}`;
  
  testItem.innerHTML = `
    <div class="test-name">${t('testDownloadableFilesName')}</div>
    <div class="test-description">${t('testDownloadableFilesDesc')}</div>
    <div class="test-results" id="test-${testId}-results">
      <div class="auto-check" id="test-${testId}-info">
        ${t('testDownloadableFilesSearching')}
      </div>
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
  
  // Lancer la détection automatique des fichiers
  detectDownloadableFiles(testId);
  
  // Écouteurs pour les options de validation
  const validationInputs = document.querySelectorAll(`input[name="test-${testId}-validation"]`);
  validationInputs.forEach(input => {
    input.addEventListener('change', () => {
      updateDownloadableFilesStatus(testId, input.value);
    });
  });
}

// Détecter les fichiers téléchargeables
function detectDownloadableFiles(testId) {
  chrome.devtools.inspectedWindow.eval(`
    (function() {
      const results = {
        totalFiles: 0,
        officeFiles: [],
        openFormatFiles: [],
        closedFormatFiles: []
      };
      
      // Extensions de fichiers bureautiques (fermés)
      const closedFormats = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
      // Extensions de fichiers bureautiques (ouverts)
      const openFormats = ['.pdf', '.odt', '.ods', '.odp', '.html', '.csv', '.txt'];
      
      // Trouver tous les liens vers des fichiers
      const links = document.querySelectorAll('a[href]');
      
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent.trim();
        const lowerHref = href.toLowerCase();
        
        // Vérifier si le lien pointe vers un fichier bureautique
        const isOfficeFile = closedFormats.some(ext => lowerHref.endsWith(ext)) ||
                            openFormats.some(ext => lowerHref.endsWith(ext));
        
        if (isOfficeFile) {
          results.totalFiles++;
          
          const fileInfo = {
            url: href,
            text: text || href,
            format: ''
          };
          
          // Déterminer le format
          if (closedFormats.some(ext => lowerHref.endsWith(ext))) {
            const ext = closedFormats.find(ext => lowerHref.endsWith(ext));
            fileInfo.format = ext.substring(1).toUpperCase();
            results.closedFormatFiles.push(fileInfo);
          } else if (openFormats.some(ext => lowerHref.endsWith(ext))) {
            const ext = openFormats.find(ext => lowerHref.endsWith(ext));
            fileInfo.format = ext.substring(1).toUpperCase();
            results.openFormatFiles.push(fileInfo);
          }
          
          results.officeFiles.push(fileInfo);
        }
      });
      
      return results;
    })()
  `, (results, isException) => {
    const infoElement = document.getElementById(`test-${testId}-info`);
    if (!infoElement) return;
    
    if (isException) {
      infoElement.innerHTML = replaceEmojisInMessage('✗ ' + t('errorDetection') + ': ' + (isException.value || isException));
      infoElement.className = 'auto-check failed';
      return;
    }
    
    // Afficher les résultats
    let message = '';
    if (results.totalFiles === 0) {
      message = t('testDownloadableFilesNone');
      infoElement.className = 'auto-check';
    } else {
      message = t('testDownloadableFilesFound', { count: results.totalFiles });
      if (results.openFormatFiles.length > 0) {
        const formats = results.openFormatFiles.map(f => f.format).join(', ');
        message += t('testDownloadableFilesOpenFormat', { 
          openCount: results.openFormatFiles.length, 
          formats: formats 
        });
      }
      if (results.closedFormatFiles.length > 0) {
        const formats = results.closedFormatFiles.map(f => f.format).join(', ');
        message += ' - ' + t('testDownloadableFilesClosedFormat', { 
          closedCount: results.closedFormatFiles.length, 
          formats: formats 
        });
      }
      infoElement.className = 'auto-check ' + (results.closedFormatFiles.length > 0 ? 'warning' : 'passed');
    }
    
    infoElement.innerHTML = replaceEmojisInMessage(message);
  });
}

// Mettre à jour le statut du test
function updateDownloadableFilesStatus(testId, validationValue) {
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
    name: t('testDownloadableFilesNameForStats'),
    status: status,
    results: resultsMessage
  };
  
  // Trouver ou créer l'entrée dans categories
  const existingIndex = categories.navigation.tests.findIndex(t => t.name === testData.name);
  
  if (validationValue === 'not-tested') {
    if (existingIndex >= 0) {
      categories.navigation.tests.splice(existingIndex, 1);
    }
  } else {
    if (existingIndex >= 0) {
      categories.navigation.tests[existingIndex] = testData;
    } else {
      categories.navigation.tests.push(testData);
    }
  }
  
  updateStats();
}

