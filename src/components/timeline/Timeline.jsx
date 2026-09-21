import { useExperienceStore } from '../../store/useExperienceStore'
import './Timeline.css'

// Timeline: trilha clicável com um marcador por geração. Lê e escreve o
// índice ativo direto no store — é o principal controle de navegação da
// experiência nesta etapa inicial (a versão final também reagirá ao
// scroll, conforme o doc de arquitetura).
function Timeline() {
  const devices = useExperienceStore((state) => state.devices)
  const activeIndex = useExperienceStore((state) => state.activeIndex)
  const setActiveIndex = useExperienceStore((state) => state.setActiveIndex)

  return (
    <nav className="timeline" aria-label="Linha do tempo de gerações do iPhone">
      <ol className="timeline__track">
        {devices.map((device, index) => {
          const isActive = index === activeIndex
          return (
            <li key={device.id} className="timeline__item">
              <button
                type="button"
                className={`timeline__dot${isActive ? ' is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-current={isActive}
              >
                <span className="timeline__year">{device.year}</span>
                <span className="timeline__name">{device.name}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Timeline
