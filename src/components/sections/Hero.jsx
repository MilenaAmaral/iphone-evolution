import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../utils/motionPreference'
import './Hero.css'

// Hero: abertura da experiência. Fica fora do Canvas 3D (o PhoneViewer
// fica fixo atrás dela) e só cuida de uma pequena animação de entrada com
// GSAP — sem lógica de dados.
function Hero() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // Mantém o fade (a entrada não deixa de existir), mas sem o
        // deslocamento vertical nem o escalonamento entre os três
        // elementos — tudo aparece junto, quase instantâneo.
        gsap.from([titleRef.current, subtitleRef.current, hintRef.current], {
          opacity: 0,
          duration: 0.3,
        })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(titleRef.current, { opacity: 0, y: 24, duration: 0.9 })
        .from(subtitleRef.current, { opacity: 0, y: 16, duration: 0.7 }, '-=0.45')
        .from(hintRef.current, { opacity: 0, duration: 0.6 }, '-=0.2')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="topo">
      <h1 ref={titleRef} className="hero__title">
        Uma evolução em 3D.
      </h1>
      <p ref={subtitleRef} className="hero__subtitle">
        Explore a transformação do iPhone através das gerações.
      </p>
      <span ref={hintRef} className="hero__scroll-hint" aria-hidden="true">
        role para explorar ↓
      </span>
    </section>
  )
}

export default Hero
