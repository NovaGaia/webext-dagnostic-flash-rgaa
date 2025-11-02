// Gestion de l'interface utilisateur (catégories, toggles, etc.)

// Initialisation des événements de catégories
function initCategories() {
  document.querySelectorAll('[data-category-toggle]').forEach(header => {
    header.addEventListener('click', (e) => {
      const categoryId = header.getAttribute('data-category-toggle');
      toggleCategory(categoryId);
    });
  });
}

// Toggle d'une catégorie (ouvrir/fermer)
function toggleCategory(categoryId) {
  const header = document.querySelector(`[data-category-toggle="${categoryId}"]`);
  const content = document.getElementById(`category-${categoryId}`);
  
  const isActive = header.classList.contains('active');
  
  // Fermer toutes les catégories
  document.querySelectorAll('.category-header').forEach(h => {
    h.classList.remove('active');
  });
  document.querySelectorAll('.category-content').forEach(c => {
    c.classList.remove('active');
  });
  
  // Ouvrir la catégorie sélectionnée si elle était fermée
  if (!isActive) {
    header.classList.add('active');
    content.classList.add('active');
  }
}

// Créer le bloc de documentation pour un test
function createDocumentationBlock(testId, hasKeyboardInstructions = false) {
  const docId = `doc-${testId}`;
  const buttonId = `doc-${testId}-toggle`;
  const contentId = `doc-${testId}-content`;
  
  // Récupérer le contenu spécifique pour chaque test
  const content = getDocumentationContent(testId);
  
  let keyboardSection = '';
  if (hasKeyboardInstructions && content.howKeyboard) {
    keyboardSection = `
      <div class="doc-section">
        <h4 class="doc-section-title">${t('docHowToNavigateKeyboard')}</h4>
        <div class="doc-section-content" id="${testId}-how-keyboard">
          ${content.howKeyboard}
        </div>
      </div>
    `;
  }
  
  return `
    <div class="test-documentation" id="${docId}">
      <button class="doc-toggle" id="${buttonId}" type="button" aria-expanded="false">
        <span class="doc-toggle-icon">▼</span>
        <span class="doc-toggle-text">${t('docShowDocumentation')}</span>
      </button>
      <div class="doc-content" id="${contentId}" style="display: none;">
        <div class="doc-section">
          <h4 class="doc-section-title">${t('docHowToCheck')}</h4>
          <div class="doc-section-content" id="${testId}-how-check">
            ${content.howToCheck}
          </div>
        </div>
        ${keyboardSection}
        <div class="doc-section">
          <h4 class="doc-section-title">${t('docWhy')}</h4>
          <div class="doc-section-content" id="${testId}-why">
            ${content.why}
          </div>
        </div>
        <div class="doc-section">
          <h4 class="doc-section-title">${t('docRGAACriteria')}</h4>
          <div class="doc-section-content" id="${testId}-rgaa-criteria">
            ${content.rgaaCriteria}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Récupérer le contenu de documentation pour un test spécifique
function getDocumentationContent(testId) {
  const contents = {
    'responsive-design': {
      howToCheck: `<p>Sur l'échantillon, tester les différents formats d'écran avec un smartphone ou en modifiant la taille de la fenêtre sur ordinateur.</p>`,
      why: `<p>Depuis fin 2016, le trafic internet mobile a officiellement dépassé celui du trafic internet fixe dans le monde. En 2018, alors que 95 % des ménages sont équipés en téléphone portable, seuls 82 % ont un ordinateur (y compris tablette), les ménages les plus modestes étant les moins équipés (source : Insee). De ce fait, il est indispensable de développer des services en ligne dont l'affichage s'adapte selon la taille de l'écran utilisé.</p>
<p>La conception de sites web adaptatifs (responsive web design en anglais) contribue à :</p>
<ul>
  <li>une meilleure inclusion de tous les usagers ;</li>
  <li>une audience supérieure ;</li>
  <li>une rapidité d'accès à l'information, quel que soit l'endroit où se trouve l'utilisateur ;</li>
  <li>une interactivité avec des fonctionnalités enrichies (mode tactile, capteurs, etc.) ;</li>
  <li>une amélioration du référencement.</li>
</ul>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-13" target="_blank" rel="noopener" class="rgaa-badge">13.9<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'keyboard-navigation': {
      howToCheck: `<ul>
  <li>Le focus clavier (qui permet à l'usager de savoir sur quel élément interactif il se trouve) est clairement visible ;</li>
  <li>Chaque page comporte des liens d'accès rapides vers le contenu principal, le menu (et le moteur de recherche s'il existe) : ces liens sont au tout début de la page, ils sont de préférence visibles en permanence mais peuvent éventuellement ne s'afficher qu'au cours de la navigation au clavier (rafraîchir la page puis actionner la touche de tabulation pour les faire apparaître) ;</li>
  <li>La navigation et l'utilisation peuvent s'effectuer entièrement au clavier dans un ordre prévisible.</li>
</ul>`,
      howKeyboard: `<ul>
  <li>La touche <code>Tab</code> permet de <strong>voir le focus</strong> (le curseur dans la page), de le faire avancer et de <strong>naviguer</strong> entre les éléments interactifs d'une page (liens, boutons, champs de formulaires, onglets, modales, etc.)</li>
  <li>La combinaison <code>Shift</code> + <code>Tab</code> permet de faire reculer le focus</li>
  <li>La touche <code>Entrée</code> permet d'activer l'élément qui a le focus (lien, bouton, menu, etc.)</li>
  <li>La barre <code>Espace</code> permet de cocher ou décocher une case</li>
  <li>Les flèches <code>Haut</code>, <code>Bas</code>, <code>Droite</code> et <code>Gauche</code> permettent de faire défiler l'affichage, se déplacer dans un menu ou des onglets, modifier un choix de bouton radio</li>
</ul>`,
      why: `<p>La navigation au clavier est un des critères centraux de l'accessibilité numérique. De nombreux utilisateurs, souffrant de handicap ou non, naviguent sans souris, avec les touches de leur clavier.</p>
<p>De plus, les dispositifs qui ne reposent pas sur la souris doivent être pris en compte ; notamment, les contenus et l'utilisation des services doivent être accessibles aux utilisateurs d'aides techniques (lecteurs d'écran par exemple) qui n'utilisent que le clavier ou un périphérique plus spécifique reposant sur les mêmes mécanismes que le clavier.</p>
<p><a href="https://www.youtube.com/watch?v=example" target="_blank" rel="noopener" class="external-link">Utilisation de la plage braille et de la synthèse vocale par une personne aveugle (vidéo, 3 minutes 54)<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-4" target="_blank" rel="noopener" class="rgaa-badge">4.11<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-4" target="_blank" rel="noopener" class="rgaa-badge">4.12<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-7" target="_blank" rel="noopener" class="rgaa-badge">7.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-7" target="_blank" rel="noopener" class="rgaa-badge">7.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-10" target="_blank" rel="noopener" class="rgaa-badge">10.7<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-10" target="_blank" rel="noopener" class="rgaa-badge">10.13<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-10" target="_blank" rel="noopener" class="rgaa-badge">10.14<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.6<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.7<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.8<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.9<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.10<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.11<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'two-navigation-means': {
      howToCheck: `<p>Vérifier qu'il existe deux moyens de navigation parmi les trois suivants : menu principal, plan du site et moteur de recherche.</p>`,
      why: `<p>Le fait de proposer plusieurs moyens de naviguer permet aux utilisateurs de procéder selon leur préférence ou leur besoin. L'alternative est également importante pour les utilisateurs si l'un des moyens utilisés ne donne pas le résultat attendu.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.4<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.5<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-12" target="_blank" rel="noopener" class="rgaa-badge">12.6<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'downloadable-files': {
      howToCheck: `<p>Sur l'échantillon, contrôler que :</p>
<ul>
  <li>pour mettre à disposition des documents que le destinataire n'a pas besoin de modifier, il faut utiliser le format PDF ;</li>
  <li>pour diffuser un document de type texte, le format recommandé est ODT ;</li>
  <li>pour diffuser un document de type présentation, le format recommandé est ODP ;</li>
  <li>pour diffuser un document de type feuille de calcul, le format recommandé est ODS.</li>
</ul>
<p>La suite Office n'est pas interdite mais les alternatives ci-dessus doivent être proposées.</p>`,
      why: `<p>Lors de la mise en ligne de fichiers en téléchargement (traitement de texte, images, audio, vidéo, etc.), il est nécessaire de proposer les formats ouverts afin que tout le monde puisse y avoir accès sans avoir à payer pour accéder à un format propriétaire.</p>
<p>Vous pouvez vous référer aux <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/" target="_blank" rel="noopener" class="external-link">guides pour rédiger des documents bureautiques accessibles<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-13" target="_blank" rel="noopener" class="rgaa-badge">13.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-13" target="_blank" rel="noopener" class="rgaa-badge">13.4<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'contrasts': {
      howToCheck: `<p>Sur l'échantillon, vérifier à l'aide d'un outil de vérification de contraste</p>
<ul>
  <li>le contraste entre la couleur du texte et la couleur de l'arrière-plan. Sa valeur doit être d'au moins 4,5:1</li>
  <li>le contraste entre la couleur des éléments d'interfaces interactifs (bouton, champ de formulaire, icône, ...) et la couleur de l'arrière-plan. Sa valeur doit être d'au moins 3:1</li>
</ul>
<p>Vous pouvez, par exemple, utiliser l'extension de navigateur Contrast Checker (symbolisée par une roue multicolore) :</p>
<ul>
  <li><a href="https://chrome.google.com/webstore/detail/contrast-checker/" target="_blank" rel="noopener" class="external-link">Extension pour Chrome<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
  <li><a href="https://addons.mozilla.org/fr/firefox/addon/contrast-checker/" target="_blank" rel="noopener" class="external-link">Extension pour Firefox<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
  <li><a href="https://microsoftedge.microsoft.com/addons/detail/contrast-checker/" target="_blank" rel="noopener" class="external-link">Extension pour Edge<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
</ul>`,
      why: `<p>Afin de permettre une bonne lisibilité des contenus et de limiter la charge mentale lors de la consultation des pages, il est indispensable que le contraste entre les éléments du site et leur arrière-plan soit suffisant.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-3" target="_blank" rel="noopener" class="rgaa-badge">3.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'animations': {
      howToCheck: `<p>Concernant les animations et contenus en mouvement, contrôler que :</p>
<ul>
  <li>La durée du mouvement est inférieure ou égale à 5 secondes ;</li>
  <li>L'utilisateur peut arrêter et relancer le mouvement ;</li>
  <li>L'utilisateur peut afficher et masquer le contenu en mouvement ;</li>
  <li>L'utilisateur peut afficher la totalité de l'information sans le mouvement.</li>
</ul>
<p>Concernant les séquences sonores, contrôler que :</p>
<ul>
  <li>La durée est inférieure ou égale à 3 secondes ;</li>
  <li>La séquence sonore peut être stoppée sur action de l'utilisateur ;</li>
  <li>Le volume de la séquence sonore peut être contrôlé par l'utilisateur indépendamment du contrôle de volume du système.</li>
</ul>`,
      why: `<p>Il est important de laisser aux utilisateurs le contrôle des animations lors de la consultation du contenu et de ne pas les perturber en imposant des éléments pouvant gêner leur attention ou concentration.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-4" target="_blank" rel="noopener" class="rgaa-badge">4.10<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-4" target="_blank" rel="noopener" class="rgaa-badge">4.11<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-13" target="_blank" rel="noopener" class="rgaa-badge">13.7<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-13" target="_blank" rel="noopener" class="rgaa-badge">13.8<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'page-title': {
      howToCheck: `<p>Le titre de la page s'affiche dans l'onglet du navigateur.</p>
<p>Sur l'échantillon, contrôler que :</p>
<ul>
  <li>Le titre de chaque page est composée du titre de son contenu, suivi du nom du site ;</li>
  <li>Le titre est pertinent et unique ;</li>
  <li>Sur une page de résultat de recherche, le titre est « Résultat de la page de recherche de xxx page 1 - nom du site » ;</li>
  <li>Sur une page de confirmation d'action, le titre indique le résultat de l'action (suivi du nom du site).</li>
</ul>`,
      why: `<p>Le titre de la page permet l'identification des contenus de la page dans l'onglet, dans les favoris, dans l'historique de navigation, dans la fenêtre du navigateur ou encore par les lecteurs d'écran.</p>
<p>Un titre pertinent améliore le référencement et la présentation dans les moteurs de recherche.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-8" target="_blank" rel="noopener" class="rgaa-badge">8.5<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-8" target="_blank" rel="noopener" class="rgaa-badge">8.6<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'headings-hierarchy': {
      howToCheck: `<p>Sur l'échantillon, lancer l'extension headingsMap (symbolisée par le pictogramme <strong>[h/]</strong>). Vérifier qu'il y a au moins un titre de niveau 1 et que l'arbre des titres est logique et cohérent.</p>
<p>Télécharger l'extension headingsMap :</p>
<ul>
  <li><a href="https://chrome.google.com/webstore/detail/headingsmap/" target="_blank" rel="noopener" class="external-link">Extension pour Chrome<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
  <li><a href="https://addons.mozilla.org/fr/firefox/addon/headingsmap/" target="_blank" rel="noopener" class="external-link">Extension pour Firefox<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
  <li><a href="https://microsoftedge.microsoft.com/addons/detail/headingsmap/" target="_blank" rel="noopener" class="external-link">Extension pour Edge<span class="external-link-icon-inline" aria-label="Lien externe">↗</span></a></li>
</ul>`,
      why: `<p>La mise en page permet avant tout la navigation sur la page pour les utilisateurs aveugles ayant un lecteur d'écran ou un clavier braille : ils ont ainsi connaissance de la structuration de la page et peuvent naviguer de titre en titre sans être obligés de lire l'ensemble du contenu.</p>
<p>Ce principe est d'ailleurs valable pour les outils bureautiques de type Document Writer ou Word ou encore PDF : il est indispensable d'utiliser les « styles » et non pas une mise en forme du texte.</p>
<p>De manière plus générale, une bonne hiérarchisation permet une meilleure visualisation et permet l'extraction du plan de chaque page aux outils dédiés (dont ceux d'indexation, avec par conséquent un meilleur référencement).</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-9" target="_blank" rel="noopener" class="rgaa-badge">9.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-9" target="_blank" rel="noopener" class="rgaa-badge">9.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'form-fields': {
      howToCheck: `<p>Pour tout champ de saisie, notamment dans les formulaires, contrôler que :</p>
<ul>
  <li>En cliquant sur les intitulés des champs, le curseur vient bien se positionner dans le champ concerné ;</li>
  <li>Les intitulés des champs sont accolés soit immédiatement au-dessus ou à gauche du champ ;</li>
  <li>Une mention est présente pour les champs dont la saisie est obligatoire, soit explicitement, soit par le biais d'une indication (souvent un astérisque) dont l'explication est donnée au début du formulaire ;</li>
  <li>Pour tout champ de formulaire présentant un type de donnée ou un format obligatoire, l'utilisateur est informé ;</li>
  <li>Tout message d'erreur identifie le champ concerné.</li>
</ul>`,
      why: `<p>L'association - visuellement et dans le code - entre l'intitulé, le champ concerné et les informations de saisie (type de donnée demandé, format, champ obligatoire…) évite l'agacement et l'incompréhension des utilisateurs. Elle leur permet d'identifier sans ambiguïté les champs de formulaire et la nature des informations à saisir, et ainsi de prévenir les erreurs. Elle améliore l'accessibilité en permettant l'utilisation des aides techniques (les lecteurs d'écran par exemple).</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.4<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.5<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.6<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.7<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.8<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.9<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.10<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.11<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-11" target="_blank" rel="noopener" class="rgaa-badge">11.13<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'download-info': {
      howToCheck: `<p>Pour chaque fichier proposé en téléchargement, contrôler que :</p>
<ul>
  <li>Le format est indiqué ;</li>
  <li>La taille est indiquée ;</li>
  <li>La langue, lorsque ce n'est pas la même que celle de la page, est indiquée ;</li>
  <li>Le nom du fichier permet d'en identifier le contenu et la provenance.</li>
</ul>`,
      why: `<p>Les utilisateurs - y compris ceux en situation de handicap - doivent savoir s'il est pertinent pour eux de télécharger les fichiers et si leurs outils le leur permettent.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-6" target="_blank" rel="noopener" class="rgaa-badge">6.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-6" target="_blank" rel="noopener" class="rgaa-badge">6.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'color-only': {
      howToCheck: `<p>Sur l'échantillon, vérifier que toutes les informations importantes sont accessibles sans faire appel à la seule couleur. Par exemple, si une erreur est indiquée uniquement par une couleur (rouge), il faut également un texte, une icône ou un symbole pour la signaler.</p>`,
      why: `<p>Certains utilisateurs peuvent avoir des difficultés à percevoir les couleurs (daltonisme par exemple). Il est donc important que toutes les informations soient accessibles sans faire appel à la seule couleur.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-3" target="_blank" rel="noopener" class="rgaa-badge">3.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'media-alternatives': {
      howToCheck: `<p>Sur l'échantillon, vérifier que :</p>
<ul>
  <li>Les images ont un attribut alt approprié (vide si l'image est décorative) ;</li>
  <li>Les vidéos ont des sous-titres ou une transcription ;</li>
  <li>Les fichiers audio ont une transcription ou une description.</li>
</ul>`,
      why: `<p>Les alternatives textuelles permettent aux utilisateurs de lecteurs d'écran et aux personnes qui ne peuvent pas percevoir les médias visuels ou auditifs d'accéder à l'information véhiculée par ces contenus.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-1" target="_blank" rel="noopener" class="rgaa-badge">1.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-1" target="_blank" rel="noopener" class="rgaa-badge">1.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-1" target="_blank" rel="noopener" class="rgaa-badge">1.3<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'language-defined': {
      howToCheck: `<p>Sur l'échantillon, vérifier que l'attribut lang est présent sur l'élément html et correspond à la langue principale du site.</p>`,
      why: `<p>La déclaration de la langue permet aux lecteurs d'écran de prononcer correctement le contenu. Elle améliore également la qualité du référencement.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-8" target="_blank" rel="noopener" class="rgaa-badge">8.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-8" target="_blank" rel="noopener" class="rgaa-badge">8.2<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'explicit-links': {
      howToCheck: `<p>Sur l'échantillon, vérifier que le libellé de chaque lien est explicite et permet de comprendre sa destination sans contexte (éviter les libellés comme "En savoir plus", "Cliquez ici", etc.).</p>`,
      why: `<p>Les liens doivent être compréhensibles hors contexte, notamment pour les utilisateurs de lecteurs d'écran qui peuvent naviguer de lien en lien sans avoir accès au contexte environnant.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-3" target="_blank" rel="noopener" class="rgaa-badge">3.1<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    },
    'text-resize': {
      howToCheck: `<p>Sur l'échantillon, augmenter la taille des caractères à 200% dans les paramètres du navigateur et vérifier que le contenu reste lisible et utilisable.</p>`,
      why: `<p>Certains utilisateurs ont besoin d'augmenter la taille du texte pour mieux lire le contenu. Il est important que le site reste fonctionnel même avec un texte plus grand.</p>`,
      rgaaCriteria: `<div class="rgaa-criteria-list">
  <a href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/#criteres-10" target="_blank" rel="noopener" class="rgaa-badge">10.11<span class="external-link-icon" aria-label="Lien externe">↗</span></a>
</div>`
    }
  };
  
  return contents[testId] || {
    howToCheck: t('docHowToCheckContent'),
    why: t('docWhyContent'),
    rgaaCriteria: t('docRGAACriteriaContent')
  };
}

