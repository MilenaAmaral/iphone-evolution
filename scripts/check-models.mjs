import fs from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve('public/models')

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.glb')) {
      files.push(fullPath)
    }
  }

  return files
}

const modelFiles = walk(rootDir)
const modelNames = new Set(modelFiles.map((file) => path.basename(file)))

const activeModels = [
  'iphone_1st_generation.glb',
  'iphone_18_pro_max.glb',
  'apple_watch_2015.glb',
  'app_watch_2026.glb',
  'ipad_2010.glb',
  'ipad_2026.glb',
]
const missing = activeModels.filter((filename) => !modelNames.has(filename))

if (missing.length === 0) {
  console.log(`✓ Os ${activeModels.length} modelos 3D ativos foram encontrados.`)
  process.exit(0)
}

console.warn('⚠️ Modelos ausentes:')
for (const filename of missing) {
  console.warn(`- ${filename}`)
}
process.exit(1)
