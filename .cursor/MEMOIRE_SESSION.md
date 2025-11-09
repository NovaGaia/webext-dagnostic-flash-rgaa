# Mémoire de session - Extension Diagnostic Flash RGAA

**Date de création** : Session de développement  
**Référence principale** : https://design.numerique.gouv.fr/outils/diagnostic-flash/

---

## 📋 Vue d'ensemble du projet

Extension navigateur (Chrome/Firefox) pour réaliser le diagnostic flash d'accessibilité RGAA. L'extension s'affiche dans un panneau DevTools et permet de tester l'accessibilité d'un site web selon les critères du diagnostic flash RGAA.

**Technologies** : JavaScript vanilla, Manifest V3, DevTools API

---

## 🎯 Réalisations principales de cette session

### 0. Refactorisation de la structure des fichiers (Session récente)

**Problème identifié** : Les fichiers `visualizations/keyboard.js` et `visualizations/contrasts.js` n'étaient pas logiquement placés sous `tests/` alors qu'ils sont spécifiques à certains tests.

**Solution mise en place** :

1. **Déplacement de `keyboard.js`** :
   - `visualizations/keyboard.js` → `tests/navigation/keyboard-visualization.js`
   - Mieux aligné avec les tests de navigation clavier

2. **Division de `contrasts.js` (1941 lignes)** en 5 modules sous `tests/langage/contrasts/` :
   - **`utils.js`** (134 lignes) : Fonctions utilitaires de calcul et vérification WCAG
   - **`analyze.js`** (608 lignes) : Logique principale d'analyse du DOM
   - **`display.js`** (384 lignes) : Interface d'affichage des résultats dans le panneau
   - **`highlight.js`** (636 lignes) : Fonctions de mise en évidence sur la page
   - **`observer.js`** (120 lignes) : Gestion du MutationObserver pour auto-refresh

**Bénéfices** :
- Structure plus logique et organisée
- Fichiers plus petits et maintenables
- Séparation claire des responsabilités
- Suppression du dossier `visualizations/` (maintenant vide)

### 1. Affichage automatique du titre et H1

**Fichier** : `tests/structuration/page-title.js`

**Fonctionnalité ajoutée** : Affichage automatique des valeurs de `<title>` et du premier `<h1>` de la page dans la section d'information du test.

**Implémentation** :
- Utilisation de `chrome.devtools.inspectedWindow.eval()` pour récupérer les valeurs
- Affichage dans une zone stylisée sous le message d'information
- Messages explicites si les éléments ne sont pas trouvés
- Traductions ajoutées : `testPageTitleLabel`, `testPageTitleH1Label`, `testPageTitleNotFound`, `testPageTitleH1NotFound`

### 2. Option "Non applicable" pour tous les tests

**Fichiers modifiés** : Tous les fichiers de tests (`tests/**/*.js`), `utils/stats.js`, `panel.html`, `utils/i18n.js`

**Fonctionnalité ajoutée** : Possibilité de marquer chaque test comme "Non applicable" (au-delà de "Réussi", "Échoué", "Non-testé").

**Implémentation** :
- Ajout d'une 4ème option radio "Non applicable" dans chaque test
- Statut `'not-applicable'` géré dans toutes les fonctions `updateXxxStatus()`
- Compteur "Non applicables" ajouté dans les statistiques en haut de page
- Style CSS `.test-item.not-applicable` avec bordure grise et opacité réduite
- Les tests non applicables sont comptés séparément et inclus dans le diagramme circulaire

### 3. Score sur 100 et diagramme circulaire

**Fichiers modifiés** : `utils/stats.js`, `panel.html`, `utils/i18n.js`

**Fonctionnalités ajoutées** :