// Initialiser les blocs de documentation
function initDocumentationBlocks() {
  document.querySelectorAll('.doc-toggle').forEach(button => {
    // Éviter les doubles événements
    if (button.hasAttribute('data-doc-initialized')) {
      return;
    }
    button.setAttribute('data-doc-initialized', 'true');
    
    button.addEventListener('click', () => {
      const contentId = button.getAttribute('id').replace('-toggle', '-content');
      const content = document.getElementById(contentId);
      const icon = button.querySelector('.doc-toggle-icon');
      const textSpan = button.querySelector('.doc-toggle-text');
      
      if (content) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
          content.style.display = 'none';
          button.setAttribute('aria-expanded', 'false');
          if (icon) icon.textContent = '▼';
          if (textSpan) textSpan.textContent = t('docShowDocumentation');
        } else {
          content.style.display = 'block';
          button.setAttribute('aria-expanded', 'true');
          if (icon) icon.textContent = '▲';
          if (textSpan) textSpan.textContent = t('docHideDocumentation');
        }
      }
    });
  });
}

// Afficher une popin avec un titre et un contenu
function showPopin(title, content) {
  const overlay = document.getElementById('popin-overlay');
  const titleElement = document.getElementById('popin-title');
  const bodyElement = document.getElementById('popin-body');
  
  if (overlay && titleElement && bodyElement) {
    titleElement.textContent = title;
    bodyElement.textContent = content;
    overlay.classList.add('active');
  }
}

