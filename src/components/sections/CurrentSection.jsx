import { useRef } from 'react'
import { devices } from '../../data/devices'
import PhoneViewer from '../phone/PhoneViewer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useInView } from '../../hooks/useInView'
import './CurrentSection.css'

const SPEC_ROWS = [
  { key: 'display', label: 'Tela' },
  { key: 'processor', label: 'Processador' },
  { key: 'camera', label: 'Câmera' },
  { key: 'weight', label: 'Peso' },
  { key: 'thickness', label: 'Espessura' },
]

/**
 * CurrentSection — capítulo 8 ("ATUALIDADE"), o fechamento da narrativa:
 * a geração mais recente presente em devices.js. Como o array é a única
 * fonte de verdade da linha do tempo, "mais recente" é sempre
 * `devices[devices.length - 1]` — nunca um id fixo, então o capítulo se
 * atualiza sozinho no dia em que uma nova geração for adicionada ao
 * dataset.
 */
function CurrentSection() {
  const current = devices[devices.length - 1]
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const viewerInView = useInView(viewerRef)

  useScrollReveal(containerRef)

  return (
    <section className="current-section" id="atualidade" ref={containerRef}>
      <div className="current-section__grid">
        <div className="current-section__viewer" data-reveal ref={viewerRef}>
          {/* Mesmo motivo do Canvas condicional em OriginSection.jsx: só
              monta o visualizador 3D quando o capítulo está perto de
              entrar na tela. */}
          {viewerInView && <PhoneViewer modelPath={current.modelPath} scale={current.modelScale} />}
        </div>

        <div className="current-section__copy">
          <p className="section-kicker" data-reveal>
            Capítulo 08 — Atualidade
          </p>
          <h2 className="section-heading" data-reveal>
            {current.name}
          </h2>
          <p className="section-lede" data-reveal>
            {current.year} — a geração mais recente desta linha do tempo,
            até aqui.
          </p>

          <ul className="current-section__highlights" data-reveal>
            {current.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <dl className="current-section__specs" data-reveal>
            {SPEC_ROWS.map((row) => (
              <div className="current-section__spec" key={row.key}>
                <dt>{row.label}</dt>
                <dd>{current[row.key]}</dd>
              </div>
            ))}
            <div className="current-section__spec">
              <dt>Cores de lançamento</dt>
              <dd>{current.colors.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export default CurrentSection
