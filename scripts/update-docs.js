#!/usr/bin/env node

/**
 * Script de mise à jour automatique de la documentation
 * Met à jour README.md et MEMOIRE_SESSION.md pour refléter les changements du projet
 * S'exécute automatiquement avant chaque commit via le hook Git pre-commit
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const filesToCheck = [
  { path: 'README.md', name: 'README.md' },
  { path: '.changeset/README.md', name: '.changeset/README.md' },
  { path: 'MEMOIRE_SESSION.md', name: 'MEMOIRE_SESSION.md' }
];

let hasChanges = false;
const changes = [];

/**
 * Met à jour un fichier en remplaçant npm par pnpm
 */
function updateFile(filePath, fileName, preserveHistorical = false) {
  if (!existsSync(filePath)) {
    return false;
  }
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    if (preserveHistorical && fileName === 'MEMOIRE_SESSION.md') {
      // Pour MEMOIRE_SESSION.md, préserver les sections historiques
      const historicalMarker = '## 🎯 Réalisations principales de cette session (historique)';
      const parts = content.split(historicalMarker);
      
      if (parts.length > 1) {
        // Mettre à jour seulement la partie avant la section historique
        parts[0] = parts[0].replace(/npm run/g, 'pnpm run');
        parts[0] = parts[0].replace(/npm ci/g, 'pnpm install --frozen-lockfile');
        content = parts.join(historicalMarker);
      } else {
        // Pas de section historique, mettre à jour tout le fichier
        content = content.replace(/npm run/g, 'pnpm run');
        content = content.replace(/npm ci/g, 'pnpm install --frozen-lockfile');
      }
    } else {
      // Pour les autres fichiers, remplacer directement
      content = content.replace(/npm run/g, 'pnpm run');
      content = content.replace(/npm ci/g, 'pnpm install --frozen-lockfile');
    }
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${fileName}:`, error.message);
    return false;
  }
  
  return false;
}

// Mettre à jour tous les fichiers
for (const file of filesToCheck) {
  const filePath = join(rootDir, file.path);
  const updated = updateFile(filePath, file.name, true);
  
  if (updated) {
    hasChanges = true;
    changes.push(`✓ ${file.name} : npm → pnpm`);
  }
}

if (hasChanges && changes.length > 0) {
  console.log('📝 Documentation mise à jour automatiquement :');
  changes.forEach(change => console.log(`  ${change}`));
  console.log('\n✅ Les fichiers ont été modifiés et sont prêts à être commités.');
  process.exit(0); // Succès - les fichiers sont à jour
} else {
  console.log('✅ Documentation déjà à jour (utilise pnpm)');
  process.exit(0);
}

