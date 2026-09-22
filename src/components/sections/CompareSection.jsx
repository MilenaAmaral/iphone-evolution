import { useRef } from 'react'
import { devices } from '../../data/devices'
import StaticPhoneViewer from '../phone/StaticPhoneViewer'
import { useDragSlider } from '../../hooks/useDragSlider'
import { useInView } from '../../hooks/useInView'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { getThicknessMm, getWeightGrams, formatSignedNumber } from '../../utils/deviceStats'
import './CompareSection.css'

// Os dois extremos da linha do tempo — mesma fonte de verdade usada em
// OriginSection/CurrentSection (devices[0] e o último item do array),
// nunca um par escolhido à parte. Se um novo aparelho for adicionado ao
// dataset, esta comparação passa a usar o novo "mais recente" sozinha.
const OLDER = devices[0]
const NEWER = devices[devices.length - 1]

// Cada linha mostra o texto ORIGINAL de devices.js como valor (nunca um
// resumo inventado). `getDelta`, quando existe, é só uma subtração entre
// dois números já extraídos desse mesmo texto por deviceStats.js — ver o
// comentário lá sobre por que isso não conta como "dado novo".
const COMPARISON_ROWS = [
  { key: 'display', label: 'Tela' },
  { key: 'processor', label: 'Processador' },
  { key: 'camera', label: 'Câmera' },
  {
    key: 'weight',
    label: 'Peso',
    getDelta: (older, newer) => {
      const a = getWeightGrams(older)
      const b = getWeightGrams(newer)
      return a === null || b === null ? null : formatSignedNumber(b - a, { unit: ' g', decimals: 0 })
    },
  },
  {
    key: 'thickness',
    label: 'Espessura',
    getDelta: (older, newer) => {
      const a = getThicknessMm(older)
      const b = getThicknessMm(newer)
      return a === null || b === null ? null : formatSignedNumber(b - a, { unit: ' mm', decimals: 2 })
    },
  },
  { key: 'colors', label: 'Cores', format: (device) => device.colors.join(', ') },
]

/**
 * CompareSection — capítulo "Veja a evolução": os dois extremos da linha
 * do tempo lado a lado, com um slider horizontal de arrastar que
 * redimensiona a divisão entre os dois (o mesmo padrão de um "split view"
 * redimensionável, aqui aplicado a duas cenas 3D independentes).
 *
 * Como o efeito funciona (ver CompareSection.css pros detalhes visuais):
 * o palco é um flex container com DOIS painéis lado a lado, cada um com
 * seu próprio <Canvas> — nunca um único modelo cortado ao meio. `value`
 * (0–100, de useDragSlider) vira o `flex-basis` de cada painel
 * (`value`% pro antigo, `(100 - value)`% pro novo), então arrastar pra
 * direita alarga o painel do aparelho antigo e estreita o do novo, e
 * vice-versa. Cada <StaticPhoneViewer> redimensiona normalmente com o
 * próprio painel (o jeito NATIVO do R3F lidar com resize, via
 * ResizeObserver) — de propósito, em vez de sobrepor as duas cenas com um
 * `clip-path` recortando um <Canvas> por cima do outro: recortar um
 * elemento WebGL via CSS looks certo à primeira vista, mas é uma
 * combinação conhecida por ser instável sob renderização por software
 * (o Chromium headless usado nos testes deste projeto travava de forma
 * reproduzível ao arrastar o slider com esse approach) — dois painéis que
 * só mudam de LARGURA é uma operação muito mais comum e testada.
 *
 * Os dois <StaticPhoneViewer> só montam quando a seção está perto da
 * viewport (useInView) — mesmo motivo documentado em useInView.js: dois
 * <Canvas> rodando o tempo todo, em uma seção que o usuário pode nem
 * chegar a rolar até o fim, seria desperdício de CPU/GPU sem necessidade.
 */
function CompareSection() {
  const sectionRef = useRef(null)
  const viewerInView = useInView(sectionRef, { rootMargin: '20% 0px' })
  useScrollReveal(sectionRef)

  const { value, trackRef, trackHandlers, handleKeyDown } = useDragSlider({ initial: 50, min: 12, max: 88 })
  const roundedValue = Math.round(value)

  return (
    <section className="compare-section" id="comparar" ref={sectionRef}>
      <header className="compare-section__intro">
        <p className="section-kicker" data-reveal>
          Capítulo 09 — Veja a evolução
        </p>
        <h2 className="section-heading" data-reveal>
          {OLDER.name} contra {NEWER.name}.
        </h2>
        <p className="section-lede" data-reveal>
          Arraste a divisória pra dar mais espaço a um lado ou ao outro — os
          dois extremos desta linha do tempo, lado a lado.
        </p>
      </header>

      <div className="compare-stage" ref={trackRef} {...trackHandlers} data-reveal>
        <div className="compare-stage__pane" style={{ flexBasis: `${value}%` }}>
          <span className="compare-stage__tag compare-stage__tag--older" aria-hidden="true">
            {OLDER.name} · {OLDER.year}
          </span>
          {viewerInView && (
            <StaticPhoneViewer modelPath={OLDER.modelPath} scale={OLDER.modelScale} rotation={[0, -0.32, 0]} />
          )}
        </div>

        <div className="compare-stage__pane" style={{ flexBasis: `${100 - value}%` }}>
          <span className="compare-stage__tag compare-stage__tag--newer" aria-hidden="true">
            {NEWER.name} · {NEWER.year}
          </span>
          {viewerInView && (
            <StaticPhoneViewer modelPath={NEWER.modelPath} scale={NEWER.modelScale} rotation={[0, 0.32, 0]} />
          )}
        </div>

        <div className="compare-stage__divider" style={{ left: `${value}%` }} aria-hidden="true" />

        <button
          type="button"
          className="compare-stage__handle"
          style={{ left: `${value}%` }}
          role="slider"
          aria-orientation="horizontal"
          aria-label={`Comparar ${OLDER.name} com ${NEWER.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={roundedValue}
          onKeyDown={handleKeyDown}
        >
          <span aria-hidden="true">⟨ ⟩</span>
        </button>
      </div>

      <dl
        className="compare-table"
        data-reveal
        style={{ '--older-emphasis': value / 100, '--newer-emphasis': 1 - value / 100 }}
      >
        <div className="compare-table__row compare-table__row--head">
          <span />
          <span className="compare-table__col compare-table__col--older">{OLDER.name}</span>
          <span className="compare-table__col compare-table__col--newer">{NEWER.name}</span>
        </div>

        {COMPARISON_ROWS.map((row) => {
          const delta = row.getDelta?.(OLDER, NEWER)
          const format = row.format ?? ((device) => device[row.key])

          return (
            <div className="compare-table__row" key={row.key}>
              <dt>
                {row.label}
                {delta && <span className="compare-table__delta">{delta}</span>}
              </dt>
              <dd className="compare-table__col compare-table__col--older">{format(OLDER)}</dd>
              <dd className="compare-table__col compare-table__col--newer">{format(NEWER)}</dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

export default CompareSection
