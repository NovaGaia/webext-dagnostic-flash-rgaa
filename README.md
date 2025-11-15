# Diagnostic Flash RGAA - Extension Navigateur

Extension Chrome et Firefox pour réaliser les diagnostics flash d'accessibilité selon le référentiel RGAA.

## 🚀 Installation

### Développement (installation immédiate)

L'extension est prête à être testée ! Suivez ces étapes :

#### Chrome

1. Ouvrez `chrome://extensions/`
2. Activez le **Mode développeur** (toggle en haut à droite)
3. Cliquez sur **Charger l'extension non empaquetée**
4. Sélectionnez ce dossier du projet
5. ✅ L'extension est chargée !

#### Firefox

Firefox nécessite Manifest V2 avec `background.scripts` au lieu de Manifest V3 avec `background.service_worker`.

**Option 1 : Utiliser le script de basculement (recommandé)**

```bash
# Basculer vers le manifest Firefox
pnpm run switch:firefox
# ou
npm run switch:firefox

# Puis dans Firefox :
# 1. Ouvrez `about:debugging`
# 2. Cliquez sur **Ce Firefox** dans le menu de gauche
# 3. Cliquez sur **Charger un module complémentaire temporaire**
# 4. Naviguez jusqu'à ce dossier et sélectionnez `manifest.json`
# 5. ✅ L'extension est chargée !

# Pour revenir à Chrome :
pnpm run switch:chrome
# ou
npm run switch:chrome
```

**Option 2 : Renommer manuellement**

1. Renommez `manifest.json` en `manifest-chrome.json`
2. Renommez `manifest-firefox.json` en `manifest.json`
3. Chargez l'extension dans Firefox avec `manifest.json`
4. Restaurez les noms originaux après les tests

> **Note** : Firefox utilise Manifest V2 avec `background.scripts` et `browser_action` au lieu de Manifest V3 avec `background.service_worker` et `action`.

### Production

Générer les packages pour publication :

```bash
pnpm run package           # Les deux packages (Chrome + Firefox)
pnpm run package:chrome    # Package Chrome uniquement
pnpm run package:firefox   # Package Firefox uniquement
```

Les fichiers `.zip` seront créés à la racine du projet :
- `diagnostic-flash-rgaa-chrome-vX.Y.Z.zip`
- `diagnostic-flash-rgaa-firefox-vX.Y.Z.zip`

## 🎨 Génération des icônes

Générer les icônes depuis un fichier SVG source :

```bash
pnpm run generate-icons
```

> **Note** : Les icônes sont optionnelles. L'extension fonctionne sans icônes (elle utilisera l'icône par défaut du navigateur).

## 🧪 Tester l'extension

1. Ouvrez n'importe quelle page web (ex: https://example.com)
2. Ouvrez les **DevTools** (F12 ou Cmd+Option+I / Ctrl+Shift+I)
3. Cherchez l'onglet **"Diagnostic Flash RGAA"** dans les DevTools
4. Cliquez dessus pour voir le panneau de l'extension
5. Les tests s'exécutent automatiquement au chargement
6. Validez manuellement chaque test selon les critères RGAA

### Accès rapide

- **Menu contextuel** : Clic droit sur la page → "Ouvrir Diagnostic Flash RGAA"
- **Icône de l'extension** : Cliquez sur l'icône dans la barre d'outils

> **Note** : L'ouverture programmatique des DevTools est limitée par les navigateurs. Une notification vous indiquera le raccourci clavier à utiliser selon votre système d'exploitation.

## ✨ Fonctionnalités

- **Dark mode** : Détection automatique de la préférence système, adaptation complète des couleurs
- **Responsive design** : Interface adaptée aux tablettes et mobiles
- **Export des résultats** : 
  - Téléchargement du diagramme circulaire (diagramme + légende) en PNG transparent
  - Téléchargement de la grille de statistiques (score "X/100", répartition des résultats) en PNG transparent
- **Options de validation** : Pour chaque critère, possibilité de marquer comme "Réussi", "Échoué", "Non applicable" ou "Dérogation"
- **Statistiques détaillées** : Affichage séparé des dérogations dans les indicateurs de score et le diagramme circulaire
- **Visualisations interactives** : Analyse des champs de formulaire et des alternatives textuelles avec mise en évidence visuelle
- **Système d'icônes SVG** : Interface cohérente avec des icônes Heroicons
- **Architecture modulaire** : Code organisé en modules séparés (CSS, visualisations, tests) pour une meilleure maintenabilité

## 📦 Versioning et Releases

