import { useExperienceStore } from '../../store/useExperienceStore'
import './PhoneInfo.css'

// PhoneInfo: painel de destaques do aparelho ativo (ano, nome e
// highlights). Só lê do store — não decide qual aparelho está ativo.
function PhoneInfo() {
  const device = useExperienceStore((state) => state.activeDevice)

  if (!device) return null

  return (
    <div className="phone-info">
      <span className="phone-info__year">{device.year}</span>
      <h3 className="phone-info__name">{device.name}</h3>
      <ul className="phone-info__highlights">
        {device.highlights.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  )
}

export default PhoneInfo