// Fermer la popin
function closePopin() {
  const overlay = document.getElementById('popin-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Initialiser les événements de la popin (une seule fois au chargement)
function initPopinEvents() {
  const overlay = document.getElementById('popin-overlay');
  const closeButton = document.getElementById('popin-close');
  const okButton = document.getElementById('popin-ok');
  
  if (!overlay) return;
  
  // Éviter les doubles événements
  if (overlay.hasAttribute('data-popin-initialized')) {
    return;
  }
  overlay.setAttribute('data-popin-initialized', 'true');
  
  // Fermer avec le bouton ×
  if (closeButton) {
    closeButton.addEventListener('click', closePopin);
  }
  
  // Fermer avec le bouton OK
  if (okButton) {
    okButton.addEventListener('click', closePopin);
  }
  
  // Fermer en cliquant sur l'overlay (mais pas sur la modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePopin();
    }
  });
  
  // Fermer avec la touche Escape (gestion globale une seule fois)
  if (!window._popinEscapeHandler) {
    window._popinEscapeHandler = (e) => {
      if (e.key === 'Escape') {
        const activeOverlay = document.getElementById('popin-overlay');
        if (activeOverlay && activeOverlay.classList.contains('active')) {
          closePopin();
        }
      }
    };
    document.addEventListener('keydown', window._popinEscapeHandler);
  }
}

