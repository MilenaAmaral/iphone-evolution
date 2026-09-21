// generate-sample-glb.mjs
//
// Gera um .glb MÍNIMO e válido, só para ter um arquivo real de teste do
// pipeline de carregamento GLTF (useGLTF/Suspense) enquanto os modelos
// definitivos de cada iPhone não existem (isso é a Fase 0 do roadmap do
// projeto — retopologia/LOD dos modelos fotogramétricos reais).
//
// Não é arte final nem tenta parecer um iPhone específico: é só uma malha
// simples (corpo + "tela") suficiente para confirmar que PhoneModel
// carrega, sombreia e anima um GLB de verdade. Roda com:
//   node scripts/dev-assets/generate-sample-glb.mjs

import { Document, NodeIO } from '@gltf-transform/core'

const doc = new Document()
const buffer = doc.createBuffer()

const material = doc
  .createMaterial('corpo')
  .setBaseColorFactor([0.09, 0.09, 0.1, 1])
  .setMetallicFactor(0.6)
  .setRoughnessFactor(0.3)

const screenMaterial = doc
  .createMaterial('tela')
  .setBaseColorFactor([0.02, 0.02, 0.02, 1])
  .setMetallicFactor(0.1)
  .setRoughnessFactor(0.15)

function makeBox(name, [w, h, d], mat) {
  const hw = w / 2
  const hh = h / 2
  const hd = d / 2

  // 8 vértices de uma caixa simples.
  // prettier-ignore
  const positions = new Float32Array([
    -hw,-hh, hd,  hw,-hh, hd,  hw, hh, hd,  -hw, hh, hd, // frente
    -hw,-hh,-hd,  -hw, hh,-hd,  hw, hh,-hd,  hw,-hh,-hd, // trás
  ])
  // prettier-ignore
  const indices = new Uint16Array([
    0,1,2, 0,2,3,       // frente
    4,5,6, 4,6,7,       // trás
    3,2,6, 3,6,5,       // topo
    0,7,1, 0,4,7,       // base
    1,7,6, 1,6,2,       // direita
    4,0,3, 4,3,5,       // esquerda
  ])

  const positionAccessor = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(positions)
    .setBuffer(buffer)

  const indexAccessor = doc
    .createAccessor()
    .setArray(indices)
    .setBuffer(buffer)

  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', positionAccessor)
    .setIndices(indexAccessor)
    .setMaterial(mat)

  const mesh = doc.createMesh(name).addPrimitive(prim)
  return doc.createNode(name).setMesh(mesh)
}

const body = makeBox('corpo', [0.9, 1.9, 0.09], material)
const screen = makeBox('tela', [0.8, 1.76, 0.01], screenMaterial)
screen.setTranslation([0, 0, 0.052])

const scene = doc.createScene('cena')
scene.addChild(body)
scene.addChild(screen)

const io = new NodeIO()
await io.write('public/models/dev/sample-phone.glb', doc)

console.log('Gerado: public/models/dev/sample-phone.glb')
