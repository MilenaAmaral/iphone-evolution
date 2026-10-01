import { useEffect } from 'react'
import { preloadModel } from '../three/gltfCache'

/**
 * usePreloadModel — começa a baixar o visualizador 3D e o .glb ANTES da
 * seção entrar na tela (margem de 1 viewport), para que o <Canvas>, que só
 * monta quando a seção está visível, encontre o modelo em cache.
 *
 * Dispara uma única vez por seção.
 */
export function usePreloadModel(ref, modelPath, { rootMargin = '100% 0px' } = {}) {
  useEffect(() => {
    const node = ref.current
    if (!node || !modelPath || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        preloadModel(modelPath)
      },
      { rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, modelPath, rootMargin])
}

export default usePreloadModel
