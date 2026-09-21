import { createContext, useContext, useRef } from 'react'

const ScrollProgressContext = createContext(null)

/**
 * ScrollProgressProvider — cria UM ref estável (o objeto nunca é trocado,
 * só `.current` é mutado) e o distribui via Context pros dois lados que
 * precisam dele: quem ESCREVE (useScrollTimeline, a cada tick do
 * ScrollTrigger) e quem LÊ (ScrollControlledPhone/ScrollCameraRig, dentro
 * de useFrame). Como o valor do Context nunca muda de identidade, mutar
 * `.current` 60x/s não dispara nenhum re-render em quem consome via
 * useScrollProgress() — é só leitura de uma propriedade de objeto.
 */
export function ScrollProgressProvider({ children }) {
  const progressRef = useRef({
    progress: 0, // 0..1 — posição no scroll total da seção
    activeIndex: 0, // índice do aparelho "atual" (espelha o do store, mas lido sem assinar)
    localProgress: 0, // 0..1 — progresso dentro da transição current → next
    direction: 1, // 1 rolando pra baixo, -1 rolando pra cima (do próprio ScrollTrigger)
  })

  return (
    <ScrollProgressContext.Provider value={progressRef}>{children}</ScrollProgressContext.Provider>
  )
}

export function useScrollProgress() {
  const ref = useContext(ScrollProgressContext)
  if (!ref) {
    throw new Error('useScrollProgress precisa ser usado dentro de <ScrollProgressProvider>')
  }
  return ref
}