Ce projet utilise [Changesets](https://github.com/changesets/changesets) pour gérer le versioning et les releases automatiques.

### Ajouter un changeset

Lorsque vous apportez des modifications qui nécessitent un changement de version :

```bash
pnpm run changeset
```

Cela vous guidera pour :
1. Sélectionner le type de changement (major, minor, patch)
2. Décrire les changements dans un fichier markdown

### Publier une nouvelle version

1. Créez un PR avec vos changements et changesets
2. Mergez le PR dans `main`
3. Un workflow GitHub Actions créera automatiquement un PR "chore: version packages"
4. Mergez ce PR pour :
   - Créer un tag Git avec la nouvelle version (`vX.Y.Z`)
   - Générer le `CHANGELOG.md`
   - Créer une release GitHub avec les packages Chrome et Firefox

### Packages de release

Les packages sont automatiquement générés et attachés à chaque release GitHub :
- `diagnostic-flash-rgaa-chrome-vX.Y.Z.zip`
- `diagnostic-flash-rgaa-firefox-vX.Y.Z.zip`

### Workflows GitHub Actions

- **`.github/workflows/changesets.yml`** : Crée automatiquement un PR de version quand des changesets sont mergés
- **`.github/workflows/release.yml`** : Crée une release GitHub avec packages quand le PR de version est mergé
- **`.github/workflows/package.yml`** : Package manuel déclenchable via GitHub Actions UI ou tags Git

## 📁 Structure du projet

```
.
├── manifest.json          # Manifest de l'extension pour Chrome (Manifest V3)
├── manifest-firefox.json  # Manifest de l'extension pour Firefox (Manifest V3 avec background.scripts)
├── manifest-no-icons.json # Manifest alternatif sans icônes
├── package.json          # Configuration Node.js et scripts
├── background.js         # Service worker (background)
├── devtools.html         # Page d'entrée DevTools
├── devtools.js           # Création du panneau DevTools
├── panel.html            # Interface du panneau DevTools (HTML uniquement)
├── panel.css             # Styles CSS du panneau (séparé du HTML)
├── panel.js              # Orchestration principale
├── utils/                # Utilitaires
│   ├── i18n.js          # Système de traduction
│   ├── icons.js         # Système d'icônes SVG Heroicons
│   ├── ui.js             # Fonctions UI
│   ├── stats.js          # Gestion des statistiques
│   └── cleanup.js        # Nettoyage des visualisations
├── tests/                # Tests d'accessibilité
│   ├── navigation/      # Tests de navigation
│   │   └── keyboard-visualization.js  # Visualisation de la navigation clavier
│   ├── langage/          # Tests de langage & interface
│   │   ├── contrasts/    # Modules d'analyse des contrastes (divisés)
│   │   ├── media-alternatives.js  # Test principal des alternatives média
│   │   └── media-alternatives-visualization.js  # Visualisation des alternatives
│   └── structuration/    # Tests de structuration
│       ├── form-fields.js  # Test principal des champs de formulaire
│       └── form-fields-visualization.js  # Visualisation des champs
└── scripts/              # Scripts utilitaires
    ├── package-chrome.js # Script de packaging Chrome
    ├── package-firefox.js# Script de packaging Firefox
    ├── sync-version.js   # Synchronisation des versions
    ├── switch-to-firefox.js # Basculer vers manifest Firefox (développement)
    └── switch-to-chrome.js  # Basculer vers manifest Chrome (développement)
```

## ✅ Tests d'accessibilité

L'extension vérifie plusieurs critères d'accessibilité selon le référentiel RGAA :

### Navigation & utilisation
- Le site est optimisé pour toutes les tailles d'écran
- La navigation et l'utilisation du site peuvent s'effectuer entièrement au clavier
- Deux moyens de navigation sont présents
- Les fichiers bureautiques téléchargeables sont proposés dans un format ouvert

### Langage & interface
- Les contrastes sont suffisants (beta)
- Aucune information n'est véhiculée uniquement par la couleur
- Les images, les vidéos et les fichiers audio ont une alternative textuelle
- La langue principale du site est bien définie
- Les liens sont explicites
- Le contenu reste lisible à 200% de la taille par défaut
- Les animations, clignotements et sons sont contrôlables

### Structuration de l'information
- Le titre de la page est unique et pertinent
- La hiérarchie des titres est complète et cohérente (beta)
- Chaque champ de formulaire est clairement associé à son intitulé
- Les informations relatives aux fichiers proposés en téléchargement sont indiquées

## 🔧 Scripts disponibles

```bash
pnpm run changeset          # Créer un nouveau changeset
pnpm run version-packages   # Versionner les packages (via Changesets)
pnpm run version           # Synchroniser manifest.json avec package.json
pnpm run version-all       # Versionner les packages ET synchroniser (utilisé par GitHub Actions)
pnpm run package:chrome    # Créer le package Chrome
pnpm run package:firefox   # Créer le package Firefox
pnpm run package           # Créer les deux packages
pnpm run generate-icons    # Générer les icônes depuis SVG
pnpm run switch:firefox    # Basculer vers manifest Firefox (développement)
pnpm run switch:chrome     # Basculer vers manifest Chrome (développement)
```

## 📝 Licence

MIT
