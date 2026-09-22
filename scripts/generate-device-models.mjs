// generate-device-models.mjs
//
// Gera um .glb por geração do iPhone (devices.js), pra ligar de vez
// `modelPath` em cada item do dataset — a Fase 0 do roadmap do projeto.
//
// IMPORTANTE — o que isto NÃO é: não são reproduções fiéis do design real
// da Apple, nem foram feitos olhando/traçando fotos de produto da Apple.
// São modelos ESTILIZADOS e ABSTRATOS (corpo retangular simples, sem
// tentar copiar a curvatura, o acabamento ou a posição exata dos módulos
// de câmera de nenhum iPhone real) — a mesma linha de "identidade visual
// original" que rege o resto do projeto (ver index.css). O que muda de um
// pro outro é derivado de CAMPOS JÁ VERIFICADOS de devices.js, nunca
// inventado:
//   - Tamanho do corpo: proporcional ao tamanho real da tela
//     (getDisplayInches) — os aparelhos mais antigos e de tela menor
//     saem visivelmente menores que os mais recentes, coerente com a
//     realidade.
//   - Espessura: proporcional à espessura real (getThicknessMm) — o
//     iPhone 6 (6,9 mm), por exemplo, sai visivelmente mais fino que o
//     iPhone 3G (12,3 mm).
//   - Cor do corpo: a primeira cor de lançamento listada em `colors[]`,
//     traduzida pra um tom aproximado (ver deviceColorMap.mjs — é uma
//     interpretação nossa do nome da cor, não um valor oficial copiado).
//   - Número de "lentes" na parte de trás: getLensCount(device), extraído
//     do texto real de `camera` (1, 2 ou 3) — não representa o desenho
//     exato do módulo de câmera de nenhum iPhone específico, só a
//     contagem.
//
// Trocar por modelos definitivos (fotogrametria real, feitos por um
// artista 3D) no futuro é só sobrescrever o mesmo arquivo em
// public/models/<id>.glb — nenhum componente React precisa mudar (ver o
// comentário sobre `modelPath` em devices.js).
//
// Roda com: node scripts/generate-device-models.mjs

import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import { devices } from '../src/data/devices.js'
import { getThicknessMm, getDisplayInches, getLensCount } from '../src/utils/deviceStats.js'
import { colorNameToHex, hexToRgbFloat } from './deviceColorMap.mjs'
import { makeBox } from './gltfPrimitives.mjs'

const BASE_WIDTH = 0.9
const BASE_HEIGHT = 1.9
const MIN_DEPTH = 0.055
const MAX_DEPTH = 0.115
const LENS_SIZE = 0.07

const displayValues = devices.map(getDisplayInches).filter((value) => value !== null)
const thicknessValues = devices.map(getThicknessMm).filter((value) => value !== null)
const maxDisplayInches = Math.max(...displayValues)
const minThickness = Math.min(...thicknessValues)
const maxThickness = Math.max(...thicknessValues)

function lerp(min, max, t) {
  return min + (max - min) * t
}

// Posições das "lentes" na parte de trás — arranjo genérico (não tenta
// reproduzir o desenho de nenhum módulo de câmera real), só o bastante
// pra 1/2/3 lentes ficarem visualmente distintas entre si.
function lensPositions(count, width, height, depth) {
  const baseX = -width * 0.28
  const baseY = height * 0.34
  const z = -depth / 2 - 0.006

  if (count === 1) return [[baseX, baseY, z]]
  if (count === 2)
    return [
      [baseX, baseY + 0.05, z],
      [baseX, baseY - 0.05, z],
    ]
  return [
    [baseX - 0.045, baseY + 0.045, z],
    [baseX + 0.05, baseY + 0.045, z],
    [baseX, baseY - 0.05, z],
  ]
}

function buildDeviceDocument(device) {
  const doc = new Document()

  const displayInches = getDisplayInches(device) ?? maxDisplayInches
  const thicknessMm = getThicknessMm(device) ?? minThickness
  const lensCount = getLensCount(device)
  const bodyHex = colorNameToHex(device.colors[0])

  const sizeFactor = displayInches / maxDisplayInches
  const width = BASE_WIDTH * sizeFactor
  const height = BASE_HEIGHT * sizeFactor
  const thicknessT =
    maxThickness === minThickness ? 0.5 : (thicknessMm - minThickness) / (maxThickness - minThickness)
  const depth = lerp(MIN_DEPTH, MAX_DEPTH, thicknessT)

  const bodyMaterial = doc
    .createMaterial('corpo')
    .setBaseColorFactor([...hexToRgbFloat(bodyHex), 1])
    .setMetallicFactor(0.55)
    .setRoughnessFactor(0.35)

  const screenMaterial = doc
    .createMaterial('tela')
    .setBaseColorFactor([0.02, 0.02, 0.02, 1])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.15)

  const lensMaterial = doc
    .createMaterial('lente')
    .setBaseColorFactor([0.03, 0.03, 0.04, 1])
    .setMetallicFactor(0.8)
    .setRoughnessFactor(0.2)

  const body = makeBox(doc, 'corpo', [width, height, depth], bodyMaterial)
  const screen = makeBox(doc, 'tela', [width * 0.89, height * 0.926, depth * 0.12], screenMaterial, {
    position: [0, 0, depth / 2 + 0.006],
  })

  const scene = doc.createScene('cena')
  scene.addChild(body)
  scene.addChild(screen)

  lensPositions(lensCount, width, height, depth).forEach((position, index) => {
    const lens = makeBox(doc, `lente-${index}`, [LENS_SIZE, LENS_SIZE, 0.02], lensMaterial, { position })
    scene.addChild(lens)
  })

  return doc
}

await MeshoptEncoder.ready

for (const device of devices) {
  const doc = buildDeviceDocument(device)
  await doc.transform(meshopt({ encoder: MeshoptEncoder }))

  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
    'meshopt.encoder': MeshoptEncoder,
  })
  const outPath = `public/models/${device.id}.glb`
  await io.write(outPath, doc)
  console.log(`Gerado: ${outPath}`)
}

console.log(`\n${devices.length} modelos gerados em public/models/.`)
