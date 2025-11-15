#!/usr/bin/env node
/**
 * Script pour basculer vers le manifest Chrome pour le développement
 * Restaure manifest.json depuis la sauvegarde
 */
import { existsSync, copyFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const manifestChromePath = join(process.cwd(), 'manifest.json');
const manifestChromeBackupPath = join(process.cwd(), 'manifest-chrome.json.backup');

console.log('🔄 Basculement vers le manifest Chrome...');

if (!existsSync(manifestChromeBackupPath)) {
  console.error('❌ Sauvegarde du manifest Chrome introuvable !');
  console.error('💡 Le manifest.json actuel est peut-être déjà celui de Chrome.');
  process.exit(1);
}

// Restaurer le manifest Chrome
copyFileSync(manifestChromeBackupPath, manifestChromePath);
unlinkSync(manifestChromeBackupPath);
console.log('✅ Manifest Chrome restauré');
console.log('');
console.log('📝 Vous pouvez maintenant charger l\'extension dans Chrome avec manifest.json');

