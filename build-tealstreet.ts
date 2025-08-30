#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the component file
const tealstreetIteratorPath = path.join(__dirname, 'src/tealstreet-iterator')
const componentPath = path.join(tealstreetIteratorPath, 'component.tsx')
const componentContent = fs.readFileSync(componentPath, 'utf8')

// Remove the export default line and any comments about Next.js/Tealstreet
const tealstreetReady =
  componentContent
    // replace all import lines
    .replace(/^import.*$/gm, '')
    .replace(/^\/\/ @ts-nocheck.*$/gm, '')
    .replace(/^export default Component.*$/gm, '')
    .replace(/^\/\/ For development.*$/gm, '')
    .replace(/^\/\/ For Tealstreet:.*$/gm, '')
    .trim() + '\n\nComponent'

// Write to output file
const outputPath = path.join(tealstreetIteratorPath, 'component-ready.tsx')
fs.writeFileSync(outputPath, tealstreetReady)

console.log(`✅ Tealstreet-ready component re-generated`)