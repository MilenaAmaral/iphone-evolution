import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/motionPreference'

gsap.registerPlugin(ScrollTrigger)

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

    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      const targets = container.matches(selector)
        ? [container]
        : Array.from(container.querySelectorAll(selector))

      targets.forEach((target, index) => {
        if (reduced) {
          gsap.set(target, { opacity: 1, y: 0 })
          return
        }

        gsap.fromTo(
          target,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease,
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
