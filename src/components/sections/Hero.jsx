import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../utils/motionPreference'
import AppleLogoHero from '../phone/AppleLogoHero'
import './Hero.css'

// Hero: abertura da experiência. Fica fora do Canvas 3D (o PhoneViewer
// fica fixo atrás dela) e só cuida de uma pequena animação de entrada com
// GSAP — sem lógica de dados.
function Hero() {
  const titleWordsRef = useRef([])
  const subtitleRef = useRef(null)
  const hintRef = useRef(null)
  const titleWords = ['Uma', 'evolução', 'em', '3D.']

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(titleWordsRef.current, { opacity: 1, yPercent: 0 })
        gsap.set(subtitleRef.current, { opacity: 1, scaleX: 1 })
        gsap.set(hintRef.current, { opacity: 1, y: 0 })
        return
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(titleWordsRef.current, {
          opacity: 0,
          yPercent: 115,
          duration: 0.78,
          stagger: 0.1,
        }, 0.32)
        .fromTo(subtitleRef.current, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: 'left center',
        }, {
          opacity: 1,
          scaleX: 1,
          duration: 0.82,
          ease: 'power2.inOut',
        }, '-=0.34')
        .from(hintRef.current, { opacity: 0, y: 8, duration: 0.5 }, '-=0.12')
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="topo">
      <AppleLogoHero />
      <h1 className="hero__title" aria-label="Uma evolução em 3D.">
        {titleWords.map((word, index) => (
          <span className="hero__word-clip" key={word}>
            <span
              ref={(element) => {
                if (element) titleWordsRef.current[index] = element
              }}
              className="hero__word"
              aria-hidden="true"
            >
              {word}
            </span>
          </span>
        ))}
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
