#!/usr/bin/env node
/**
 * Script pour créer le package Firefox de l'extension
 * Firefox utilise également Manifest V3, donc le package est identique à Chrome
 * pour l'instant, mais on le garde séparé pour l'évolutivité future
 */
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const manifestPath = join(process.cwd(), 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
const version = manifest.version;
const outputName = `diagnostic-flash-rgaa-firefox-v${version}.zip`;

console.log(`📦 Création du package Firefox ${version}...`);

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
  console.log(`✅ Package Firefox créé: ${outputName}`);
} catch (error) {
  console.error('❌ Erreur lors de la création du package Firefox:', error);
  process.exit(1);
}
