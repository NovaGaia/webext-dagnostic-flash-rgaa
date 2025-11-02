#!/usr/bin/env node

/**
 * Script pour synchroniser la version entre package.json, manifest.json et manifest-no-icons.json
 * Utilisé par Changesets pour mettre à jour les versions
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { join } from 'path';

const packageJsonPath = join(process.cwd(), 'package.json');
const manifestJsonPath = join(process.cwd(), 'manifest.json');
const manifestNoIconsPath = join(process.cwd(), 'manifest-no-icons.json');

// Lire la version depuis package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const newVersion = packageJson.version;

// Mettre à jour manifest.json
const manifestJson = JSON.parse(readFileSync(manifestJsonPath, 'utf-8'));
manifestJson.version = newVersion;
writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + '\n');

// Mettre à jour manifest-no-icons.json si il existe
if (existsSync(manifestNoIconsPath)) {
  const manifestNoIconsJson = JSON.parse(readFileSync(manifestNoIconsPath, 'utf-8'));
  manifestNoIconsJson.version = newVersion;
  writeFileSync(manifestNoIconsPath, JSON.stringify(manifestNoIconsJson, null, 2) + '\n');
  console.log(`✅ Version synchronisée: ${newVersion} (package.json, manifest.json, manifest-no-icons.json)`);
} else {
  console.log(`✅ Version synchronisée: ${newVersion} (package.json, manifest.json)`);
}
