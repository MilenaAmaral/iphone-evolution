import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import realIphones from '../../data/realIphones'
import IphoneViewer from '../phone/IphoneViewer'
import './RealIphonesSection.css'

const transition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] }

function RealIphonesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIphone = realIphones[activeIndex]

  return (
    <section className="real-iphones section-shell" id="modelos-reais">
      <div className="real-iphones__header">
        <p className="section-kicker">Modelos reais</p>
        <h2 className="section-heading">A evolução, em mãos.</h2>
        <p className="section-lede">Explore os aparelhos disponíveis em 3D e acompanhe o que mudou em cada geração.</p>
      </div>

      <div className="real-iphones__timeline" aria-label="Selecionar geração do iPhone">
        {realIphones.map((iphone, index) => (
          <button
            key={iphone.id}
            type="button"
            className={`real-iphones__year${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
          >
            <span>{iphone.year}</span>
            <strong>{iphone.name}</strong>
          </button>
        ))}
      </div>

      <div className="real-iphones__layout">
        <div className="real-iphones__viewer">
          <IphoneViewer key={activeIphone.id} modelPath={activeIphone.modelPath} label={`Modelo 3D do ${activeIphone.name}`} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIphone.id}
            className="real-iphones__info"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
          >
            <span className="real-iphones__eyebrow">{String(activeIphone.year)} / geração</span>
            <h3>{activeIphone.name}</h3>
            <p className="real-iphones__description">{activeIphone.description}</p>

            <ul className="real-iphones__highlights">
              {activeIphone.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>

            <dl className="real-iphones__specs">
              <div><dt>Tela</dt><dd>{activeIphone.specs.display}</dd></div>
              <div><dt>Câmera</dt><dd>{activeIphone.specs.camera}</dd></div>
              <div><dt>Chip</dt><dd>{activeIphone.specs.processor}</dd></div>
              <div><dt>Peso</dt><dd>{activeIphone.specs.weight}</dd></div>
              <div><dt>Dimensões</dt><dd>{activeIphone.specs.dimensions}</dd></div>
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default RealIphonesSection