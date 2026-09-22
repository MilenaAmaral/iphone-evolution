import { useMemo, useRef } from 'react'
import { devices } from '../../data/devices'
import { getMainCameraMP, getLensCount } from '../../utils/deviceStats'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './CamerasSection.css'

// Reaproveita a mesma curadoria usada pela Timeline (uma geração "redonda"
// por ano) — ver o comentário sobre `timelineHighlight` em devices.js.
// Mantém a galeria legível em vez de comparar as 19 gerações de uma vez.
const FEATURED_DEVICES = devices.filter((device) => device.timelineHighlight)

/**
 * CamerasSection — capítulo 5 ("CÂMERAS"): compara a evolução das câmeras
 * traseiras. A altura de cada barra e o número de "pontos" de lente vêm de
 * src/utils/deviceStats.js — extraídos do próprio texto verificado de
 * `camera` em devices.js, nunca de um número novo. O texto completo da
 * ficha (com aberturas, quando divulgadas) continua visível abaixo de
 * cada card, então a barra é só um resumo visual, nunca a única fonte.
 */
function CamerasSection() {
  const containerRef = useRef(null)
  useScrollReveal(containerRef, { selector: '.cameras-section__intro [data-reveal]' })
  useScrollReveal(containerRef, { selector: '.camera-card', y: 36, start: 'top 88%', stagger: 0.06 })

  const maxMP = useMemo(
    () => Math.max(...FEATURED_DEVICES.map((device) => getMainCameraMP(device) ?? 0)),
    []
  )

  return (
    <section className="cameras-section section-shell" id="cameras" ref={containerRef}>
      <header className="cameras-section__intro">
        <p className="section-kicker" data-reveal>
          Capítulo 05 — Câmeras
        </p>
        <h2 className="section-heading" data-reveal>
          De uma lente a três.
        </h2>
        <p className="section-lede" data-reveal>
          A altura de cada barra é proporcional à resolução do sensor
          principal citado na ficha técnica de cada geração.
        </p>
      </header>

      <ul className="cameras-section__grid">
        {FEATURED_DEVICES.map((device) => {
          const mp = getMainCameraMP(device)
          const lensCount = getLensCount(device)
          const barHeight = mp ? Math.max(10, Math.round((mp / maxMP) * 100)) : 10

          return (
            <li className="camera-card" key={device.id}>
              <div className="camera-card__bar-track" aria-hidden="true">
                <span className="camera-card__bar" style={{ '--bar-height': `${barHeight}%` }} />
              </div>
              <span className="camera-card__mp">{mp ? `${mp}MP` : '—'}</span>
              <span className="camera-card__lenses" aria-hidden="true">
                {Array.from({ length: lensCount }).map((_, index) => (
                  <i key={index} />
                ))}
              </span>
              <span className="camera-card__year">
                {device.year} · {device.name}
              </span>
              <p className="camera-card__spec">{device.camera}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default CamerasSection
