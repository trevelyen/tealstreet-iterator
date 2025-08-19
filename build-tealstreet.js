#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Read the component file
const componentPath = path.join(__dirname, 'component.tsx')
const componentContent = fs.readFileSync(componentPath, 'utf8')

// Remove the export default line and any comments about Next.js/TealStreet
const tealstreetReady =
  componentContent
    .replace(/^\/\/ @ts-nocheck.*$/gm, '')
    .replace(/^export default Component.*$/gm, '')
    .replace(/^\/\/ For development.*$/gm, '')
    .replace(/^\/\/ For Tealstreet:.*$/gm, '')
    .trim() + '\n\nComponent'

// Write to output file
const outputPath = path.join(__dirname, 'component-ready.tsx')
fs.writeFileSync(outputPath, tealstreetReady)

console.log(`✅ Tealstreet-ready component generated: ${outputPath}`)
console.log('📋 Copy the contents of component-tealstreet.tsx and paste into TealStreet')
