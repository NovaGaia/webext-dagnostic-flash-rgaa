// Système de traduction pour l'extension

// Langue par défaut
let currentLanguage = 'fr';

// Traductions
const translations = {
  fr: {
    // Catégories
    categoryNavigation: 'Navigation & utilisation',
    categoryLangage: 'Langage & interface',
    categoryStructuration: 'Structuration de l\'information',
    
    // Statistiques
    statsTotal: 'Total',
    statsPassed: 'Réussis',
    statsFailed: 'Échoués',
    statsNotApplicable: 'Non applicables',
    statsScore: 'Score',
    statsDistribution: 'Répartition des résultats',
    statsReset: 'Réinitialiser tous les tests',
    statsDownloadChart: 'Télécharger (PNG transparent)',
    statsDownloadChartSuccess: 'Diagramme téléchargé !',
    statsExportChartError: 'Erreur lors de l\'export du diagramme',
    
    // Messages généraux
    emptyState: 'Aucun test effectué pour cette catégorie',
    testsNotImplemented: '⚠️ Tests non implémentés',
    testsNotImplementedDesc: 'Les tests pour cette catégorie seront implémentés prochainement.',
    
    // Test: Responsive design
    testResponsiveDesignName: 'Le site est optimisé pour toutes les tailles d\'écran',
    testResponsiveDesignDesc: 'Vérification que le site est utilisable sur mobile (viewport 390 × 844 pixels)',
    testResponsiveDesignSimulate: 'Simuler mobile (390×844)',
    testResponsiveDesignCheckViewport: '🔍 Vérification en cours...',
    testResponsiveDesignCheckOverflow: '🔍 Vérification en cours...',
    testResponsiveDesignCheckElements: '🔍 Vérification en cours...',
    testResponsiveDesignViewportPresent: '✓ Meta viewport présente',
    testResponsiveDesignViewportMisconfigured: '✗ Meta viewport présente mais mal configurée',
    testResponsiveDesignViewportMissing: '✗ Meta viewport manquante',
    testResponsiveDesignNoOverflow: '✓ Pas de débordement horizontal détecté',
    testResponsiveDesignOverflowDetected: '⚠ Débordement horizontal possible (largeur: {width}px)',
    testResponsiveDesignNoInteractiveElements: '✓ Aucun élément interactif à vérifier',
    testResponsiveDesignAllAccessible: '✓ Tous les éléments interactifs sont accessibles ({count} éléments)',
    testResponsiveDesignSomeHidden: '⚠ Certains éléments peuvent être cachés ({hidden} sur {total})',
    testResponsiveDesignMobileInstructions: 'Pour tester le responsive design:\\n\\n1. Ouvrez les DevTools (F12)\\n2. Activez le mode "Device Toolbar" (Cmd+Shift+M / Ctrl+Shift+M)\\n3. Sélectionnez "iPhone 12 Pro" ou définissez 390 × 844 pixels\\n4. Vérifiez visuellement que le site reste utilisable\\n5. Cochez la case de validation dans le panneau Diagnostic Flash RGAA',
    testResponsiveDesignNameForStats: 'Le site est optimisé pour toutes les tailles d\'écran',
    
    // Test: Keyboard navigation
    testKeyboardNavigationName: 'La navigation et l\'utilisation du site peuvent s\'effectuer entièrement au clavier',
    testKeyboardNavigationDesc: 'Visualisation de l\'ordre de tabulation (TAB) pour vérifier la navigation au clavier',
    testKeyboardNavigationInfo: 'ℹ️ Activez la visualisation pour voir l\'ordre de tabulation des éléments interactifs',
    testKeyboardNavigationToggle: 'Activer la visualisation',
    testKeyboardNavigationToggleOff: 'Désactiver la visualisation',
    testKeyboardNavigationShowHidden: 'Afficher les éléments masqués',
    testKeyboardNavigationActive: 'Visualisation active',
    testKeyboardNavigationInactive: 'Visualisation désactivée',
    testKeyboardNavigationElementsFound: 'éléments interactifs trouvés',
    testKeyboardNavigationVisible: 'visibles',
    testKeyboardNavigationHidden: 'masqués en orange',
    testKeyboardNavigationHiddenNotDisplayed: 'éléments masqués non affichés',
    testKeyboardNavigationDisplayedCount: 'éléments affichés',
    testKeyboardNavigationTotalCount: 'sur {total} total',
    testKeyboardNavigationNameForStats: 'La navigation et l\'utilisation du site peuvent s\'effectuer entièrement au clavier',
    
    // Test: Two navigation means
    testTwoNavigationMeansName: 'Deux moyens de navigation sont présents',
    testTwoNavigationMeansDesc: 'Vérifiez manuellement que le site propose au moins deux moyens de navigation différents (menu, plan du site, moteur de recherche, fil d\'Ariane, etc.)',
    testTwoNavigationMeansInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testTwoNavigationMeansNameForStats: 'Deux moyens de navigation sont présents',
    
    // Test: Downloadable files
    testDownloadableFilesName: 'Les fichiers bureautiques téléchargeables sur le site sont proposés dans un format ouvert et sont accessibles',
    testDownloadableFilesDesc: 'Vérifiez que les fichiers téléchargeables (PDF, DOC, etc.) sont disponibles dans un format ouvert (ODT, ODS, PDF/A, HTML, etc.) et sont accessibles',
    testDownloadableFilesSearching: '🔍 Recherche des fichiers téléchargeables en cours...',
    testDownloadableFilesNone: 'Aucun fichier bureautique détecté sur la page',
    testDownloadableFilesFound: '📄 {count} fichier(s) bureautique(s) détecté(s)',
    testDownloadableFilesOpenFormat: ' ({openCount} en format ouvert: {formats})',
    testDownloadableFilesClosedFormat: ' - {closedCount} en format fermé: {formats}',
    testDownloadableFilesNameForStats: 'Les fichiers bureautiques téléchargeables sur le site sont proposés dans un format ouvert et sont accessibles',
    
    // Test: Contrastes
    testContrastsName: 'Les contrastes sont suffisants',
    testContrastsDesc: 'Vérification du contraste entre le texte et l\'arrière-plan (minimum 4,5:1) et entre les éléments interactifs et l\'arrière-plan (minimum 3:1)',
    testContrastsInfo: 'ℹ️ Cliquez sur "Analyser les contrastes" pour analyser la page',
    testContrastsAnalyze: 'Analyser les contrastes (beta)',
    testContrastsAnalyzing: 'Analyse en cours...',
    testContrastsReanalyze: 'Relancer l\'analyse',
    testContrastsNameForStats: 'Les contrastes sont suffisants',
    
    // Test: Aucune information véhiculée uniquement par la couleur
    testColorOnlyName: 'Aucune information n\'est véhiculée uniquement par la couleur',
    testColorOnlyDesc: 'Vérification que toutes les informations importantes sont accessibles sans faire appel à la seule couleur',
    testColorOnlyInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testColorOnlyNameForStats: 'Aucune information n\'est véhiculée uniquement par la couleur',
    
    // Test: Alternatives textuelles média
    testMediaAlternativesName: 'Les images, les vidéos et les fichiers audio ont une alternative textuelle',
    testMediaAlternativesDesc: 'Vérification que toutes les images, vidéos et fichiers audio ont une alternative textuelle appropriée',
    testMediaAlternativesInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testMediaAlternativesNameForStats: 'Les images, les vidéos et les fichiers audio ont une alternative textuelle',
    
    // Test: Langue principale
    testLanguageDefinedName: 'La langue principale du site est bien définie',
    testLanguageDefinedDesc: 'Vérification que l\'attribut lang est présent sur l\'élément html et correspond à la langue principale',
    testLanguageDefinedInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testLanguageDefinedNameForStats: 'La langue principale du site est bien définie',
    testLanguageDefinedInfoTitle: 'Informations',
    testLanguageDefinedLabel: 'Lang:',
    testLanguageDefinedNotFound: 'Aucune langue détectée',
    
    // Test: Liens explicites
    testExplicitLinksName: 'Les liens sont explicites',
    testExplicitLinksDesc: 'Vérification que le libellé de chaque lien est explicite et permet de comprendre sa destination sans contexte',
    testExplicitLinksInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testExplicitLinksNameForStats: 'Les liens sont explicites',
    
    // Test: Redimensionnement texte
    testTextResizeName: 'Le contenu reste lisible lorsque la taille de caractères est portée à 200% de la taille par défaut dans le navigateur',
    testTextResizeDesc: 'Vérification que le contenu reste lisible et utilisable lorsque la taille des caractères est augmentée à 200%',
    testTextResizeCheckViewport: '🔍 Vérification de la meta viewport...',
    testTextResizeCheckUnits: '🔍 Vérification des unités de taille...',
    testTextResizeCheckOverflow: '🔍 Vérification des débordements...',
    testTextResizeViewportOk: '✓ Le zoom est autorisé',
    testTextResizeViewportBlocked: '⚠ Le zoom peut être bloqué (user-scalable=no détecté)',
    testTextResizeViewportMissing: '⚠ Meta viewport manquante',
    testTextResizeUnitsFlexible: '✓ Unités de taille flexibles détectées (rem, em, %)',
    testTextResizeUnitsFixed: '⚠ Utilisation importante de tailles fixes (px) qui peuvent limiter le redimensionnement',
    testTextResizeNoOverflow: '✓ Aucun débordement critique détecté',
    testTextResizeOverflowDetected: '⚠ Débordements possibles à 200% (éléments avec largeurs fixes)',
    testTextResizeInstructions: 'Pour tester le redimensionnement à 200%:\\n\\n1. Ouvrez les paramètres du navigateur\\n2. Cherchez "Taille de police" ou "Zoom"\\n3. Définissez la taille à 200% ou utilisez Ctrl/Cmd + pour zoomer à 200%\\n4. Vérifiez visuellement que le contenu reste lisible et utilisable\\n5. Cochez la case de validation dans le panneau Diagnostic Flash RGAA',
    testTextResizeInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testTextResizeNameForStats: 'Le contenu reste lisible lorsque la taille de caractères est portée à 200% de la taille par défaut dans le navigateur',
    
    // Test: Animations
    testAnimationsName: 'Les animations, clignotements et sons sont contrôlables',
    testAnimationsDesc: 'Vérification que les animations et sons peuvent être contrôlés par l\'utilisateur',
    testAnimationsInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testAnimationsNameForStats: 'Les animations, clignotements et sons sont contrôlables',
    
    // Test: Titre de page
    testPageTitleName: 'Le titre de la page est unique et pertinent',
    testPageTitleDesc: 'Vérification que le titre de la page affiché dans l\'onglet du navigateur est unique et pertinent',
    testPageTitleInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testPageTitleNameForStats: 'Le titre de la page est unique et pertinent',
    testPageTitleInfoTitle: 'Informations',
    testPageTitleLabel: 'Title:',
    testPageTitleH1Label: 'H1:',
    testPageTitleNotFound: 'Aucun titre détecté',
    testPageTitleH1NotFound: 'Aucun H1 détecté',
    
    // Test: Hiérarchie des titres
    testHeadingsHierarchyName: 'La hiérarchie des titres est complète et cohérente',
    testHeadingsHierarchyDesc: 'Vérification qu\'il y a au moins un titre de niveau 1 et que l\'arbre des titres est logique',
    testHeadingsHierarchyInfo: 'ℹ️ Cliquez sur "Analyser la hiérarchie" pour voir l\'arborescence des titres et des landmarks',
    testHeadingsHierarchyAnalyze: 'Analyser la hiérarchie (beta)',
    testHeadingsHierarchyAnalyzing: 'Analyse en cours...',
    testHeadingsHierarchyNameForStats: 'La hiérarchie des titres est complète et cohérente',
    toggleHeadingsVisualization: 'Afficher/masquer les titres sur la page',
    toggleLandmarksVisualization: 'Afficher/masquer les landmarks sur la page',
    
    // Test: Champs de formulaire
    testFormFieldsName: 'Chaque champ de formulaire est clairement associé à son intitulé. Les champs et les formats obligatoires sont indiqués',
    testFormFieldsDesc: 'Vérification que les intitulés des champs sont correctement associés et que les champs obligatoires sont indiqués',
    testFormFieldsInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testFormFieldsNameForStats: 'Chaque champ de formulaire est clairement associé à son intitulé. Les champs et les formats obligatoires sont indiqués',
    
    // Test: Informations fichiers téléchargement
    testDownloadInfoName: 'Les informations relatives aux fichiers proposés en téléchargement sont indiqués',
    testDownloadInfoDesc: 'Vérification que le format, la taille, la langue et le nom des fichiers téléchargeables sont indiqués',
    testDownloadInfoInfo: 'ℹ️ Test à valider manuellement. Pour savoir comment contrôler, consulter la documentation',
    testDownloadInfoNameForStats: 'Les informations relatives aux fichiers proposés en téléchargement sont indiqués',
    
    // Validation
    validationPassed: '✓ Réussi',
    validationFailed: '✗ Échoué',
    validationNotTested: 'Non testé',
    validationNotApplicable: 'Non applicable',
    
    // Statuts
    statusPending: 'En attente de validation',
    statusPassed: 'Test réussi',
    statusFailed: 'Test échoué',
    statusWarning: 'Validé manuellement (certaines vérifications automatiques peuvent échouer)',
    
    // Erreurs
    errorPageAnalysis: 'Erreur lors de l\'analyse de la page',
    errorReset: 'Erreur lors de la réinitialisation',
    errorUnknown: 'Erreur inconnue',
    errorInjectedScript: 'Erreur dans le script injecté',
    errorVisualization: 'Erreur lors de la visualisation clavier',
    errorDetection: 'Erreur lors de la détection',
    errorCleanup: 'Erreur lors du nettoyage',
    errorMessageExtraction: 'Erreur lors de la gestion du message d erreur',
    errorContrastAnalysis: 'Erreur lors de l\'analyse des contrastes',
    
    // Titre du panneau
    panelTitle: 'Diagnostic Flash RGAA',
    panelInitialized: 'Panneau DevTools initialisé avec les catégories RGAA',
    
    // Warnings console
    warningTotalTestsNotFound: 'Élément totalTests non trouvé',
    warningPassedTestsNotFound: 'Élément passedTests non trouvé',
    warningFailedTestsNotFound: 'Élément failedTests non trouvé',
    warningInfoNotFound: 'Élément info non trouvé pour le test',
    
    // Documentation
    docShowDocumentation: 'Afficher la documentation',
    docHideDocumentation: 'Masquer la documentation',
    docHowToCheck: 'Comment contrôler ?',
    docHowToCheckContent: 'Contenu à définir',
    docHowToNavigateKeyboard: 'Comment navigue-t-on au clavier ?',
    docHowToNavigateKeyboardContent: 'Contenu à définir',
    docWhy: 'Pourquoi ?',
    docWhyContent: 'Contenu à définir',
    docRGAACriteria: 'Critère(s) RGAA concerné(s)',
    docRGAACriteriaContent: 'Contenu à définir',
  },
  
  en: {
    // Catégories
    categoryNavigation: 'Navigation & usage',
    categoryLangage: 'Language & interface',
    categoryStructuration: 'Information structure',
    
    // Statistiques
    statsTotal: 'Total',
    statsPassed: 'Passed',
    statsFailed: 'Failed',
    statsNotApplicable: 'Not applicable',
    statsScore: 'Score',
    statsDistribution: 'Results distribution',
    statsReset: 'Reset all tests',
    statsDownloadChart: 'Download (transparent PNG)',
    statsDownloadChartSuccess: 'Chart downloaded!',
    statsExportChartError: 'Error exporting chart',
    
    // Messages généraux
    emptyState: 'No tests performed for this category',
    testsNotImplemented: '⚠️ Tests not implemented',
    testsNotImplementedDesc: 'Tests for this category will be implemented soon.',
    
    // Test: Responsive design
    testResponsiveDesignName: 'The site is optimized for all screen sizes',
    testResponsiveDesignDesc: 'Verification that the site is usable on mobile (viewport 390 × 844 pixels)',
    testResponsiveDesignSimulate: 'Simulate mobile (390×844)',
    testResponsiveDesignCheckViewport: '🔍 Checking...',
    testResponsiveDesignCheckOverflow: '🔍 Checking...',
    testResponsiveDesignCheckElements: '🔍 Checking...',
    
    // Test: Keyboard navigation
    testKeyboardNavigationName: 'Site navigation and usage can be done entirely with the keyboard',
    testKeyboardNavigationDesc: 'Visualization of tab order (TAB) to check keyboard navigation',
    testKeyboardNavigationInfo: 'ℹ️ Activate visualization to see the tab order of interactive elements',
    testKeyboardNavigationToggle: 'Activate visualization',
    testKeyboardNavigationToggleOff: 'Deactivate visualization',
    testKeyboardNavigationShowHidden: 'Show hidden elements',
    testKeyboardNavigationActive: 'Visualization active',
    testKeyboardNavigationInactive: 'Visualization deactivated',
    testKeyboardNavigationElementsFound: 'interactive elements found',
    testKeyboardNavigationVisible: 'visible',
    testKeyboardNavigationHidden: 'hidden in orange',
    testKeyboardNavigationHiddenNotDisplayed: 'hidden elements not displayed',
    
    // Test: Two navigation means
    testTwoNavigationMeansName: 'Two navigation means are present',
    testTwoNavigationMeansDesc: 'Manually verify that the site offers at least two different navigation means (menu, sitemap, search engine, breadcrumb, etc.)',
    testTwoNavigationMeansInfo: 'ℹ️ Test to be manually validated. To know how to check, consult the documentation',
    
    // Test: Downloadable files
    testDownloadableFilesName: 'Office files downloadable from the site are provided in an open format and are accessible',
    testDownloadableFilesDesc: 'Verify that downloadable files (PDF, DOC, etc.) are available in an open format (ODT, ODS, PDF/A, HTML, etc.) and are accessible',
    testDownloadableFilesSearching: '🔍 Searching for downloadable files...',
    testDownloadableFilesNone: 'No office files detected on the page',
    testDownloadableFilesFound: '📄 {count} office file(s) detected',
    testDownloadableFilesOpenFormat: ' ({openCount} in open format: {formats})',
    testDownloadableFilesClosedFormat: ' - {closedCount} in closed format: {formats}',
    
    // Test: Contrastes
    testContrastsName: 'Contrasts are sufficient',
    testContrastsDesc: 'Verification of contrast between text and background (minimum 4.5:1) and between interactive elements and background (minimum 3:1)',
    testContrastsInfo: 'ℹ️ Click on "Analyze contrasts" to analyze the page',
    testContrastsAnalyze: 'Analyze contrasts (beta)',
    testContrastsAnalyzing: 'Analysis in progress...',
    testContrastsReanalyze: 'Re-run analysis',
    testContrastsNameForStats: 'Contrasts are sufficient',
    
    // Test: Language defined
    testLanguageDefinedName: 'The site\'s main language is well defined',
    testLanguageDefinedDesc: 'Verification that the lang attribute is present on the html element and corresponds to the main language',
    testLanguageDefinedInfo: 'ℹ️ Test to be manually validated. To know how to check, consult the documentation',
    testLanguageDefinedNameForStats: 'The site\'s main language is well defined',
    testLanguageDefinedInfoTitle: 'Information',
    testLanguageDefinedLabel: 'Lang:',
    testLanguageDefinedNotFound: 'No language detected',
    
    // Test: Text resize
    testTextResizeName: 'Content remains readable when font size is increased to 200% of default size in browser',
    testTextResizeDesc: 'Verification that content remains readable and usable when font size is increased to 200%',
    testTextResizeCheckViewport: '🔍 Checking viewport meta...',
    testTextResizeCheckUnits: '🔍 Checking size units...',
    testTextResizeCheckOverflow: '🔍 Checking overflow...',
    testTextResizeViewportOk: '✓ Zoom is allowed',
    testTextResizeViewportBlocked: '⚠ Zoom may be blocked (user-scalable=no detected)',
    testTextResizeViewportMissing: '⚠ Viewport meta missing',
    testTextResizeUnitsFlexible: '✓ Flexible size units detected (rem, em, %)',
    testTextResizeUnitsFixed: '⚠ Significant use of fixed sizes (px) that may limit resizing',
    testTextResizeNoOverflow: '✓ No critical overflow detected',
    testTextResizeOverflowDetected: '⚠ Possible overflow at 200% (elements with fixed widths)',
    testTextResizeInstructions: 'To test resizing to 200%:\\n\\n1. Open browser settings\\n2. Look for "Font size" or "Zoom"\\n3. Set size to 200% or use Ctrl/Cmd + to zoom to 200%\\n4. Visually verify that content remains readable and usable\\n5. Check the validation box in the RGAA Flash Diagnostic panel',
    testTextResizeInfo: 'ℹ️ Test to be manually validated. To know how to check, consult the documentation',
    testTextResizeNameForStats: 'Content remains readable when font size is increased to 200% of default size in browser',
    
    // Test: Headings hierarchy
    testHeadingsHierarchyName: 'The heading hierarchy is complete and consistent',
    testHeadingsHierarchyDesc: 'Verification that there is at least one level 1 heading and that the heading tree is logical',
    testHeadingsHierarchyInfo: 'ℹ️ Click on "Analyze hierarchy" to see the headings and landmarks tree',
    testHeadingsHierarchyAnalyze: 'Analyze hierarchy (beta)',
    testHeadingsHierarchyAnalyzing: 'Analyzing...',
    testHeadingsHierarchyNameForStats: 'The heading hierarchy is complete and consistent',
    toggleHeadingsVisualization: 'Show/hide headings on the page',
    toggleLandmarksVisualization: 'Show/hide landmarks on the page',
    
    // Validation
    validationPassed: '✓ Passed',
    validationFailed: '✗ Failed',
    validationNotTested: 'Not tested',
    validationNotApplicable: 'Not applicable',
    
    // Statuts
    statusPending: 'Pending validation',
    statusPassed: 'Test passed',
    statusFailed: 'Test failed',
    statusWarning: 'Manually validated (some automatic checks may fail)',
    
    // Erreurs
    errorPageAnalysis: 'Error during page analysis',
    errorReset: 'Error during reset',
    errorUnknown: 'Unknown error',
    errorInjectedScript: 'Error in injected script',
    errorVisualization: 'Error during keyboard visualization',
    errorDetection: 'Error during detection',
    errorCleanup: 'Error during cleanup',
    errorMessageExtraction: 'Error during error message handling',
    errorContrastAnalysis: 'Error during contrast analysis',
    
    // Titre du panneau
    panelTitle: 'RGAA Flash Diagnostic',
    panelInitialized: 'DevTools panel initialized with RGAA categories',
    
    // Warnings console
    warningTotalTestsNotFound: 'totalTests element not found',
    warningPassedTestsNotFound: 'passedTests element not found',
    warningFailedTestsNotFound: 'failedTests element not found',
    warningInfoNotFound: 'Info element not found for test',
    
    // Test: Page title
    testPageTitleName: 'The page title is unique and relevant',
    testPageTitleDesc: 'Verification that the page title displayed in the browser tab is unique and relevant',
    testPageTitleInfo: 'ℹ️ Test to be manually validated. To know how to check, consult the documentation',
    testPageTitleNameForStats: 'The page title is unique and relevant',
    testPageTitleInfoTitle: 'Information',
    testPageTitleLabel: 'Title:',
    testPageTitleH1Label: 'H1:',
    testPageTitleNotFound: 'No title detected',
    testPageTitleH1NotFound: 'No H1 detected',
    
    // Documentation
    docShowDocumentation: 'Show documentation',
    docHideDocumentation: 'Hide documentation',
    docHowToCheck: 'How to check?',
    docHowToCheckContent: 'Content to be defined',
    docHowToNavigateKeyboard: 'How to navigate with keyboard?',
    docHowToNavigateKeyboardContent: 'Content to be defined',
    docWhy: 'Why?',
    docWhyContent: 'Content to be defined',
    docRGAACriteria: 'RGAA criteria concerned',
    docRGAACriteriaContent: 'Content to be defined',
  }
};

/**
 * Récupère une traduction
 * @param {string} key - Clé de traduction
 * @param {object} params - Paramètres optionnels pour remplacer dans la chaîne
 * @returns {string} Texte traduit
 */
function t(key, params = {}) {
  const translation = translations[currentLanguage]?.[key] || translations.fr[key] || key;
  
  // Remplacer les paramètres dans la chaîne
  if (Object.keys(params).length > 0) {
    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }
  
  return translation;
}

/**
 * Définit la langue courante
 * @param {string} lang - Code de langue ('fr' ou 'en')
 */
function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
  }
}

/**
 * Récupère la langue courante
 * @returns {string} Code de langue
 */
function getLanguage() {
  return currentLanguage;
}

