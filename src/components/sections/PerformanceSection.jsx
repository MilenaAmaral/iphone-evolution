import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { devices } from '../../data/devices'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { prefersReducedMotion } from '../../utils/motionPreference'
import './PerformanceSection.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * PerformanceSection — capítulo 6 ("PERFORMANCE"): a evolução dos
 * processadores, geração a geração, direto do campo `processor` de
 * devices.js (texto integral, sem resumir ou converter em uma pontuação
 * inventada — o dataset não tem nenhum benchmark comparável entre chips
 * tão diferentes, então nenhuma "nota de desempenho" é fabricada aqui).
 *
 * Usa TODAS as gerações (não só o subconjunto `timelineHighlight`, que é
 * curado pra navegação) — faz sentido aqui porque cada card é só texto
 * compacto, e ver a cadência ano a ano reforça a sensação de tempo
 * passando.
 *
 * Anima uma linha vertical "acendendo" (scaleY 0→1) conforme o usuário
 * rola pela seção, via ScrollTrigger com scrub — diferente do reveal
 * "único" das outras seções, aqui a animação acompanha o scroll em tempo
 * real, dando à seção uma textura de "linha do tempo sendo desenhada".
 */
function PerformanceSection() {
  const containerRef = useRef(null)
  const lineRef = useRef(null)

  useScrollReveal(containerRef, { selector: '.performance-section__intro [data-reveal]' })
  useScrollReveal(containerRef, { selector: '.chip-card', y: 24, start: 'top 92%', stagger: 0.04 })

  useEffect(() => {
    const container = containerRef.current
    const line = lineRef.current
    if (!container || !line) return undefined

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // A linha "se desenhando" junto com o scroll é puramente
        // decorativa — com movimento reduzido, ela já aparece completa.
        gsap.set(line, { scaleY: 1 })
        return
      }

      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: 0.6,
          },
        }
      )
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section className="performance-section section-shell" id="performance" ref={containerRef}>
      <header className="performance-section__intro">
        <p className="section-kicker" data-reveal>
          Capítulo 06 — Performance
        </p>
        <h2 className="section-heading" data-reveal>
          Um chip por ano, quase 20 anos seguidos.
        </h2>
        <p className="section-lede" data-reveal>
          Do ARM11 de 412 MHz ao A20 Pro — cada linha abaixo é o texto
          integral do processador declarado para aquela geração.
        </p>
      </header>

      <div className="performance-section__track">
        <span ref={lineRef} className="performance-section__line" aria-hidden="true" />

        <ol className="performance-section__list">
          {devices.map((device) => (
            <li className="chip-card" key={device.id}>
              <span className="chip-card__year">{device.year}</span>
              <div className="chip-card__body">
                <h3 className="chip-card__device">{device.name}</h3>
                <p className="chip-card__processor">{device.processor}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default PerformanceSection
