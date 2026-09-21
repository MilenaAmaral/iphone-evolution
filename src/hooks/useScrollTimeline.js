import { useLayoutEffect, useRef } from 'react'
import { createScrollTimeline } from '../animations/scrollTimeline'
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
 */
export function useScrollTimeline({ sectionRef, pinRef, titleRef, panelRef, deviceCount, progressRef }) {
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

    const cleanup = createScrollTimeline({
      section,
      pin,
      title,
      panel,
      segments,
      onUpdate: handleUpdate,
    })

    return cleanup
  }, [sectionRef, pinRef, titleRef, panelRef, deviceCount, progressRef])
}
