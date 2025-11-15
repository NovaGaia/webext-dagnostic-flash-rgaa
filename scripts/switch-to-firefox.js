#!/usr/bin/env node
/**
 * Script pour basculer vers le manifest Firefox pour le développement
 * Renomme temporairement manifest.json en manifest-chrome.json
 * et manifest-firefox.json en manifest.json
 */
import { existsSync, copyFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const manifestChromePath = join(process.cwd(), 'manifest.json');
const manifestFirefoxPath = join(process.cwd(), 'manifest-firefox.json');
const manifestChromeBackupPath = join(process.cwd(), 'manifest-chrome.json.backup');

console.log('🔄 Basculement vers le manifest Firefox...');

if (!existsSync(manifestFirefoxPath)) {
  console.error('❌ manifest-firefox.json introuvable !');
  process.exit(1);
}

// Sauvegarder le manifest Chrome actuel
if (existsSync(manifestChromePath)) {
  copyFileSync(manifestChromePath, manifestChromeBackupPath);
  console.log('✅ Manifest Chrome sauvegardé');
}

// Remplacer manifest.json par manifest-firefox.json
copyFileSync(manifestFirefoxPath, manifestChromePath);
console.log('✅ manifest-firefox.json copié vers manifest.json');
console.log('');
console.log('📝 Vous pouvez maintenant charger l\'extension dans Firefox avec manifest.json');
console.log('💡 Pour revenir à Chrome, exécutez: node scripts/switch-to-chrome.js');

