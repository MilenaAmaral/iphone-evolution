import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Timeline from '../timeline/Timeline'
import PhoneInfo from '../phone/PhoneInfo'
import PhoneViewer from '../phone/PhoneViewer'
import { useExperienceStore } from '../../store/useExperienceStore'
import './EvolutionSection.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * EvolutionSection: seção onde o usuário navega pelas gerações. Hoje a
 * navegação é por clique na Timeline (ver componente); a versão final vai
 * acoplar isso ao scroll com ScrollControls/ScrollTrigger, conforme o
 * roadmap do doc de arquitetura (fases 4 em diante) — por enquanto, o
 * GSAP aqui cuida só de uma revelação simples da seção ao entrar em tela.
 *
 * É quem lê o store e alimenta o <PhoneViewer> por props (modelPath) — o
 * viewer em si não sabe nada sobre "aparelho ativo" ou Zustand.
 */
function EvolutionSection() {
  const sectionRef = useRef(null)
  const activeDevice = useExperienceStore((state) => state.activeDevice)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="evolution-section" id="evolucao">
      <h2 className="evolution-section__title">A evolução</h2>
      <p className="evolution-section__lead">
        Escolha uma geração na linha do tempo para explorar o modelo 3D e os
        destaques daquele ano.
      </p>
      <div className="evolution-section__grid">
        <div className="evolution-section__viewer">
          <PhoneViewer modelPath={activeDevice.modelPath} />
        </div>
        <div className="evolution-section__panel">
          <Timeline />
          <PhoneInfo />
        </div>
      </div>
    </section>
  )
}

export default EvolutionSection
