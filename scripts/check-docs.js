#!/usr/bin/env node

/**
 * Script de vérification et mise à jour de la documentation
 * Vérifie que README.md et MEMOIRE_SESSION.md utilisent pnpm au lieu de npm
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

for (const file of filesToCheck) {
  const filePath = join(rootDir, file.path);
  
  if (!existsSync(filePath)) {
    continue;
  }
  
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Remplacer npm run par pnpm run (sauf dans les sections historiques de MEMOIRE_SESSION.md)
    if (file.path === 'MEMOIRE_SESSION.md') {
      // Diviser en sections pour éviter de modifier les sections historiques
      const sections = content.split(/(## 🎯 Réalisations principales de cette session \(historique\))/);
      let modified = false;
      
      for (let i = 0; i < sections.length; i++) {
        // Ne pas modifier la section historique (après le split, elle commence à l'index 1)
        if (i === 1 || (i > 1 && sections[i-1]?.includes('historique'))) {
          continue;
        }
        
        // Remplacer npm run par pnpm run dans les autres sections
        if (sections[i].includes('npm run')) {
          sections[i] = sections[i].replace(/npm run/g, 'pnpm run');
          modified = true;
        }
        
        // Remplacer npm ci par pnpm install --frozen-lockfile
        if (sections[i].includes('npm ci')) {
          sections[i] = sections[i].replace(/npm ci/g, 'pnpm install --frozen-lockfile');
          modified = true;
        }
      }
      
      if (modified) {
        content = sections.join('');
        hasChanges = true;
      }
    } else {
      // Pour les autres fichiers, remplacer directement
      if (content.includes('npm run')) {
        content = content.replace(/npm run/g, 'pnpm run');
        hasChanges = true;
      }
      
      if (content.includes('npm ci')) {
        content = content.replace(/npm ci/g, 'pnpm install --frozen-lockfile');
        hasChanges = true;
      }
    }
    
    // Écrire le fichier si des changements ont été faits
    if (hasChanges && content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      changes.push(`✓ ${file.name} : npm → pnpm`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors de la lecture de ${file.name}:`, error.message);
    process.exit(1);
  }
}

if (hasChanges && changes.length > 0) {
  console.log('📝 Documentation mise à jour :');
  changes.forEach(change => console.log(`  ${change}`));
  console.log('\n⚠️  Des fichiers de documentation ont été modifiés. Veuillez les vérifier avant de commiter.');
  process.exit(1); // Empêche le commit pour permettre la vérification
} else {
  console.log('✅ Documentation à jour (utilise pnpm)');
  process.exit(0);
}

