import { useEffect, useState } from 'react'

/**
 * useInView — `true` enquanto `ref` está perto da viewport, `false`
 * quando está longe. Ao contrário de um "já apareceu uma vez" que trava em
 * `true` pra sempre, aqui o valor acompanha a posição atual do scroll.
 *
 * Existe especificamente pra controlar quando montar `<Canvas>` (WebGL/
 * Three.js) das seções com visualizador 3D independente (Origem,
 * Atualidade). Esta experiência já tem UM <Canvas> sempre ativo em
 * EvolutionSection (o coração do scroll pinado) — cada um desses cria seu
 * próprio loop de render (`useFrame`, `OrbitControls autoRotate`) que
 * roda pra sempre enquanto montado. Se Origem e Atualidade ficassem
 * montadas assim que o usuário passasse por elas uma vez, ao final da
 * página existiriam TRÊS contextos WebGL animando ao mesmo tempo, pra
 * sempre — desperdício de CPU/GPU/bateria sem nenhum ganho visual, já que
 * o usuário só olha um por vez. Desmontar ao sair da viewport é seguro
 * (barato remontar depois) porque o modelo/textura já está no cache do
 * `useGLTF` (ver src/three/gltfCache.js) — remontar não refaz nenhum
 * download, só reconstrói a cena a partir do que já está em memória.
 */
export function useInView(ref, { rootMargin = '35% 0px' } = {}) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}

export default useInView
