/**
 * optimize-models.mjs
 *
 * Otimiza os 4 modelos 3D ativos do site SEM trocar os arquivos por
 * imagens e sem mudar os caminhos usados pelos componentes.
 *
 * Entrada:  models-source/<nome>.glb  (originais, preservados fora de public/)
 * Saída:    public/models/<nome>.glb   (versão servida ao navegador)
 *
 * Etapas (todas com @gltf-transform + meshoptimizer, já em devDependencies):
 * 1. dedup / prune / weld   → remove dados duplicados ou não usados
 * 2. flatten + join         → junta malhas que usam o mesmo material
 *                              (menos draw calls, mesma aparência)
 * 3. simplify (opcional)    → só onde configurado e com erro máximo
 *                              muito baixo (0,05% do tamanho do modelo),
 *                              para não alterar a silhueta
 * 4. texturas               → WebP, com teto de resolução por modelo
 *                              (usa `sharp` se estiver instalado; sem ele,
 *                              as texturas originais são mantidas)
 * 5. meshopt                → quantização + EXT_meshopt_compression,
 *                              decodificado no navegador pelo MeshoptDecoder
 *                              que já vem no bundle (ver src/three/gltfCache.js)
 *
 * Uso: node scripts/optimize-models.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, KHRMaterialsPBRSpecularGlossiness, KHRMaterialsTransmission } from '@gltf-transform/extensions'
import { dedup, flatten, join, meshopt, prune, simplify, textureCompress, weld } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer'

const SOURCE_DIR = path.resolve('models-source')
const OUTPUT_DIR = path.resolve('public/models')

/**
 * Configuração por modelo. `maxTexture` limita a maior dimensão das
 * texturas; `textureOverrides` permite manter uma textura específica em
 * resolução maior (ex.: a tela do iPhone original, que precisa de detalhe).
 */
const MODELS = {
  'apple-logo.glb': {
    // O arquivo original exige KHR_materials_pbrSpecularGlossiness, que o
    // GLTFLoader do three.js não suporta mais: hoje o navegador ignora o
    // material e desenha o logo com o material padrão do glTF (branco,
    // metalness 1, roughness 1), gerando um aviso no console. Aqui o
    // material é convertido EXATAMENTE para esse material padrão, o que
    // mantém a aparência atual da página INÍCIO, remove o aviso e elimina
    // a textura de 1024px que nunca era exibida.
    stripSpecGloss: true,
  },
  'apple_iphone_duo.glb': {
    // A lente de vidro da câmera usava KHR_materials_transmission, que força
    // o three.js a renderizar a cena inteira uma segunda vez por frame só
    // para essa peça pequena. Mantida como vidro transparente (alpha 0,25),
    // visualmente equivalente nessa escala e sem o passe extra.
    removeTransmission: true,
    maxTexture: 1024,
  },
  'iphone_18_pro_max.glb': {
    maxTexture: 1024,
  },
  'iphone_1st_generation.glb': {
    // 221 mil triângulos: simplificação limitada por erro geométrico,
    // não por porcentagem fixa. Para no primeiro ponto em que a forma
    // começaria a mudar.
    simplify: { ratio: 0.5, error: 0.0005 },
    maxTexture: 1024,
    // A textura emissiva é a tela (ícones): mantida em 2048 para não
    // perder nitidez. Cor base também, por causa dos textos gravados.
    keepFullResolution: ['emissiveTexture', 'baseColorTexture'],
  },
}

async function loadSharp() {
  try {
    return (await import('sharp')).default
  } catch {
    return null
  }
}

function stripSpecGloss(document) {
  const root = document.getRoot()
  for (const material of root.listMaterials()) {
    material.setExtension('KHR_materials_pbrSpecularGlossiness', null)
    material.setBaseColorFactor([1, 1, 1, 1])
    material.setBaseColorTexture(null)
    material.setMetallicFactor(1)
    material.setRoughnessFactor(1)
  }
  document.createExtension(KHRMaterialsPBRSpecularGlossiness).dispose()
}

function removeTransmission(document) {
  for (const material of document.getRoot().listMaterials()) {
    if (material.getExtension('KHR_materials_transmission')) {
      material.setExtension('KHR_materials_transmission', null)
      material.setAlphaMode('BLEND')
    }
  }
  document.createExtension(KHRMaterialsTransmission).dispose()
}

function stats(document) {
  let triangles = 0
  let primitives = 0
  for (const mesh of document.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      primitives += 1
      const indices = primitive.getIndices()
      const count = indices ? indices.getCount() : primitive.getAttribute('POSITION').getCount()
      triangles += count / 3
    }
  }
  return { triangles: Math.round(triangles), drawCalls: primitives }
}

async function optimize(fileName, config, io, sharp) {
  const sourcePath = path.join(SOURCE_DIR, fileName)
  const outputPath = path.join(OUTPUT_DIR, fileName)
  const document = await io.read(sourcePath)
  const before = stats(document)

  if (config.stripSpecGloss) stripSpecGloss(document)
  if (config.removeTransmission) removeTransmission(document)

  const transforms = [dedup(), prune(), weld(), flatten(), join(), prune()]
  if (config.simplify) {
    transforms.push(simplify({ simplifier: MeshoptSimplifier, ...config.simplify }))
  }
  await document.transform(...transforms)

  if (sharp) {
    const keep = new Set()
    for (const material of document.getRoot().listMaterials()) {
      for (const slot of config.keepFullResolution ?? []) {
        const getter = `get${slot[0].toUpperCase()}${slot.slice(1)}`
        const texture = material[getter]?.()
        if (texture) keep.add(texture)
      }
    }
    const maxSize = config.maxTexture ?? 2048
    await document.transform(
      textureCompress({
        encoder: sharp,
        targetFormat: 'webp',
        quality: 90,
        resize: [maxSize, maxSize],
        pattern: null,
        // Texturas marcadas em keepFullResolution: só recodificadas para
        // WebP, sem redimensionar.
        filter: (texture) => !keep.has(texture),
      }),
    )
    if (keep.size) {
      await document.transform(
        textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 92, filter: (texture) => keep.has(texture) }),
      )
    }
  }

  await document.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }))
  await io.write(outputPath, document)

  const after = stats(document)
  const beforeSize = fs.statSync(sourcePath).size
  const afterSize = fs.statSync(outputPath).size
  console.log(
    `${fileName.padEnd(28)} ${(beforeSize / 1e6).toFixed(2)} MB → ${(afterSize / 1e6).toFixed(2)} MB | ` +
      `triângulos ${before.triangles} → ${after.triangles} | draw calls ${before.drawCalls} → ${after.drawCalls}`,
  )
}

await MeshoptDecoder.ready
await MeshoptEncoder.ready
await MeshoptSimplifier.ready

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder })

const sharp = await loadSharp()
if (!sharp) console.warn('⚠️ sharp não encontrado: texturas mantidas no formato original (instale com `npm i -D sharp` para recomprimir).')

for (const [fileName, config] of Object.entries(MODELS)) {
  await optimize(fileName, config, io, sharp)
}
