import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import evolutionGenerations from '../../data/evolutionGenerations'
import IphoneViewer from '../phone/IphoneViewer'
import { useInView } from '../../hooks/useInView'
import { prefersReducedMotion } from '../../utils/motionPreference'
import './RealIphonesSection.css'

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
const ORIGINAL_MODEL = '/models/iphone_1st_generation.glb'
const FINAL_MODEL = '/models/iphone-18-pro-max.glb'

function RealIphonesSection() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const activeButtonRef = useRef(null)
  const viewerInView = useInView(sectionRef)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeGeneration = evolutionGenerations[activeIndex]
  const isFinalGeneration = activeGeneration.year === 2026
  const isModelGeneration = activeGeneration.year === 2007 || isFinalGeneration
  const modelPath = isFinalGeneration ? FINAL_MODEL : ORIGINAL_MODEL
  const activeSpecs = [
    ['Tela', activeGeneration.display],
    ['Câmera', activeGeneration.camera],
    ['Processador', activeGeneration.processor],
    ['Armazenamento', activeGeneration.storage],
    ['Peso', activeGeneration.weight],
    ['Conectividade', activeGeneration.connectivity],
    ['Espessura', activeGeneration.thickness],
  ].filter(([, value]) => value)

  useEffect(() => {
    const timeline = timelineRef.current
    const activeButton = activeButtonRef.current
    if (!timeline || !activeButton) return

    const targetLeft = activeButton.offsetLeft - (timeline.clientWidth - activeButton.clientWidth) / 2
    timeline.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [activeIndex])

  return (
    <section className="real-iphones section-shell" id="modelos-reais" ref={sectionRef}>
      <div className="real-iphones__header">
        <p className="section-kicker">2007 — 2026</p>
        <h2 className="section-heading">A evolução, em mãos.</h2>
        <p className="section-lede">Uma timeline de mudanças, conduzida por dois modelos: o começo e o agora.</p>
      </div>

      <div className="real-iphones__timeline" ref={timelineRef} aria-label="Selecionar geração do iPhone">
        {evolutionGenerations.map((generation, index) => (
          <button
            key={generation.id}
            ref={index === activeIndex ? activeButtonRef : null}
            type="button"
            className={`real-iphones__year${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
          >
            <span>{generation.year}</span>
            <strong>{generation.name}</strong>
          </button>
        ))}
      </div>

      <div className="real-iphones__layout">
        <div className="real-iphones__viewer">
          {viewerInView && isModelGeneration && (
            <IphoneViewer key={modelPath} modelPath={modelPath} label={`Modelo 3D do ${isFinalGeneration ? 'iPhone 18 Pro Max' : 'iPhone original'}`} />
          )}
          {!isModelGeneration && (
            <div className="real-iphones__text-stage" aria-hidden="true">
              <span>Uma geração em transformação</span>
              <strong>{activeGeneration.year}</strong>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGeneration.id}
            className="real-iphones__info"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
          >
            <span className="real-iphones__eyebrow">{String(activeGeneration.year)} / geração</span>
            <h3>{activeGeneration.name}</h3>
            <p className="real-iphones__description">{activeGeneration.description}</p>

            <ul className="real-iphones__highlights">
              {activeGeneration.innovation && <li>{activeGeneration.innovation}</li>}
              {activeGeneration.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>

            <dl className="real-iphones__specs">
              {activeSpecs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default RealIphonesSection