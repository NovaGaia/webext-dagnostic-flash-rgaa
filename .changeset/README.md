# Changesets

Bonjour et bienvenue ! Ce dossier contient des fichiers changeset générés et lus par [Changesets](https://github.com/changesets/changesets). 

Nous utilisons Changesets pour gérer les versions de notre extension navigateur et générer automatiquement les releases GitHub avec les packages Chrome et Firefox.

## Ajouter un changeset

Quand vous faites une modification qui nécessite un changement de version :

```bash
ppppnpm run changeset
```

Cela vous demandera :
1. **Quel type de changement** : 
   - **Major** : Changements incompatibles (rare pour une extension)
   - **Minor** : Nouvelles fonctionnalités (ajout de tests, nouvelles analyses)
   - **Patch** : Corrections de bugs

2. **Une description** : Décrivez les changements dans un format markdown qui apparaîtra dans le CHANGELOG

## Workflow de release

1. **Développement** : Créez vos changements + changeset dans une branche
2. **PR** : Ouvrez une Pull Request vers `main`
3. **Merge** : Une fois mergé, le workflow `changesets.yml` détecte les changesets
4. **Version PR** : Un PR "chore: version packages" est créé automatiquement
5. **Merge Version PR** : Quand vous mergez ce PR, le workflow `release.yml` :
   - Crée un tag Git `vX.Y.Z`
   - Crée une release GitHub avec les packages Chrome et Firefox
   - Génère le CHANGELOG.md automatiquement

## Scripts disponibles

- `ppppnpm run changeset` : Créer un nouveau changeset
- `ppppnpm run version-packages` : Versionner les packages (fait automatiquement par GitHub Actions)
- `ppppnpm run version` : Synchroniser la version entre package.json et manifest.json
- `ppppnpm run version-all` : Versionner les packages ET synchroniser (utilisé par GitHub Actions)

## Notes

- Les changesets sont des fichiers markdown dans `.changeset/`
- Ne supprimez pas les changesets après les avoir créés - ils seront supprimés automatiquement lors du versioning
- Le script `sync-version.js` s'assure que `manifest.json` et `package.json` ont la même version
