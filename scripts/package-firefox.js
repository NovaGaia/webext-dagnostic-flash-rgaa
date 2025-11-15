#!/usr/bin/env node
/**
 * Script pour créer le package Firefox de l'extension
 * Firefox utilise Manifest V2 avec background.scripts au lieu de Manifest V3
 */
import { execSync } from 'child_process';
import { readFileSync, copyFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const manifestChromePath = join(process.cwd(), 'manifest.json');
const manifestFirefoxPath = join(process.cwd(), 'manifest-firefox.json');
const manifest = JSON.parse(readFileSync(manifestFirefoxPath, 'utf-8'));
const version = manifest.version;
const outputName = `diagnostic-flash-rgaa-firefox-v${version}.zip`;

console.log(`📦 Création du package Firefox ${version}...`);

// Sauvegarder le manifest Chrome original
const chromeManifestBackup = join(process.cwd(), 'manifest.json.backup');
if (existsSync(manifestChromePath)) {
  copyFileSync(manifestChromePath, chromeManifestBackup);
}

// Remplacer temporairement manifest.json par manifest-firefox.json pour le packaging
copyFileSync(manifestFirefoxPath, manifestChromePath);

const excludePatterns = [
  '*.git*',
  '*.DS_Store',
  'node_modules/*',
  '*.zip',
  '.changeset/*',
  'sources/*',
  '*.md',
  'LICENSE',
  'package.json',
  'package-lock.json',
  '.github/*',
  'manifest-firefox.json',
  'manifest.json.backup'
].map(p => `-x "${p}"`).join(' ');

try {
  execSync(`zip -r ${outputName} . ${excludePatterns}`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Restaurer le manifest Chrome original
  if (existsSync(chromeManifestBackup)) {
    copyFileSync(chromeManifestBackup, manifestChromePath);
    unlinkSync(chromeManifestBackup);
  }
  
  console.log(`✅ Package Firefox créé: ${outputName}`);
} catch (error) {
  // Restaurer le manifest Chrome original en cas d'erreur
  if (existsSync(chromeManifestBackup)) {
    copyFileSync(chromeManifestBackup, manifestChromePath);
    unlinkSync(chromeManifestBackup);
  }
  console.error('❌ Erreur lors de la création du package Firefox:', error);
  process.exit(1);
}