1. **Calcul du score sur 100** :
   - Algorithme : `Score = (nb_validés / (15 - nb_non_applicables)) * 100`
   - Constante `TOTAL_CRITERIA = 15` (nombre total de critères RGAA)
   - Affichage avec couleur dynamique selon le score :
     - ≥ 90 : Vert (#4caf50) - Excellent
     - ≥ 75 : Vert clair (#8bc34a) - Bon
     - ≥ 50 : Orange (#ff9800) - Moyen
     - < 50 : Rouge (#f44336) - Faible

2. **Diagramme circulaire (pie chart)** :
   - Visualisation SVG des 3 catégories : Réussis, Échoués, Non Applicable
   - Couleurs : Vert (#4caf50), Rouge (#f44336), Gris (#9e9e9e)
   - Légende dynamique affichant uniquement les catégories avec des tests
   - Mise à jour automatique à chaque changement de statut
   - Gestion du cas vide (cercle gris avec message)

### 4. Compteurs de progression par catégorie

**Fichiers modifiés** : `utils/stats.js`, `panel.html`

**Fonctionnalité ajoutée** : Affichage du nombre de tests validés sur le total pour chaque catégorie.

**Format d'affichage** : `(validé / total)` à côté du titre de chaque catégorie
- Exemple : Navigation & utilisation (4 / 4)
- Exemple : Langage & interface (5 / 7)
- Exemple : Structuration de l'information (3 / 4)

**Implémentation** :
- Ajout de `totalTests` dans chaque catégorie (navigation: 4, langage: 7, structuration: 4)
- Fonction `updateCategoryProgress()` qui calcule et affiche les compteurs
- Couleur verte si tous les tests sont validés
- Mise à jour automatique à chaque changement

### 5. Système de versioning et packaging avec Changesets

**Fichiers créés/modifiés** : 
- `.changeset/config.json` : Configuration Changesets
- `.changeset/README.md` : Documentation Changesets
- `.github/workflows/changesets.yml` : Workflow pour créer les PRs de version
- `.github/workflows/release.yml` : Workflow pour créer les releases GitHub
- `.github/workflows/package.yml` : Workflow pour package manuel
- `scripts/sync-version.js` : Synchronisation des versions entre `package.json` et `manifest.json`
- `scripts/package-chrome.js` : Script de packaging Chrome
- `scripts/package-firefox.js` : Script de packaging Firefox
- `package.json` : Scripts npm ajoutés
- `CHANGELOG.md` : Changelog généré automatiquement

**Fonctionnalités** :
- **Versioning automatique** avec Changesets
- **Packaging automatique** : Génération de `.zip` séparés pour Chrome et Firefox lors des releases
- **Synchronisation des versions** : Script qui synchronise `package.json`, `manifest.json` et `manifest-no-icons.json`
- **GitHub Actions** :
  - Création automatique de PR "Version Packages" quand des changesets sont mergés
  - Génération automatique de releases GitHub avec packages attachés
  - Package manuel déclenchable via l'interface GitHub Actions ou tags Git
- **Utilisation de pnpm** : Tous les workflows GitHub utilisent pnpm au lieu de npm

**Scripts disponibles** :
- `pnpm run changeset` : Créer un nouveau changeset
- `pnpm run version-packages` : Versionner les packages (via Changesets)
- `pnpm run version` : Synchroniser les versions
- `pnpm run package:chrome` : Créer le package Chrome
- `pnpm run package:firefox` : Créer le package Firefox
- `pnpm run package` : Créer les deux packages

**Workflow de release** :
1. Développement + création de changeset (`pnpm run changeset`)
2. PR avec changements + changeset → Merge dans `main`
3. GitHub Actions crée automatiquement un PR "chore: version packages"
4. Merge du PR de version → Création automatique :
   - Tag Git `vX.Y.Z`
   - CHANGELOG.md mis à jour
   - Release GitHub avec packages Chrome et Firefox attachés

### 6. Vue récapitulative en tableau des résultats

**Fichiers modifiés** : `utils/stats.js`, `panel.html`

**Fonctionnalité ajoutée** : Tableau récapitulatif affichant tous les tests avec leurs résultats.

**Structure du tableau** :
- **Colonne 1 - "Critères"** : Affiche `{Numéro}. {Nom du test}` pour chaque test (ex: "1. Le site est optimisé pour toutes les tailles d'écran")
- **Colonne 2 - "Résultat"** : Affiche OK (vert), KO (rouge), N/A (gris) ou "-" (non testé) selon le statut

**Implémentation** :
- Mapping des tests (`testsMapping`) avec numéro, nom et catégorie pour chaque test
- Fonction `updateSummaryTable()` qui génère le tableau dynamiquement
- Mise à jour automatique via `updateStats()`
- Styles CSS pour les couleurs et la mise en forme
- Une ligne par test (15 tests au total)

### 6.1. Export du diagramme circulaire en PNG

**Fichiers modifiés** : `utils/stats.js`, `panel.html`, `panel.js`, `utils/i18n.js`

**Fonctionnalité ajoutée** : Bouton d'export pour télécharger le diagramme circulaire :
- **Télécharger (PNG transparent)** : Télécharge le diagramme avec la légende au format PNG avec fond transparent

**Implémentation** :
- **Légende incluse dans l'export** :
  - La légende est maintenant incluse dans l'export avec les pourcentages et nombres de critères
  - Format : `{Label}: {nombre} ({pourcentage}%)` (ex: "Réussis: 5 (33%)")
  - Les données de la légende sont stockées dans l'attribut `data-legend` du SVG
- **Fonction `createExportSVG()`** :
  - Crée un SVG complet avec diagramme et légende
  - Paramètre `includeBackground` pour choisir le fond (false = transparent pour le téléchargement)
  - La légende est rendue en SVG avec carrés de couleur et texte
- **Fonction `downloadChartAsPNG()`** :
  - Télécharge le diagramme avec légende au format PNG transparent
  - Affiche un message de succès sur le bouton
- **Affichage de la légende** :
  - La légende dans l'interface affiche maintenant les pourcentages : `{Label}: {nombre} ({pourcentage}%)`
- Gestion des erreurs avec affichage visuel sur les boutons

**Traductions ajoutées** :
- `statsDownloadChart` : "Télécharger (PNG transparent)" / "Download (transparent PNG)"
- `statsDownloadChartSuccess` : "Diagramme téléchargé !" / "Chart downloaded!"
- `statsExportChartError` : "Erreur lors de l'export du diagramme" / "Error exporting chart"

**Améliorations de l'interface** :
- **Bouton avec icône Heroicons** : Le bouton d'export utilise maintenant une icône SVG Heroicons (ArrowDownTray) au lieu d'emoji
- **Taille et lisibilité améliorées** : Boutons agrandis (40x40px minimum) avec icônes blanches (20px) sur fond bleu pour meilleur contraste
- **Messages de feedback** : Les messages de succès/erreur sont affichés dans l'attribut `title` du bouton (tooltip) au lieu de modifier le texte

**Corrections apportées** :
- **Gestion d'erreur améliorée** : Les erreurs sont maintenant formatées correctement au lieu d'afficher `[object Object]` ou `[object DOMException]`
- **Gestion d'erreur dans le nettoyage** : Correction de la gestion d'erreur dans `cleanupMediaAlternativesVisualization()` pour afficher des messages d'erreur descriptifs
- **Suppression du copier-coller** : La fonctionnalité de copier-coller a été supprimée car elle était problématique dans les DevTools (permissions policy). Seul le téléchargement est disponible.

### 6.2. Export de la grille de statistiques en PNG

**Fichiers modifiés** : `utils/stats.js`, `panel.html`, `panel.js`

**Fonctionnalité ajoutée** : Bouton d'export pour télécharger la grille de statistiques 2x2 au format PNG transparent.

**Implémentation** :
- **Fonction `createStatsGridSVG()`** :
  - Crée un SVG avec uniquement la grille de statistiques 2x2
  - Format : Score (en plus gros) | Réussis / Échoués | Non applicables
  - Chaque cellule contient : icône SVG Heroicons (ChartBar, CheckCircle, XCircle, MinusCircle), valeur en gras, label
  - Layout : icône et valeur sur la même ligne (ligne 1), label en dessous (ligne 2)
  - Police sans-serif (Verdana) pour tous les textes
  - Paramètre `includeBackground` pour choisir le fond (false = transparent)
- **Fonction `downloadStatsAsPNG()`** :
  - Télécharge la grille au format PNG transparent
  - Affiche un message de succès dans le `title` du bouton
- **Positionnement des éléments** :
  - Ligne 1 : icône à gauche, valeur à droite (côte à côte)
  - Ligne 2 : label centré en dessous
  - Espacement vertical optimisé pour éviter les chevauchements
  - Utilisation de `dominant-baseline: middle` pour l'alignement vertical

**Bouton d'export** :
- Positionné en haut à droite de la section des statistiques
- Icône Heroicons ArrowDownTray (blanc, 20px)
- Taille minimale : 40x40px pour meilleure lisibilité

### 7. Système d'onglets (Audit / Scores)

**Fichiers modifiés** : `panel.html`, `panel.js`, `utils/stats.js`

**Fonctionnalité ajoutée** : Interface avec deux onglets pour organiser les fonctionnalités.

**Onglet "Audit"** (ouvert par défaut) :
- Section des compteurs (Total, Réussis, Échoués, Non applicables, Score)
- Bouton "Réinitialiser tous les tests"
- Les 3 catégories dépliables avec tous les tests, checkboxes et boutons d'analyse

**Onglet "Scores"** :
- Section des compteurs (identique à l'onglet Audit)
- Diagramme circulaire de répartition des résultats
- Tableau récapitulatif (Critères / Résultat)

**Implémentation** :
- Structure d'onglets avec CSS (bordure active, hover, etc.)
- Fonction `initTabs()` pour gérer le changement d'onglet
- Compteurs synchronisés dans les deux onglets via `updateStats()`
- Navigation fluide entre les onglets

### 8. Analyse des champs de formulaire

**Fichier** : `tests/structuration/form-fields.js`

**Fonctionnalité ajoutée** : Bouton d'analyse "Analyser les champs de formulaire (beta)" qui visualise les labels et inputs.

**Visualisation** :
- **Labels** : Bordure verte avec badge "Label"
- **Inputs** : 
  - Bordure bleue si lié à un label (badge "Input ✓")
  - Bordure rouge si non lié (badge "Input ✗")
  - Badge gris indiquant la méthode de liaison (for/id, wrapping, aria-labelledby, aria-label)

**Détection des liaisons** :
- `label[for]` + `input[id]`
- Input dans un `<label>` (wrapping)
- `aria-labelledby`
- `aria-label`

**Fonctionnalités techniques** :
- Mise à jour automatique au scroll et resize
- Nettoyage intégré dans `cleanupAllVisualizations()`
- Gestion des positions avec `position: fixed` et `getBoundingClientRect()`

### 9. Analyse des alternatives textuelles

**Fichier** : `tests/langage/media-alternatives.js`

**Fonctionnalité ajoutée** : Bouton d'analyse "Analyser les alternatives textuelles (beta)" qui détecte et affiche les alternatives textuelles des images, SVG, vidéos et audio.

**Visualisation** :
- **Bordure verte** si alternative présente ou si élément décoratif
- **Bordure rouge** si aucune alternative
- **Bulle (tooltip)** au-dessus de l'élément avec :
  - Le texte de l'alternative (limité à 100 caractères) ou "Décoratif" pour les éléments décoratifs
  - La méthode utilisée (alt, aria-label, aria-labelledby, title, svg-title, etc.)
- **Indicateur "Pas d'alternative"** pour les éléments sans alternative

**Détection des alternatives** :
- Pour les images : `alt`, `aria-labelledby`, `aria-label`, `title`
- Pour les SVG : `aria-labelledby`, `aria-label`, `title`, `<title>` dans le SVG, `role="img"` avec `aria-label`
- Pour les vidéos/audio : `aria-labelledby`, `aria-label`, `title`

**Détection des éléments décoratifs** :
- Éléments avec `role="presentation"` ou `role="none"` → considérés comme décoratifs (OK, pas besoin d'alternative)
- Éléments avec `aria-hidden="true"` → considérés comme décoratifs (OK, pas besoin d'alternative)
- Affichés avec bordure verte et bulle "Décoratif"

**Gestion de `aria-labelledby`** :
- Récupération du nom accessible de l'élément référencé selon les règles ARIA
- Ordre de priorité : `aria-label` → `aria-labelledby` (récursif) → `alt` (images) → `textContent`
- **Note importante** : `title` n'est PAS utilisé dans le calcul du nom accessible pour `aria-labelledby` (conforme aux spécifications ARIA)

**Fonctionnalités techniques** :
- Bulles positionnées avec `position: fixed` et `getBoundingClientRect()`
- Mise à jour automatique au scroll et resize (debounce 10ms)
- Ajustement automatique si la bulle dépasse les bords de l'écran
- Fonction `getAccessibleName()` pour calculer le nom accessible selon les règles ARIA
- Nettoyage intégré dans `cleanupAllVisualizations()`

### 10. Système d'icônes SVG Heroicons

**Fichiers créés/modifiés** : `utils/icons.js`, `panel.html`, `panel.js`, tous les fichiers de tests, `utils/i18n.js`

**Fonctionnalité ajoutée** : Remplacement complet de tous les emojis par des icônes SVG cohérentes basées sur Heroicons.

**Icônes créées** :
- **Catégories** : Compass (Navigation), Globe (Langage), Clipboard (Structuration)
- **Actions** : ArrowDownTray (Téléchargement), MagnifyingGlass (Vérification), Eye (Visualisation)
- **Statuts** : CheckCircle (✓), XCircle (✗), ExclamationTriangle (⚠, ▲), InformationCircle (ℹ️)
- **Statistiques** : ChartBar (Score), CheckCircle (Réussis), XCircle (Échoués), MinusCircle (Non applicables)

**Implémentation** :
- **Fichier `utils/icons.js`** : Bibliothèque centralisée de toutes les icônes Heroicons
  - Fonction `createHeroIcon()` : Crée une icône SVG avec viewBox 24x24 uniforme
  - Fonctions spécifiques pour chaque type d'icône (createNavigationIcon, createCheckIcon, etc.)
  - Fonction `replaceEmojisInMessage()` : Remplace automatiquement les emojis dans les messages par des icônes SVG
  - Fonction `createMessageWithIcons()` : Crée un élément DOM avec des icônes remplacées
- **Alignement des icônes dans les titres** :
  - CSS amélioré avec `display: flex` et `align-items: center` sur le parent
  - Utilisation de `gap: 8px` pour l'espacement
  - Icônes parfaitement alignées verticalement avec le texte
- **Remplacement dans tous les fichiers** :
  - Templates HTML initiaux : tous les emojis remplacés avec `replaceEmojisInMessage()`
  - Messages dynamiques : utilisation de `innerHTML` avec `replaceEmojisInMessage()` au lieu de `textContent`
  - Traductions : les emojis dans `utils/i18n.js` sont remplacés dynamiquement lors de l'affichage
- **Boutons d'export améliorés** :
  - Taille augmentée : `min-width: 40px`, `min-height: 40px`
  - Icônes blanches (20px) sur fond bleu pour meilleur contraste
  - Padding augmenté : `8px 12px` pour meilleure zone de clic

**Avantages** :
- Style cohérent : toutes les icônes utilisent le même viewBox (24x24) et stroke-width (2)
- Rendu vectoriel net à toutes les résolutions
- Pas de dépendance externe : icônes intégrées directement dans le code
- Homogénéité visuelle : toutes les icônes ont la même taille et le même style

**Emojis remplacés** :
- 🧭 → Compass (Navigation)
- 🌐 → Globe (Langage)
- 📋 → Clipboard (Structuration)
- 📥 → ArrowDownTray (Téléchargement)
- 🔍 → MagnifyingGlass (Vérification)
- 👁️ → Eye (Visualisation)
- ✓ → CheckCircle (Succès)
- ✗ → XCircle (Erreur)
- ▲ → ExclamationTriangle (Avertissement)
- ⚠ → ExclamationTriangle (Avertissement)
- ℹ️ → InformationCircle (Information)

### 11. Migration vers pnpm dans les workflows GitHub

**Fichiers modifiés** : `.github/workflows/release.yml`, `.github/workflows/package.yml`, `.github/workflows/changesets.yml`, `package.json`

**Modifications** :
- Ajout de l'étape "Setup pnpm" avec `pnpm/action-setup@v4`
- Configuration de `setup-node` avec `cache: 'pnpm'`
- Remplacement de `npm ci` par `pnpm install --frozen-lockfile`
- Remplacement de toutes les commandes `npm run` par `pnpm run`
- Création du script `version-all` dans `package.json` pour combiner `changeset version` et `sync-version.js`
- Correction du workflow `changesets.yml` : suppression du déclenchement sur `pull_request` (uniquement `push` vers `main`)

**Problèmes résolus** :
- L'action `changesets/action` ne peut pas exécuter de commandes avec `&&` directement dans le champ `version`, d'où la création du script `version-all`
- Le workflow se déclenchait sur `pull_request`, causant des erreurs de validation lors de la création de PR (branche de base invalide)

**Bénéfices** :
- Installation plus rapide grâce au cache pnpm
- Utilisation cohérente avec le développement local (présence de `pnpm-lock.yaml`)
- Meilleure gestion des dépendances avec pnpm
- Workflow changesets fonctionnel avec création correcte des PRs de version

### 12. Mise à jour proactive de la documentation par l'IA

**Fichier créé** : `.cursor/rules`

**Approche** : La mise à jour de la documentation (README.md et `.cursor/MEMOIRE_SESSION.md`) est maintenant faite de manière proactive par l'IA dans la conversation, après chaque modification validée par l'utilisateur.

**Mécanisme mis en place** :
- Fichier `.cursor/rules` contenant des instructions claires pour l'IA
- Règle critique : après chaque modification validée, l'IA DOIT mettre à jour la documentation
- Instructions détaillées sur ce qui doit être documenté et quand

**Principe** :
- Après chaque modification validée, l'IA met automatiquement à jour la mémoire avec :
  - Les nouvelles fonctionnalités ajoutées
  - Les corrections importantes apportées
  - Les changements de comportement
  - Les problèmes résolus
  - Les détails techniques importants
- Mise à jour dans la même réponse où les modifications sont faites
- Sans attendre que l'utilisateur le demande explicitement

**Avantages** :
- Pas de scripts automatiques complexes : la mise à jour sémantique nécessite une compréhension du contexte
- Documentation toujours à jour grâce aux règles dans `.cursor/rules`
- Approche simple et efficace

---

## 🎯 Réalisations principales de cette session (historique)

### 1. Système d'internationalisation (i18n)

**Fichier** : `utils/i18n.js`

- **Fonction principale** : `t(key, params)` pour récupérer les traductions avec support de paramètres
- **Fonctions utilitaires** : `setLanguage(lang)`, `getLanguage()`
- **Langues supportées** : 
  - Français (par défaut, complet)
  - Anglais (en cours, structure prête)
- **Utilisation** : Tous les textes de l'interface sont externalisés et utilisent `t('clé')`
- **Initialisation** : `initTranslations()` dans `panel.js` met à jour les éléments HTML avec attribut `data-i18n`

**Exemple d'utilisation** :
```javascript
t('validationPassed') // Retourne "✓ Réussi" ou "✓ Passed"
t('testKeyboardNavigationTotalCount', { total: 10 }) // Remplace {total} par 10
```

### 2. Blocs de documentation pliables

**Fichier** : `utils/ui.js`

**Fonction principale** : `createDocumentationBlock(testId, hasKeyboardInstructions)`

**Sections incluses** :
- "Comment contrôler ?" (`docHowToCheck`)
- "Comment navigue-t-on au clavier ?" (`docHowToNavigateKeyboard`) - uniquement pour le test de navigation clavier
- "Pourquoi ?" (`docWhy`)
- "Critère(s) RGAA concerné(s)" (`docRGAACriteria`)

**Fonctionnalités** :
- Bloc plié par défaut (`display: none`)
- Toggle avec icône ▼/▲ et texte "Afficher/Masquer la documentation"
- Contenu rempli depuis https://design.numerique.gouv.fr/outils/diagnostic-flash/
- Gestion via `initDocumentationBlocks()` avec prévention des doubles événements

**CSS** : 
- Badges arrondis pour les critères RGAA
- Liste horizontale avec `flex-wrap`
- Styles pour les liens externes avec icônes

### 3. Structure modulaire des tests

Organisation en fichiers séparés : `tests/category/test-name.js`

#### Catégorie "Navigation & utilisation" (4 tests)

1. **`tests/navigation/responsive-design.js`**
   - Test : Le site est optimisé pour toutes les tailles d'écran
   - Fonctionnalités : Vérifications automatiques (viewport, overflow, éléments) + bouton simulation mobile
   - Validation : 3 options (Réussi, Échoué, Non-testé)

2. **`tests/navigation/keyboard-navigation.js`**
   - Test : La navigation et l'utilisation du site peuvent s'effectuer entièrement au clavier
   - Fonctionnalités : Visualisation de l'ordre de tabulation avec indicateurs numérotés et lignes SVG
   - Spécificités : 
     - Bouton "Activer la visualisation"
     - Checkbox "Afficher les éléments masqués"
     - Gestion du scroll/resize avec debounce
     - Détection et style différent pour éléments masqués
     - Cleanup automatique à la fermeture des DevTools

3. **`tests/navigation/two-navigation-means.js`**
   - Test : Deux moyens de navigation sont présents
   - Validation : Manuelle uniquement

4. **`tests/navigation/downloadable-files.js`**
   - Test : Les fichiers bureautiques téléchargeables sont proposés dans un format ouvert
   - Fonctionnalités : Détection automatique des fichiers (.doc, .docx, .pdf, .odt, etc.)
   - Affichage : Compteurs de formats ouverts/fermés

#### Catégorie "Langage & interface" (7 tests)

1. **`tests/langage/contrasts.js`**
   - Test : Les contrastes sont suffisants
   - Fonctionnalités : Analyse automatique complète des contrastes WCAG (1.4.3, 1.4.6, 1.4.11)
   - Interface : Bouton "Analyser les contrastes (beta)", tableau de résultats interactif, contrôles WCAG level/auto-refresh
   - Validation : Manuelle (basée sur les résultats de l'analyse automatique)

2. **`tests/langage/color-only.js`**
   - Test : Aucune information n'est véhiculée uniquement par la couleur
   - Validation : Manuelle uniquement

3. **`tests/langage/media-alternatives.js`**
   - Test : Les images, les vidéos et les fichiers audio ont une alternative textuelle
   - Fonctionnalités : Bouton d'analyse "Analyser les alternatives textuelles (beta)" qui affiche les alternatives dans des bulles
   - Validation : Manuelle (avec assistance de l'analyse visuelle)

4. **`tests/langage/language-defined.js`**
   - Test : La langue principale du site est bien définie
   - Validation : Manuelle uniquement

5. **`tests/langage/explicit-links.js`**
   - Test : Les liens sont explicites
   - Validation : Manuelle uniquement

6. **`tests/langage/text-resize.js`**
   - Test : Le contenu reste lisible lorsque la taille de caractères est portée à 200%
   - Validation : Manuelle uniquement

7. **`tests/langage/animations.js`**
   - Test : Les animations, clignotements et sons sont contrôlables
   - Validation : Manuelle uniquement

#### Catégorie "Structuration de l'information" (4 tests)

1. **`tests/structuration/page-title.js`**
   - Test : Le titre de la page est unique et pertinent
   - Fonctionnalités : Affichage automatique du contenu de `<title>` et du premier `<h1>` de la page
   - Validation : Manuelle (avec affichage des valeurs détectées)

2. **`tests/structuration/headings-hierarchy.js`**
   - Test : La hiérarchie des titres est complète et cohérente
   - Validation : Manuelle (avec référence à l'extension HeadingsMap)

3. **`tests/structuration/form-fields.js`**
   - Test : Chaque champ de formulaire est clairement associé à son intitulé
   - Fonctionnalités : Bouton d'analyse "Analyser les champs de formulaire (beta)" qui visualise les labels et inputs avec bordures et badges
   - Validation : Manuelle (avec assistance de l'analyse visuelle)

4. **`tests/structuration/download-info.js`**
   - Test : Les informations relatives aux fichiers proposés en téléchargement sont indiqués
   - Validation : Manuelle uniquement

**Structure commune de chaque test** :
```javascript
function testXxx() {
  // Création du HTML avec t() pour traductions
  // Intégration du bloc de documentation
  // Écouteurs pour validation
}

function updateXxxStatus(testId, validationValue) {
  // Mise à jour du statut (passed/failed/not-tested)
  // Mise à jour de categories.X.tests[]
  // Appel à updateStats()
}
```

### 4. Mise en forme des critères RGAA

**Fichier** : `panel.html` (CSS) et `utils/ui.js` (HTML)

**Style des badges** :
- Affichage horizontal avec `display: flex` et `flex-wrap`
- Badges arrondis : `border-radius: 16px`, fond `#f0f0f0`
- Icône externe `↗` sur chaque badge
- Effet hover : fond plus foncé et couleur bleue
- Gap de 8px entre les badges

**Exemple HTML généré** :
```html
<div class="rgaa-criteria-list">
  <a href="..." class="rgaa-badge">13.9<span class="external-link-icon">↗</span></a>
</div>
```

### 5. Indicateurs de liens externes

**Classes CSS** : `.external-link` et `.external-link-icon-inline`

**Fonctionnalités** :
- Icône `↗` après chaque lien externe dans la documentation
- Couleur synchronisée avec le lien (bleu)
- Appliquée automatiquement aux liens avec `target="_blank"` dans la documentation
- Attribut `aria-label="Lien externe"` pour l'accessibilité

### 6. Structure des fichiers utilitaires

#### `utils/i18n.js`
- Système de traduction complet
- Support des paramètres dans les chaînes (`{param}`)
- Langue par défaut : français

#### `utils/stats.js`
- Gestion de l'objet `categories` (structure pour toutes les catégories)
- Mapping des tests (`testsMapping`) : associe chaque test à un numéro, nom et catégorie
- Fonction `updateStats()` : calcule et affiche total, réussis, échoués, score, diagramme et tableau récapitulatif
- Fonction `updateSummaryTable()` : génère le tableau récapitulatif des résultats
- Fonction `updatePieChart()` : dessine le diagramme circulaire SVG
- Fonction `updateCategoryProgress()` : met à jour les compteurs de progression par catégorie
- Fonction `resetResults()` : remet à zéro tous les tests
- Fonction `displayTest()` : ajoute dynamiquement un test (rarement utilisé maintenant)
- Fonction `showError()` : affiche les erreurs

#### `utils/ui.js`
- `initCategories()` : initialise les toggles des catégories collapsibles
- `toggleCategory()` : ouvre/ferme une catégorie
- `createDocumentationBlock()` : génère le HTML d'un bloc de documentation
- `getDocumentationContent()` : retourne le contenu spécifique pour chaque test
- `initDocumentationBlocks()` : initialise les toggles des blocs de documentation

#### `utils/cleanup.js`
- `cleanupAllVisualizations()` : nettoie toutes les visualisations actives
  - Visualisation clavier (keyboard)
  - Mise en évidence des contrastes
  - Visualisation des titres (headings)
  - Visualisation des landmarks
  - Visualisation des champs de formulaire (form-fields)
  - Visualisation des alternatives textuelles (media-alternatives)
- Appelée depuis `devtools.js` quand le panneau DevTools est caché (`panel.onHidden`)

#### `tests/navigation/keyboard-visualization.js`
- `toggleKeyboardVisualization(testId, isActive, showHidden)` : active/désactive la visualisation
- Fonctionnalités :
  - Détection de tous les éléments focusables
  - Tri par ordre de tabulation (tabindex + ordre DOM)
  - Création de badges numérotés avec `position: fixed`
  - Dessin de lignes SVG entre les éléments
  - Gestion du scroll/resize avec debounce
  - Détection et style des éléments masqués
  - Positionnement des éléments masqués à leur future position

#### Modules contrastes (`tests/langage/contrasts/`)
La logique d'analyse des contrastes a été divisée en 5 modules pour améliorer la maintenabilité :

- **`utils.js`** : Fonctions utilitaires (calculateContrastRatio, hexToRgb, getLuminance, meetsWCAGAA/AAA, meetsNonTextContrast, createColorSwatch, countTags, getAverageColor)
- **`analyze.js`** : Fonction principale `analyzeContrasts` (analyse exhaustive du DOM, détection des éléments textuels et non-textuels, comptage des éléments cachés)
- **`display.js`** : Fonction `displayContrastAnalysis` (affichage du tableau des résultats, contrôles WCAG level/auto-refresh, résumé)
- **`highlight.js`** : Fonctions de mise en évidence (`highlightContrastElements`, `highlightNonTextElements`, `cleanupContrastHighlighting`)
- **`observer.js`** : Variables globales et fonctions `startContrastMutationObserver`, `stopContrastMutationObserver` pour l'auto-refresh sur changement du DOM

**Fonctionnalités détaillées de l'analyse des contrastes** :

**Critères WCAG implémentés** :
- **1.4.3 Contrast (Minimum) - AA** : Ratio 4.5:1 pour texte normal, 3:1 pour texte large
- **1.4.6 Contrast (Enhanced) - AAA** : Ratio 7:1 pour texte normal, 4.5:1 pour texte large
- **1.4.11 Non-text Contrast - AA** : Ratio 3:1 pour bordures de composants UI et icônes SVG

**Analyse automatique** :
- Parcours exhaustif de tous les éléments du DOM (`document.querySelectorAll('*')`)
- Détection des éléments textuels (1.4.3/1.4.6) : filtrage selon la logique de l'extension WCAG Color Contrast Checker
- Détection des éléments non-textuels (1.4.11) : bordures des composants interactifs et icônes SVG
- Calcul de la visibilité selon plusieurs critères : `display: none`, `visibility: hidden`, attribut `hidden`, éléments hors écran, éléments dans `<details>` fermé
- Exclusion systématique des conteneurs génériques (`div`, `section`, `article`, `header`, `footer`, `nav`, `main`, `aside`, `form`)
- Exclusion des tags spécifiques : `script`, `noscript`, `hr`, `br`, `table`, `tbody`, `thead`, `tfoot`, `tr`, `option`, `ul`, `ol`, `dl`, `style`, `link`, `iframe`, etc.
- Comptage précis des éléments cachés (avant les filtres, comme l'extension WCAG)

**Interface d'affichage** :
- Tableau des éléments visibles avec colonnes : Contraste, Taille, Éléments
- Affichage des swatches de couleur (foreground et background) pour chaque résultat
- Section "Hidden elements" : uniquement un compteur (pas de détail, car invisibles)
- Résumé par taille (small/large) avec statut AA et AAA
- Contrôles : sélection WCAG level (AA/AAA), auto-refresh sur changement DOM, bouton "Relancer l'analyse"
- Mise en évidence visuelle : clic sur une ligne pour mettre en évidence les éléments correspondants sur la page avec bordure rouge

**Fonctionnalités techniques** :
- Gestion du texte : extraction via `getElementText()` avec normalisation des espaces, gestion des images alt, gestion des guillemets spéciaux
- Calcul de la taille du texte : "large" si `fontSize >= 18.66px` ou (`fontSize >= 14px` ET `fontWeight >= 700`)
- Remontée de la hiérarchie pour le fond : recherche du premier fond opaque en remontant jusqu'au body
- Filtrage des ratios invalides : exclusion des ratios <= 1.01 (couleurs identiques)
- Mise en évidence intelligente : parcours inverse du DOM pour prioriser les éléments les plus spécifiques, exclusion des parents si les enfants correspondent
- Auto-refresh : `MutationObserver` injecté dans la page pour détecter les changements DOM, vérification périodique avec debounce de 500ms

**Alignement avec l'extension WCAG Color Contrast Checker** :
- Analyse du code minifié de l'extension WCAG pour comprendre la logique exacte
- Filtrage des éléments identique (exclusion des conteneurs, mêmes tags exclus)
- Comptage des éléments cachés avant les filtres (comme l'extension)
- Affichage consolidé : une seule section "Visible elements" avec éléments textuels et non-textuels, un seul compteur pour les éléments cachés
- Correspondance des quantités détectées avec l'extension de référence

### 7. Points techniques importants

#### Système de validation
- 4 options disponibles : "Réussi", "Échoué", "Non-testé", "Non applicable"
- Radio buttons avec `name="test-{testId}-validation"`
- Lorsque "Non-testé" est sélectionné, le test est retiré de `categories.X.tests[]` pour ne pas être compté
- Lorsque "Réussi", "Échoué" ou "Non applicable" est sélectionné, le test est ajouté/mis à jour dans `categories.X.tests[]`

#### Statistiques
- Compteurs globaux : Total, Réussis, Échoués, Non applicables
- Score sur 100 : Calculé avec l'algorithme `(nb_validés / (15 - nb_non_applicables)) * 100`
- Diagramme circulaire : Visualisation SVG des proportions (Réussis, Échoués, Non Applicable)
- Compteurs par catégorie : Affichage `(validé / total)` à côté du titre de chaque catégorie
- Mis à jour automatiquement via `updateStats()` après chaque changement
- Calculé depuis `categories.navigation.tests`, `categories.langage.tests`, `categories.structuration.tests`

#### Gestion de l'état
- Bouton "Réinitialiser tous les tests" :
  - Nettoie toutes les visualisations
  - Remet tous les radio buttons à "Non-testé"
  - Réinitialise les classes CSS des tests
  - Relance tous les tests pour réafficher l'interface

#### Tests automatiques vs manuels
- **Tests avec vérifications automatiques** :
  - `responsive-design` : vérifie viewport, overflow, éléments accessibles
  - `keyboard-navigation` : visualisation interactive
  - `downloadable-files` : détection automatique des fichiers
- **Tests purement manuels** : tous les autres (validation utilisateur uniquement)

#### Visualisation clavier
- Badges positionnés avec `position: fixed` + `getBoundingClientRect()`
- Mise à jour au scroll/resize avec debounce (performance)
- Lignes SVG redessinées à chaque update
- Éléments masqués : style orange, bordure pointillée, icône œil
- Option pour afficher/masquer les éléments masqués

### 8. Référence source officielle

**URL** : https://design.numerique.gouv.fr/outils/diagnostic-flash/

Tous les contenus proviennent de cette page :
- Noms des tests
- Descriptions
- Contenu de la documentation ("Comment contrôler ?", "Pourquoi ?")
- Critères RGAA concernés
- Liens vers les extensions recommandées

---

## 📁 Structure actuelle du projet

```
webext-dagnostic-flash-rgaa/
├── manifest.json              # Configuration Manifest V3
├── background.js              # Service worker
├── devtools.html              # Point d'entrée DevTools
├── devtools.js                # Création du panneau DevTools
├── panel.html                 # Interface du panneau (HTML + CSS) avec système d'onglets
├── panel.js                   # Orchestration principale (gestion des onglets)
├── generate-icons.js          # Script de génération d'icônes
├── icons/                     # Icônes de l'extension
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── utils/
│   ├── i18n.js               # Système de traduction
│   ├── icons.js            # Système d'icônes SVG Heroicons
│   ├── stats.js            # Gestion des statistiques
│   ├── ui.js               # Interface (catégories, documentation)
│   └── cleanup.js          # Nettoyage des visualisations
├── tests/
│   ├── navigation/
│   │   ├── responsive-design.js
│   │   ├── keyboard-navigation.js
│   │   ├── keyboard-visualization.js  # Visualisation navigation clavier
│   │   ├── two-navigation-means.js
│   │   └── downloadable-files.js
│   ├── langage/
│   │   ├── contrasts.js
│   │   ├── contrasts/                  # Modules pour l'analyse des contrastes
│   │   │   ├── utils.js                # Utilitaires (calculs, vérifications WCAG)
│   │   │   ├── analyze.js              # Analyse principale du DOM
│   │   │   ├── display.js               # Affichage des résultats
│   │   │   ├── highlight.js             # Mise en évidence des éléments
│   │   │   └── observer.js              # MutationObserver pour auto-refresh
│   │   └── animations.js
│   └── structuration/
│       ├── page-title.js
│       ├── headings-hierarchy.js
│       ├── form-fields.js
│       └── download-info.js
├── README.md
├── QUICKSTART.md
└── LICENSE
```

---

## 🎨 Design et UX

### Style visuel
- Couleurs principales : Bleu (#1976d2), Vert (#4caf50) pour succès, Rouge (#f44336) pour échecs
- Badges RGAA : fond gris clair (#f0f0f0), coins arrondis
- Documentation : fond gris clair (#f9f9f9) avec bordure gauche bleue
- Tests : bordures colorées selon le statut (vert pour passé, rouge pour échoué)

### Interactivité
- Catégories collapsibles avec icône ▶/▼
- Blocs de documentation pliables
- Boutons avec états hover
- Radio buttons pour validation
- Checkbox pour afficher/masquer éléments masqués (navigation clavier)

---

## 🔧 Fonctionnalités clés

### Tests implémentés

#### Navigation & utilisation (4/4)
- ✅ Responsive design (avec vérifications auto)
- ✅ Navigation clavier (avec visualisation interactive)
- ✅ Deux moyens de navigation
- ✅ Fichiers téléchargeables (avec détection auto)

#### Langage & interface (7/7)
- ✅ Contrastes (beta)
- ✅ Information par la couleur
- ✅ Alternatives média
- ✅ Langue principale
- ✅ Liens explicites
- ✅ Taille de texte 200%
- ✅ Animations contrôlables

#### Structuration de l'information (4/4)
- ✅ Titre de page
- ✅ Hiérarchie des titres
- ✅ Champs de formulaire
- ✅ Informations fichiers téléchargement

### Fonctionnalités techniques

- ✅ Système i18n complet (FR/EN)
- ✅ Documentation pliable pour chaque test
- ✅ Badges RGAA horizontaux avec icônes
- ✅ Indicateurs liens externes
- ✅ Statistiques automatiques
- ✅ Réinitialisation complète
- ✅ Visualisation interactive (navigation clavier)
- ✅ Cleanup automatique à la fermeture DevTools
- ✅ Gestion des éléments masqués
- ✅ Analyse automatique des contrastes WCAG (1.4.3, 1.4.6, 1.4.11)
- ✅ Mise en évidence interactive des éléments avec problèmes de contraste
- ✅ Auto-refresh des contrastes sur changement du DOM (MutationObserver)
- ✅ Affichage automatique du titre et H1 de la page
- ✅ Option "Non applicable" pour tous les tests (4 options de validation)
- ✅ Score sur 100 avec calcul automatique
- ✅ Diagramme circulaire pour visualiser la répartition des résultats
- ✅ Compteurs de progression par catégorie
- ✅ Système de versioning avec Changesets
- ✅ Packaging automatique Chrome et Firefox via GitHub Actions
- ✅ Vue récapitulative en tableau des résultats (Critères / Résultat)
- ✅ Système d'onglets (Audit / Scores)
- ✅ Analyse des champs de formulaire avec visualisation des labels et inputs
- ✅ Analyse des alternatives textuelles avec bulles d'information
- ✅ Migration vers pnpm dans les workflows GitHub
- ✅ Export du diagramme circulaire en PNG (téléchargement transparent)
- ✅ Export de la grille de statistiques en PNG (2x2 avec pictogrammes)
- ✅ Système d'icônes SVG Heroicons (remplacement complet des emojis)
- ✅ Alignement parfait des icônes dans les titres de catégories
- ✅ Boutons d'export améliorés (taille et lisibilité)

---

## 📝 Notes importantes

### Gestion de l'état "Non-testé"
Quand un test revient à "Non-testé", il est explicitement retiré du tableau `categories.X.tests[]` avec `splice()`. Cela garantit qu'il n'est pas compté dans les statistiques.

### Ordre de chargement des scripts
Dans `panel.html`, l'ordre est important :
1. `utils/i18n.js` (d'abord pour que `t()` soit disponible)
2. `utils/icons.js` (pour que les fonctions d'icônes soient disponibles)
3. `utils/cleanup.js`, `utils/stats.js`, `utils/ui.js`
4. `tests/navigation/keyboard-visualization.js` (visualisations)
5. Modules contrastes (dans l'ordre de dépendance) :
   - `tests/langage/contrasts/utils.js`
   - `tests/langage/contrasts/analyze.js`
   - `tests/langage/contrasts/display.js`
   - `tests/langage/contrasts/highlight.js`
   - `tests/langage/contrasts/observer.js`
6. Tous les tests
7. `panel.js` (en dernier)

### IDs des éléments de documentation
Pour chaque test, les IDs des sections sont :
- `${testId}-how-check` → "Comment contrôler ?"
- `${testId}-how-keyboard` → "Comment navigue-t-on au clavier ?" (si applicable)
- `${testId}-why` → "Pourquoi ?"
- `${testId}-rgaa-criteria` → "Critère(s) RGAA concerné(s)"

Ces IDs permettent de mettre à jour le contenu dynamiquement si nécessaire.

### Visualisation clavier - points techniques
- Utilise `position: fixed` pour les badges (restent visibles au scroll)
- Calcul des positions avec `getBoundingClientRect()` (viewport-relative)
- Debounce de 100ms pour les updates au scroll/resize
- SVG pour les lignes (redessinées à chaque update)
- Pour éléments masqués : tentative de positionnement via parent temporairement visible

---

## 🐛 Corrections importantes effectuées

### Corrections de bugs

1. **Compteur "total tests"** : Fix du bug où le compteur restait à 1 quand un test revenait à "non-testé" (correction dans `updateTestStatus`)

2. **Erreurs `[object Object]`** : Amélioration de l'extraction des messages d'erreur depuis les objets `isException` (utilisation de `value`, `description`, `message`, `toString()`)

3. **Erreurs de syntaxe regex** : Correction des patterns regex incomplets dans les fonctions `rgbToHex` injectées (ajout de parenthèses manquantes)

4. **Gestion des guillemets spéciaux** : Remplacement des guillemets typographiques dans les regex par des classes Unicode pour éviter les erreurs de parsing

5. **Normalisation des espaces** : Utilisation de `String.fromCharCode` et `split/join` au lieu de regex pour éviter les problèmes d'échappement dans les scripts injectés

6. **Filtrage des conteneurs** : Exclusion systématique de tous les conteneurs génériques (`div`, `section`, etc.) pour aligner avec l'extension WCAG

7. **Comptage des éléments cachés** : Correction pour compter TOUS les éléments cachés avant les filtres, exactement comme l'extension WCAG

8. **Mise en évidence précise** : Implémentation du parcours inverse du DOM pour prioriser les éléments les plus spécifiques (texte) plutôt que leurs conteneurs

9. **Gestion des erreurs dans les visualisations** : Amélioration de l'extraction des messages d'erreur depuis les objets `isException` dans les fonctions d'analyse (form-fields, media-alternatives) avec extraction de `value`, `description`, `message`, `toString()` et affichage de la stack trace si disponible

10. **Erreurs de syntaxe dans le code injecté** : Correction des problèmes d'échappement des apostrophes dans les chaînes de caractères du code injecté (utilisation de `String.fromCharCode(39)` pour éviter les conflits d'échappement)

### Alignements avec l'extension WCAG Color Contrast Checker

- Analyse du code minifié de l'extension pour comprendre la logique exacte
- Filtrage identique des éléments (tags exclus, conteneurs exclus)
- Comptage des éléments cachés identique (avant filtres)
- Structure d'affichage alignée : une section "Visible elements" consolidée + compteur cachés
- Quantités détectées correspondantes

---

## 🚀 Prochaines étapes possibles

1. **Fonctionnalités d'assistance** : Ajouter des outils pour aider l'utilisateur à valider certains tests manuels
2. **Vérifications automatiques supplémentaires** : Implémenter des checks automatiques pour d'autres tests
3. **Traductions complètes** : Finaliser les traductions anglaises
4. **Améliorations UX** : Améliorer les visualisations, animations, feedback utilisateur
5. **Export des résultats** : Permettre d'exporter un rapport des tests effectués
6. **Persistance** : Sauvegarder les résultats entre sessions
7. **Optimisation performance** : Améliorer les performances de l'analyse des contrastes sur les grandes pages

---

## 📚 Documentation externe

- **Référentiel RGAA** : https://www.numerique.gouv.fr/publications/rgaa-accessibilite/
- **Diagnostic Flash** : https://design.numerique.gouv.fr/outils/diagnostic-flash/
- **Extensions recommandées** :
  - HeadingsMap : https://chrome.google.com/webstore/detail/headingsmap/
  - Contrast Checker : https://chrome.google.com/webstore/detail/contrast-checker/

---

## 💡 Points d'attention pour développement futur

1. **Performance** : La visualisation clavier peut être lourde avec beaucoup d'éléments. Le debounce est crucial.
2. **Accessibilité** : L'extension elle-même doit être accessible (utilise déjà `aria-label`, `aria-expanded`)
3. **Compatibilité** : Fonctionne sur Chrome et Firefox (Manifest V3)
4. **Versioning** : Utiliser `pnpm run changeset` avant chaque PR contenant des changements
5. **Packaging** : Les packages sont générés automatiquement lors des releases GitHub
6. **Maintenance** : Structure modulaire facilite l'ajout de nouveaux tests
7. **Traductions** : Tous les textes doivent passer par `t()` pour faciliter l'ajout de nouvelles langues

---

## 📊 Détails techniques récents

### Système de statistiques étendu

**Structure des catégories** (`utils/stats.js`) :
```javascript
const categories = {
  navigation: { tests: [], totalTests: 4 },
  langage: { tests: [], totalTests: 7 },
  structuration: { tests: [], totalTests: 4 }
};
```

**Fonctions principales** :
- `updateStats()` : Met à jour tous les compteurs globaux, le score et le diagramme
- `updateCategoryProgress()` : Met à jour les compteurs de progression par catégorie
- `updatePieChart()` : Dessine le diagramme circulaire SVG avec légende

### Validation étendue

**Statuts possibles** :
- `'passed'` : Test réussi (vert)
- `'failed'` : Test échoué (rouge)
- `'not-applicable'` : Test non applicable (gris, opacité réduite)
- `''` (vide) : Non testé (retiré du comptage)

**Comptage** :
- Les tests "Non applicables" sont comptés séparément
- Ils sont inclus dans le total validé pour le calcul du score
- Ils sont exclus du dénominateur du score (15 - nb_non_applicables)

### Format d'affichage des compteurs de catégorie

**Format simplifié** : `(validé / total)` à côté du titre de chaque catégorie
- Couleur verte automatique quand tous les tests sont validés
- Mise à jour en temps réel lors des changements de statut

---

*Mémoire créée automatiquement pour faciliter la continuité du développement.*

