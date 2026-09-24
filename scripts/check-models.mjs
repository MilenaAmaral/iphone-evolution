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
const modelNames = new Set(modelFiles.map((file) => path.basename(file, '.glb')))

const activeModels = ['iphone_1st_generation', 'iphone-duo', 'iphone-18-pro-max']
const missing = activeModels.filter((id) => !modelNames.has(id))

if (missing.length === 0) {
  console.log(`✓ Os ${activeModels.length} modelos 3D ativos foram encontrados.`)
  process.exit(0)
}

console.warn('⚠️ Modelos ausentes:')
for (const id of missing) {
  console.warn(`- ${id}.glb`)
}
process.exit(1)
