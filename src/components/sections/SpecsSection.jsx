import { useExperienceStore } from '../../store/useExperienceStore'
import './SpecsSection.css'

// Linhas da ficha técnica. Vive como configuração separada dos dados para
// que a ordem/rótulos de exibição possam mudar sem tocar em devices.js.
const SPEC_ROWS = [
  { key: 'display', label: 'Tela' },
  { key: 'processor', label: 'Processador' },
  { key: 'camera', label: 'Câmera' },
  { key: 'weight', label: 'Peso' },
  { key: 'thickness', label: 'Espessura' },
]

// SpecsSection: ficha técnica completa do aparelho ativo, incluindo cores
// de lançamento (tratadas à parte por serem uma lista, não um texto).
function SpecsSection() {
  const device = useExperienceStore((state) => state.activeDevice)

  if (!device) return null

  return (
    <section className="specs-section" id="specs">
      <h2 className="specs-section__title">Ficha técnica — {device.name}</h2>
      <dl className="specs-section__grid">
        {SPEC_ROWS.map((row) => (
          <div className="specs-section__row" key={row.key}>
            <dt>{row.label}</dt>
            <dd>{device[row.key]}</dd>
          </div>
        ))}
        <div className="specs-section__row">
          <dt>Cores de lançamento</dt>
          <dd>{device.colors.join(', ')}</dd>
        </div>
      </dl>
    </section>
  )
}

export default SpecsSection
