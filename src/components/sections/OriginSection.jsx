import { useRef } from 'react'
import { devices } from '../../data/devices'
import PhoneViewer from '../phone/PhoneViewer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useInView } from '../../hooks/useInView'
import './OriginSection.css'

// Especificações mostradas como "selos" — mesmos rótulos de SpecsSection,
// só que em forma de pílula compacta em vez de tabela.
const SPEC_PILLS = [
  { key: 'display', label: 'Tela' },
  { key: 'processor', label: 'Processador' },
  { key: 'camera', label: 'Câmera' },
]

/**
 * OriginSection — capítulo 2 da narrativa ("ORIGEM"): apresenta o primeiro
 * modelo da linha do tempo. Diferente de EvolutionSection (que reage ao
 * aparelho ATIVO no store, trocado pelo scroll), aqui o aparelho é sempre
 * `devices[0]` — é uma âncora fixa da história, não algo que muda.
 *
 * Usa o mesmo <PhoneViewer> "burro" (OrbitControls, sem scroll pinado)
 * já usado como visualizador autônomo em outros contextos — aqui ele só
 * gira sozinho, convidando o usuário a olhar o aparelho antes de seguir a
 * viagem no tempo.
 */
function OriginSection() {
  const origin = devices[0]
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const viewerInView = useInView(viewerRef)

  useScrollReveal(containerRef)

  return (
    <section className="origin-section" id="origem" ref={containerRef}>
      <span className="origin-section__year-mark" aria-hidden="true">
        {origin.year}
      </span>

      <div className="origin-section__grid">
        <div className="origin-section__copy">
          <p className="section-kicker" data-reveal>
            Capítulo 01 — A origem
          </p>
          <h2 className="section-heading" data-reveal>
            {origin.name}
          </h2>
          <p className="section-lede" data-reveal>
            {origin.year} — o ponto de partida desta linha do tempo. Tudo o
            que vem a seguir nesta experiência parte daqui.
          </p>

          <ul className="origin-section__highlights" data-reveal>
            {origin.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <dl className="origin-section__specs" data-reveal>
            {SPEC_PILLS.map((pill) => (
              <div className="origin-section__spec" key={pill.key}>
                <dt>{pill.label}</dt>
                <dd>{origin[pill.key]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="origin-section__viewer" data-reveal ref={viewerRef}>
          {/* Canvas WebGL só monta quando a seção fica perto da viewport
              (ver useInView) — evita ter dois/três <Canvas> rodando ao
              mesmo tempo desde o carregamento da página. */}
          {viewerInView && <PhoneViewer modelPath={origin.modelPath} scale={origin.modelScale} />}
        </div>
      </div>
    </section>
  )
}

export default OriginSection
