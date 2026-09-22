import { useMemo, useRef } from 'react'
import { devices, getDeviceById } from '../../data/devices'
import { getThicknessMm, getWeightGrams, getDisplayInches } from '../../utils/deviceStats'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './DesignSection.css'

const FEATURED_DEVICES = devices.filter((device) => device.timelineHighlight)

// Cada linha do gráfico usa um parser diferente de deviceStats.js pra
// extrair o número já presente no texto verificado, e mostra o texto
// ORIGINAL como valor (nunca o número sozinho) — a barra é só apoio visual.
const METRICS = [
  { key: 'thickness', label: 'Espessura', unit: 'mm', getValue: getThicknessMm, getDisplay: (d) => d.thickness },
  { key: 'weight', label: 'Peso', unit: 'g', getValue: getWeightGrams, getDisplay: (d) => d.weight },
  { key: 'display', label: 'Tamanho de tela', unit: '"', getValue: getDisplayInches, getDisplay: (d) => d.display },
]

// Único highlight do dataset que cita explicitamente uma mudança de
// material (traseira de vidro do iPhone 8) — citado literalmente, não
// parafraseado.
const MATERIAL_NOTE_DEVICE_ID = 'iphone-8'

/**
 * DesignSection — capítulo 7 ("DESIGN"): três leituras horizontais de como
 * o corpo físico do aparelho mudou (espessura, peso, tamanho de tela),
 * todas construídas em cima de números extraídos do próprio texto
 * verificado de devices.js (ver src/utils/deviceStats.js — nunca um valor
 * novo). O dataset não tem um campo de "material" por geração, então a
 * mudança de material mostrada aqui é literal: a única frase do dataset
 * que descreve isso (a traseira de vidro do iPhone 8), citada sem
 * paráfrase.
 */
function DesignSection() {
  const containerRef = useRef(null)
  useScrollReveal(containerRef, { selector: '.design-section__intro [data-reveal]' })
  useScrollReveal(containerRef, { selector: '.metric-row', y: 24, start: 'top 88%', stagger: 0.15 })
  useScrollReveal(containerRef, { selector: '.design-section__material', y: 24, start: 'top 88%' })

  const materialDevice = getDeviceById(MATERIAL_NOTE_DEVICE_ID)

  const ranges = useMemo(() => {
    const result = {}
    for (const metric of METRICS) {
      const values = FEATURED_DEVICES.map((device) => metric.getValue(device)).filter(
        (value) => value !== null
      )
      result[metric.key] = { min: Math.min(...values), max: Math.max(...values) }
    }
    return result
  }, [])

  return (
    <section className="design-section section-shell" id="design" ref={containerRef}>
      <header className="design-section__intro">
        <p className="section-kicker" data-reveal>
          Capítulo 07 — Design
        </p>
        <h2 className="section-heading" data-reveal>
          Mais fino, mais leve, mais tela.
        </h2>
        <p className="section-lede" data-reveal>
          Cada barra é proporcional ao valor real declarado na ficha técnica
          daquela geração — o texto ao lado é o dado original, por extenso.
        </p>
      </header>

      <div className="design-section__metrics">
        {METRICS.map((metric) => {
          const { min, max } = ranges[metric.key]
          const span = max - min || 1

          return (
            <div className="metric-row" key={metric.key}>
              <h3 className="metric-row__label">{metric.label}</h3>
              <div className="metric-row__bars">
                {FEATURED_DEVICES.map((device) => {
                  const value = metric.getValue(device)
                  const ratio = value === null ? 0 : 0.15 + 0.85 * ((value - min) / span)

                  return (
                    <div className="metric-bar" key={device.id} title={`${device.name} — ${metric.getDisplay(device)}`}>
                      <span className="metric-bar__year">{device.year}</span>
                      <div className="metric-bar__track">
                        <span className="metric-bar__fill" style={{ '--ratio': ratio }} />
                      </div>
                      <span className="metric-bar__value">{metric.getDisplay(device)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="design-section__material">
        <p className="design-section__material-kicker">Materiais</p>
        <p className="design-section__material-text">
          {materialDevice.year} — {materialDevice.name}: “{materialDevice.highlights[0]}”
        </p>
      </div>
    </section>
  )
}

export default DesignSection
