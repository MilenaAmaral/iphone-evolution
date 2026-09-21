import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollReveal — hook reutilizável pras animações "de entrada" das
 * seções de storytelling (ORIGEM, GRANDES MUDANÇAS, CÂMERAS, PERFORMANCE,
 * DESIGN, ATUALIDADE). Evita repetir o mesmo boilerplate de
 * gsap.context()+ScrollTrigger+ctx.revert() em cada componente.
 *
 * Diferente da timeline "scrubada" e pinada da EvolutionSection (que
 * conduz uma transição 3D contínua amarrada ao scroll), isto é uma
 * revelação simples e definitiva: cada elemento marcado por `selector`
 * dentro de `containerRef` ganha o PRÓPRIO ScrollTrigger (`trigger: o
 * próprio elemento`) e anima uma vez, assim que entra na viewport — o
 * efeito "a história vai se revelando conforme eu role", sem prender o
 * scroll do usuário.
 *
 * Usa `gsap.context()` + `ctx.revert()` no cleanup — o mesmo padrão já
 * comprovado em Hero.jsx: no unmount (ou StrictMode double-invoke em
 * dev), reverte todo estilo inline aplicado, sem deixar resíduo que
 * corrompa a próxima montagem.
 */
export function useScrollReveal(containerRef, options = {}) {
  const {
    selector = '[data-reveal]',
    y = 32,
    duration = 0.8,
    stagger = 0.12,
    start = 'top 82%',
    ease = 'power3.out',
  } = options

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const ctx = gsap.context(() => {
      const targets = container.matches(selector)
        ? [container]
        : Array.from(container.querySelectorAll(selector))

      targets.forEach((target, index) => {
        gsap.fromTo(
          target,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease,
            // Um pequeno atraso escalonado entre elementos próximos dá a
            // sensação de "sequência" mesmo quando vários entram na
            // viewport quase ao mesmo tempo (ex.: cards de um grid).
            delay: (index % 6) * stagger,
            scrollTrigger: {
              trigger: target,
              start,
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, container)

    return () => ctx.revert()
  }, [containerRef, selector, y, duration, stagger, start, ease])
}

export default useScrollReveal
