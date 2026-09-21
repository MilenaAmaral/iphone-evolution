import { useEffect, useRef } from 'react'
import { useExperienceStore } from '../../store/useExperienceStore'
import { useGenerationNavigator } from '../../hooks/useScrollProgress'
import './Timeline.css'

/**
 * Timeline — navegação principal por clique entre as gerações "redondas"
 * do iPhone (uma por nome/ano — 3G, 4, 5, 6, 7, 8, X, 11...18 Pro). Só
 * mostra os aparelhos com `timelineHighlight: true` em devices.js; as
 * variantes "S" continuam no dataset (e alcançáveis rolando a página),
 * só não viram botão aqui — mantém a trilha legível mesmo conforme o
 * dataset cresce.
 *
 * Clicar não troca o aparelho ativo diretamente: chama
 * `navigateToGeneration`, que rola a página até o ponto exato do scroll
 * pinado onde aquela geração fica ativa (ver useScrollTimeline). Como é
 * a MESMA rolagem que já conduz a transição 3D (fade + escala +
 * rotação em ScrollControlledPhone) e a troca de nome/ano/specs (todos
 * lendo `activeDevice` do store), a Timeline não precisa saber nada
 * sobre 3D — só "pede" a geração e o resto acontece sozinho, suave.
 */
function Timeline() {
  const devices = useExperienceStore((state) => state.devices)
  const activeIndex = useExperienceStore((state) => state.activeIndex)
  const navigateToGeneration = useGenerationNavigator()
  const trackRef = useRef(null)
  const activeButtonRef = useRef(null)

  const highlighted = devices
    .map((device, index) => ({ device, index }))
    .filter(({ device }) => device.timelineHighlight)

  // "Atualizar o estado visual da timeline" não é só trocar a borda de cor
  // — se o item ativo estiver fora da área visível da trilha (ela rola na
  // horizontal, ver Timeline.css), ele precisa entrar em vista sozinho,
  // senão clicar numa geração distante (ou chegar nela rolando a página)
  // parece não ter feito nada.
  //
  // Importante: rolamos SÓ o container `.timeline__track` (via
  // `track.scrollTo`), nunca `button.scrollIntoView()`. `scrollIntoView`
  // rola TODOS os ancestrais roláveis necessários — inclusive a janela —
  // e como `activeIndex` muda várias vezes por segundo durante a rolagem
  // animada que `navigateToGeneration` dispara (cada aparelho cruzado no
  // caminho gera uma atualização), cada uma delas brigaria com o próprio
  // `gsap.to(window, {scrollTo...})` em andamento, fazendo a página parar
  // num ponto errado no meio do caminho. `track.scrollTo` só afeta esse
  // elemento — nunca a rolagem vertical da página.
  useEffect(() => {
    const track = trackRef.current
    const button = activeButtonRef.current
    if (!track || !button) return

    const targetLeft = button.offsetLeft - (track.clientWidth - button.clientWidth) / 2
    track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  }, [activeIndex])

  return (
    <nav className="timeline" aria-label="Linha do tempo de gerações do iPhone">
      <ol className="timeline__track" ref={trackRef}>
        {highlighted.map(({ device, index }) => {
          const isActive = index === activeIndex
          return (
            <li key={device.id} className="timeline__item">
              <button
                ref={isActive ? activeButtonRef : null}
                type="button"
                className={`timeline__dot${isActive ? ' is-active' : ''}`}
                onClick={() => navigateToGeneration(index)}
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
