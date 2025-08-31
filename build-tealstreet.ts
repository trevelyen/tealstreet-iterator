#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the component file
const tealstreetIteratorPath = path.join(__dirname, 'src/tealstreet-iterator')
const componentPath = path.join(tealstreetIteratorPath, '_BUILD-HERE/component-iterate.tsx')
const componentContent = fs.readFileSync(componentPath, 'utf8')

// Extract CustomModuleName from the component
const scriptNameMatch = componentContent.match(/const\s+CustomModuleName\s*=\s*['"`]([^'"`]+)['"`]/)
const scriptName = scriptNameMatch ? scriptNameMatch[1] : null

// Remove development-only content for Tealstreet
const tealstreetReady =
  componentContent
    // Remove import lines
    .replace(/^import.*$/gm, '')
    // Remove CustomModuleName and its comments
    .replace(/^const\s+CustomModuleName\s*=\s*['"`][^'"`]+['"`].*$/gm, '')
    .replace(/^\/\/ Choose a CustomModuleName.*$/gm, '')
    .replace(/^\/\/ Make sure to change the name.*$/gm, '')
    .replace(/^\/\/ After confirming the desired name.*$/gm, '')
    .replace(/^\/\/ Each time you save this script.*$/gm, '')
    // Remove other development comments
    .replace(/^\/\/ @ts-nocheck.*$/gm, '')
    .replace(/^\/\/ For development.*$/gm, '')
    .replace(/^\/\/ For Tealstreet:.*$/gm, '')
    .replace(/^\/\/ Build here.*$/gm, '')
    .replace(/^export default Component.*$/gm, '')
    // Clean up extra whitespace
    .replace(/\n\n\n+/g, '\n\n')
    .trim() + '\n\nComponent'

// Write to output file
const outputPath = path.join(tealstreetIteratorPath, '_COPY-THIS/component-ready.tsx')
fs.writeFileSync(outputPath, tealstreetReady)

// If ScriptName is found, also save to _SAVED/ folder with versioning
if (scriptName) {
  const baseSavedPath = path.join(tealstreetIteratorPath, '_SAVED', scriptName)
  
  // Create base directory if it doesn't exist
  if (!fs.existsSync(baseSavedPath)) {
    fs.mkdirSync(baseSavedPath, { recursive: true })
  }
  
  // Find the next available version number
  let version = 1
  let versionPath = path.join(baseSavedPath, `v${version}`)
  
  while (fs.existsSync(versionPath)) {
    version++
    versionPath = path.join(baseSavedPath, `v${version}`)
  }
  
  // Create the versioned directory
  fs.mkdirSync(versionPath, { recursive: true })
  
  // Save original component
  const savedComponentPath = path.join(versionPath, 'component-iterate.tsx')
  fs.writeFileSync(savedComponentPath, componentContent)
  
  // Save ready component
  const savedReadyPath = path.join(versionPath, 'component-ready.tsx')
  fs.writeFileSync(savedReadyPath, tealstreetReady)
  
  console.log(`✅ Tealstreet-ready component re-generated`)
  console.log(`✅ Components saved to _SAVED/${scriptName}/v${version}/`)
} else {
  console.log(`✅ Tealstreet-ready component re-generated`)
  console.log(`ℹ️  Add 'const CustomModuleName = "your-name"' to auto-save to _SAVED/ folder`)
}