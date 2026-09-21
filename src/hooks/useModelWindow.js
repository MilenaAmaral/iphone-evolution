import { useEffect } from 'react'
import { preloadModel, releaseModel } from '../three/gltfCache'

/**
 * useModelWindow — mantém "quentes" (pré-carregados) os modelos GLB perto
 * da geração ativa, e libera (dispose + tira do cache) os que ficaram
 * longe o bastante pra não terem previsão de voltar tão cedo.
 *
 * Dois raios bem separados, de propósito:
 * - `preloadRadius` (curto): toda vez que `activeIndex` muda, pré-carrega
 *   de -1 a +2 posições ao redor dele — cobre o aparelho anterior (volta
 *   rolando pra cima), o atual, o próximo (já teria sido pego mesmo só
 *   com +1) e mais um de "antecedência" pra rolagem rápida não alcançar
 *   um modelo que ainda nem começou a carregar.
 * - `keepRadius` (bem mais largo que o de preload): só libera o que está
 *   a mais de 4 posições de distância. A folga entre os dois raios existe
 *   pra evitar "flapping" — se fossem iguais, ficar oscilando bem na
 *   borda do raio faria carregar e liberar o mesmo modelo repetidamente.
 *
 * Efeito puro (sem estado, sem re-render): só side-effects sobre o cache
 * de GLTF do @react-three/drei (ver src/three/gltfCache.js).
 */
export function useModelWindow({ devices, activeIndex, preloadRadius = 1, keepRadius = 4 }) {
  useEffect(() => {
    for (let offset = -preloadRadius; offset <= preloadRadius + 1; offset += 1) {
      preloadModel(devices[activeIndex + offset]?.modelPath)
    }

    devices.forEach((device, index) => {
      if (Math.abs(index - activeIndex) > keepRadius) {
        releaseModel(device.modelPath)
      }
    })
  }, [devices, activeIndex, preloadRadius, keepRadius])
}
