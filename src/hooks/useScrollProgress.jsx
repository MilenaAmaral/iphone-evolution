import { createContext, useContext, useRef } from 'react'

const ScrollProgressContext = createContext(null)

/**
 * ScrollProgressProvider — cria dois refs estáveis (os objetos nunca são
 * trocados, só `.current` é mutado) e os distribui via Context:
 *
 * - `progressRef`: valores CONTÍNUOS do scroll (progress/activeIndex/
 *   localProgress/direction), escritos por useScrollTimeline a cada tick
 *   e lidos por quem precisa deles a 60fps (ScrollControlledPhone/
 *   ScrollCameraRig, dentro de useFrame). Mutar `.current` nunca dispara
 *   re-render — é só leitura/escrita de propriedade de objeto.
 * - `navigateRef`: um ref que GUARDA uma função (não um valor de dados).
 *   useScrollTimeline é quem sabe converter "índice do aparelho" em
 *   posição de scroll (só ele tem acesso ao ScrollTrigger); ele preenche
 *   `navigateRef.current` com essa função assim que a timeline é criada.
 *   Quem só precisa "navegar até uma geração" (a Timeline, por clique)
 *   não precisa saber nada sobre scroll/pixels — só chama
 *   `useGenerationNavigator()` e recebe uma função pronta.
 */
export function ScrollProgressProvider({ children }) {
  const progressRef = useRef({
    progress: 0, // 0..1 — posição no scroll total da seção
    activeIndex: 0, // índice do aparelho "atual" (espelha o do store, mas lido sem assinar)
    localProgress: 0, // 0..1 — progresso dentro da transição current → next
    direction: 1, // 1 rolando pra baixo, -1 rolando pra cima (do próprio ScrollTrigger)
  })
  const navigateRef = useRef(null)

  // `contextValue` não precisa de useMemo: os dois campos são refs cuja
  // IDENTIDADE nunca muda (useRef garante isso), então o objeto literal
  // recriado a cada render tem sempre os mesmos dois refs dentro — quem
  // consome via useContext não re-renderiza por isso, já que nem
  // progressRef nem navigateRef (as únicas coisas lidas) trocam de valor.
  return (
    <ScrollProgressContext.Provider value={{ progressRef, navigateRef }}>
      {children}
    </ScrollProgressContext.Provider>
  )
}

function useScrollProgressContext() {
  const ctx = useContext(ScrollProgressContext)
  if (!ctx) {
    throw new Error('useScrollProgress precisa ser usado dentro de <ScrollProgressProvider>')
  }
  return ctx
}

// Para quem lê o progresso contínuo do scroll (cena 3D, dentro de useFrame).
export function useScrollProgress() {
  return useScrollProgressContext().progressRef
}

// Para quem precisa NAVEGAR até uma geração (Timeline, por clique) sem
// conhecer nada sobre scroll/pixels/ScrollTrigger. Retorna uma função
// estável `(index) => void`; se a timeline ainda não terminou de montar
// (raríssimo, só entre o primeiro render e o useLayoutEffect), a chamada
// é ignorada silenciosamente em vez de quebrar.
export function useGenerationNavigator() {
  const { navigateRef } = useScrollProgressContext()
  return function navigateToGeneration(index) {
    navigateRef.current?.(index)
  }
}

// Lado "produtor": só quem MONTA a timeline (useScrollTimeline, chamado
// por EvolutionSectionContent) precisa do ref cru, pra preencher
// `.current` com a função de navegação de verdade assim que o
// ScrollTrigger existe. Componentes de UI (Timeline) usam
// useGenerationNavigator() acima, nunca este hook.
export function useNavigateRef() {
  return useScrollProgressContext().navigateRef
}
