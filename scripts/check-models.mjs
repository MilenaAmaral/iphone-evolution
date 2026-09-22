import fs from 'node:fs'
import path from 'node:path'

const rootDir = path.resolve('public/models')
const devicesFile = path.resolve('src/data/devices.js')

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

const deviceText = fs.readFileSync(devicesFile, 'utf8')
const deviceIds = [...deviceText.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1])

const modelFiles = walk(rootDir)
const modelNames = new Set(modelFiles.map((file) => path.basename(file, '.glb')))

const missing = deviceIds.filter((id) => !modelNames.has(id))

if (missing.length === 0) {
  console.log(`✓ Todos os modelos dos aparelhos foram encontrados: ${deviceIds.length} arquivos.`)
  process.exit(0)
}

console.warn('⚠️ Modelos ausentes:')
for (const id of missing) {
  console.warn(`- ${id}.glb`)
}
process.exit(1)
