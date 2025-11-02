#!/usr/bin/env node
/**
 * Script pour créer le package Chrome de l'extension
 */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const manifestPath = join(process.cwd(), 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const version = manifest.version;
const outputName = `diagnostic-flash-rgaa-chrome-v${version}.zip`;

console.log(`📦 Création du package Chrome ${version}...`);

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
  '.github/*'
].map(p => `-x "${p}"`).join(' ');

try {
  execSync(`zip -r ${outputName} . ${excludePatterns}`, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log(`✅ Package Chrome créé: ${outputName}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du package Chrome:', error);
  process.exit(1);
}
