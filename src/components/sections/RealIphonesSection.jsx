import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import iphoneCatalog from '../../data/iphoneCatalog'
import IphoneViewer from '../phone/IphoneViewer'
import IphoneImageViewer from '../phone/IphoneImageViewer'
import { useInView } from '../../hooks/useInView'
import { prefersReducedMotion } from '../../utils/motionPreference'
import './RealIphonesSection.css'

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
function RealIphonesSection() {
  const sectionRef = useRef(null)
  const timelineRef = useRef(null)
  const activeButtonRef = useRef(null)
  const viewerInView = useInView(sectionRef)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeGeneration = iphoneCatalog[activeIndex]
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
        <p className="section-kicker">2007 — agora</p>
        <h2 className="section-heading">A evolução, em mãos.</h2>
        <p className="section-lede">Uma linha do tempo visual do design do iPhone, do primeiro toque ao formato mais recente.</p>
      </div>

      <div className="real-iphones__timeline" ref={timelineRef} aria-label="Selecionar geração do iPhone">
        {iphoneCatalog.map((generation, index) => (
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
          {viewerInView && activeGeneration.type === '3d' && (
            <IphoneViewer key={activeGeneration.modelPath} modelPath={activeGeneration.modelPath} label={`Modelo 3D do ${activeGeneration.name}`} />
          )}
          {viewerInView && activeGeneration.type === 'image' && (
            <IphoneImageViewer key={activeGeneration.id} device={activeGeneration} />
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