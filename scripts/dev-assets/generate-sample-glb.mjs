// generate-sample-glb.mjs
//
// Gera um .glb MÍNIMO e válido, só para ter um arquivo real de teste do
// pipeline de carregamento GLTF (useGLTF/Suspense) — usado só em
// desenvolvimento (ver public/models/dev/), nunca ligado a um aparelho
// real do dataset. Os modelos de verdade (um por geração, data-driven a
// partir de devices.js) são gerados por ../generate-device-models.mjs.
//
// Não é arte final nem tenta parecer um iPhone específico: é só uma malha
// simples (corpo + "tela") suficiente para confirmar que PhoneModel
// carrega, sombreia e anima um GLB de verdade. Roda com:
//   node scripts/dev-assets/generate-sample-glb.mjs

import { Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { meshopt } from '@gltf-transform/functions'
import { MeshoptEncoder } from 'meshoptimizer'
import { makeBox } from '../gltfPrimitives.mjs'

const doc = new Document()

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

const body = makeBox(doc, 'corpo', [0.9, 1.9, 0.09], material)
const screen = makeBox(doc, 'tela', [0.8, 1.76, 0.01], screenMaterial, { position: [0, 0, 0.052] })

const scene = doc.createScene('cena')
scene.addChild(body)
scene.addChild(screen)

// Compressão Meshopt (EXT_meshopt_compression) — o mesmo formato que
// PhoneModel.jsx já sabe descomprimir sem precisar de nenhum CDN externo
// (ver o comentário sobre USE_MESHOPT em src/three/gltfCache.js). Este
// arquivo de exemplo é pequeno demais pra a compressão fazer diferença
// visível no tamanho, mas o pipeline aqui é o mesmo que os modelos reais
// (Fase 0 do roadmap) vão usar — a ideia é já nascer certo, em vez de
// precisar lembrar de adicionar compressão depois, com dezenas de .glb
// reais já gerados sem ela.
await MeshoptEncoder.ready
await doc.transform(meshopt({ encoder: MeshoptEncoder }))

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
})
await io.write('public/models/dev/sample-phone.glb', doc)

console.log('Gerado: public/models/dev/sample-phone.glb (com compressão Meshopt)')
