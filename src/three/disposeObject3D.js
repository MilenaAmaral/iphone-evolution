/**
 * disposeObject3D.js
 *
 * Utilitário puro de three.js (sem React, sem R3F) para liberar memória de
 * GPU de uma árvore de objetos: geometrias e materiais (e as texturas que
 * cada material referencia) só somem da GPU quando `.dispose()` é chamado
 * explicitamente neles — o garbage collector do JS nunca faz isso sozinho,
 * já que os buffers de verdade vivem do lado da GPU, fora da heap do JS.
 *
 * Usado por `releaseModel` (ver gltfCache.js) quando um modelo sai da
 * "janela" de gerações próximas e não tem previsão de voltar a ser
 * exibido tão cedo.
 */
export function disposeObject3D(object) {
  if (!object) return

  object.traverse((child) => {
    if (child.isMesh) {
      child.geometry?.dispose()
      disposeMaterial(child.material)
    }
  })
}

function disposeMaterial(material) {
  if (!material) return

  if (Array.isArray(material)) {
    material.forEach(disposeMaterial)
    return
  }

  // Percorre as propriedades do material em vez de listar nomes de mapa
  // (map, normalMap, roughnessMap...) um por um — cobre automaticamente
  // qualquer textura que o material tenha, presente ou futura, sem
  // precisar manter essa lista em dia a cada novo tipo de material.
  for (const value of Object.values(material)) {
    if (value && typeof value === 'object' && value.isTexture) {
      value.dispose()
    }
  }

  material.dispose()
}
