import { useLayoutEffect, useRef } from 'react'
import { createScrollTimeline, scrollToSegment } from '../animations/scrollTimeline'
import { useExperienceStore } from '../store/useExperienceStore'

/**
 * useScrollTimeline — ponte entre o GSAP/ScrollTrigger (fora de React) e
 * a experiência: monta a timeline em `createScrollTimeline`, e a cada
 * atualização de scroll faz DUAS coisas com naturezas bem diferentes:
 *
 * 1) Escreve valores CONTÍNUOS (progress, localProgress, direction) direto
 *    em `progressRef.current` — nunca via useState/setState. Isso é lido
 *    dentro de useFrame (ScrollControlledPhone/ScrollCameraRig), então
 *    precisa estar disponível a qualquer momento sem esperar um re-render
 *    do React, e sem CAUSAR um re-render a cada tick de scroll (que pode
 *    disparar dezenas de vezes por segundo).
 *
 * 2) Atualiza o estado DISCRETO (activeIndex no Zustand) — mas só quando
 *    o índice calculado realmente muda de um aparelho pro outro, nunca a
 *    cada tick. Isso é o que a Timeline/PhoneInfo (DOM comum) leem para
 *    re-renderizar texto — não precisa e não deve rodar a 60fps.
 *
 * `useLayoutEffect` (em vez de `useEffect`) porque o ScrollTrigger precisa
 * medir posições no DOM (offsetTop, alturas) antes do navegador pintar o
 * próximo frame — medir depois causaria um "pulo" visível no pin.
 *
 * Também é quem PREENCHE `navigateRef.current` (ver useScrollProgress.jsx)
 * com uma função `(index) => void`: clicar num item da Timeline não pula
 * direto pro aparelho (isso seria a "mudança brusca" que o spec pede pra
 * evitar) — em vez disso, rola a página suavemente até o ponto exato do
 * scroll pinado onde aquele aparelho fica ativo. Como é a MESMA rolagem
 * que o `handleUpdate` abaixo já observa, toda a transição 3D (fade/
 * escala/rotação em ScrollControlledPhone, câmera em ScrollCameraRig) e a
 * atualização do estado ativo acontecem de graça, sem duplicar nenhuma
 * lógica de transição — só estamos "dirigindo" o mesmo scroll de forma
 * programática em vez de com a roda do mouse.
 */
export function useScrollTimeline({ sectionRef, pinRef, titleRef, panelRef, deviceCount, progressRef, navigateRef }) {
  const lastIndexRef = useRef(0)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const title = titleRef.current
    const panel = panelRef.current
    if (!section || !pin) return undefined

    const segments = Math.max(1, deviceCount - 1)

    function handleUpdate(self) {
      const progress = self.progress
      // Posição contínua "escalada" pelo número de segmentos: a parte
      // inteira é o índice do aparelho atual, a fração é o quanto já se
      // avançou rumo ao próximo (localProgress, 0..1 dentro do segmento).
      const scaled = progress * segments
      const activeIndex = Math.min(segments, Math.floor(scaled))
      const localProgress = scaled - activeIndex

      const ref = progressRef.current
      ref.progress = progress
      ref.activeIndex = activeIndex
      ref.localProgress = localProgress
      ref.direction = self.direction

      if (activeIndex !== lastIndexRef.current) {
        lastIndexRef.current = activeIndex
        useExperienceStore.getState().setActiveIndex(activeIndex)
      }
    }

    const { cleanup, scrollTrigger } = createScrollTimeline({
      section,
      pin,
      title,
      panel,
      segments,
      onUpdate: handleUpdate,
    })

    navigateRef.current = function navigateToIndex(index) {
      scrollToSegment({ scrollTrigger, segments, index })
    }

    return function fullCleanup() {
      navigateRef.current = null
      cleanup()
    }
  }, [sectionRef, pinRef, titleRef, panelRef, deviceCount, progressRef, navigateRef])
}
