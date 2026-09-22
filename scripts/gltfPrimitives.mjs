// gltfPrimitives.mjs
//
// Helper geométrico mínimo compartilhado pelos scripts de geração de .glb
// deste projeto (generate-sample-glb.mjs e generate-device-models.mjs):
// uma caixa retangular simples (8 vértices, cantos retos — sem
// arredondamento, de propósito, pra manter os scripts pequenos e o estilo
// visual deliberadamente abstrato/minimalista dos modelos gerados aqui).
//
// Extraído pra cá em vez de duplicado nos dois scripts (o mesmo motivo da
// auditoria de "código duplicado" do próprio app: um ajuste na forma como
// a caixa é construída não deveria exigir editar dois arquivos iguais).

export function makeBox(doc, name, [w, h, d], material, { position = [0, 0, 0] } = {}) {
  const buffer = doc.getRoot().listBuffers()[0] ?? doc.createBuffer()
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

  const positionAccessor = doc.createAccessor().setType('VEC3').setArray(positions).setBuffer(buffer)
  const indexAccessor = doc.createAccessor().setArray(indices).setBuffer(buffer)

  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', positionAccessor)
    .setIndices(indexAccessor)
    .setMaterial(material)

  const mesh = doc.createMesh(name).addPrimitive(prim)
  return doc.createNode(name).setMesh(mesh).setTranslation(position)
}
