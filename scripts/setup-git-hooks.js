#!/usr/bin/env node

/**
 * Script de configuration des hooks Git
 * Installe le hook pre-commit pour vérifier la documentation
 */

import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const gitHooksDir = join(rootDir, '.git', 'hooks');
const preCommitHook = join(gitHooksDir, 'pre-commit');

const hookContent = `#!/bin/sh
# Hook Git pre-commit - Mise à jour automatique de la documentation
# Généré automatiquement par scripts/setup-git-hooks.js

# Exécuter le script de mise à jour automatique de la documentation
pnpm run update-docs

# Ajouter les fichiers modifiés au staging si nécessaire
if [ $? -eq 0 ]; then
  # Ajouter les fichiers de documentation modifiés au commit
  git add README.md .changeset/README.md MEMOIRE_SESSION.md 2>/dev/null || true
fi
`;

try {
  // Créer le dossier .git/hooks s'il n'existe pas
  mkdirSync(gitHooksDir, { recursive: true });
  
  // Écrire le hook pre-commit
  writeFileSync(preCommitHook, hookContent, 'utf-8');
  
  // Rendre le hook exécutable
  chmodSync(preCommitHook, 0o755);
  
  console.log('✅ Hook Git pre-commit installé avec succès');
  console.log('   Le script vérifiera automatiquement la documentation avant chaque commit');
} catch (error) {
  console.error('❌ Erreur lors de l\'installation du hook Git:', error.message);
  process.exit(1);
}

