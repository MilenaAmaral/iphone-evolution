import { useRef } from 'react'
import { milestones } from '../../data/milestones'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './BigChangesSection.css'

/**
 * BigChangesSection — capítulo 4 ("GRANDES MUDANÇAS"): uma trilha vertical
 * dos marcos de design mais marcantes da linha, curados em
 * src/data/milestones.js. Cada `description` ali é uma frase copiada
 * literalmente de `highlights` em devices.js — este componente só decide
 * como apresentar visualmente essa curadoria (linha do tempo vertical com
 * marcador), nunca inventa uma palavra sobre os aparelhos.
 *
 * Cada marco tem seu PRÓPRIO ScrollTrigger (via useScrollReveal, que cria
 * um por elemento `data-reveal`) — o efeito é o de ir "revelando" os
 * marcos um a um conforme o usuário desce a página, reforçando a
 * sensação de progressão no tempo.
 */
function BigChangesSection() {
  const containerRef = useRef(null)
  // Duas chamadas independentes: a introdução (kicker/título/lede) revela
  // em sequência rápida assim que a seção aparece; os marcos da lista têm
  // seu próprio ritmo, um pouco mais lento, conforme cada um entra na tela.
  useScrollReveal(containerRef, { selector: '.big-changes-section__intro [data-reveal]', stagger: 0.1 })
  useScrollReveal(containerRef, { selector: '.milestone', y: 40, start: 'top 85%' })

  return (
    <section className="big-changes-section section-shell" id="mudancas" ref={containerRef}>
      <header className="big-changes-section__intro">
        <p className="section-kicker" data-reveal>Capítulo 04 — Grandes mudanças</p>
        <h2 className="section-heading" data-reveal>O design nunca parou.</h2>
        <p className="section-lede" data-reveal>
          Alguns marcos redesenharam o que um iPhone é, não só o que ele faz.
        </p>
      </header>

      <ol className="big-changes-section__list">
        {milestones.map((milestone) => (
          <li className="milestone" key={milestone.id}>
            <span className="milestone__year">{milestone.year}</span>
            <div className="milestone__body">
              <h3 className="milestone__device">{milestone.name}</h3>
              <p className="milestone__description">{milestone.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default BigChangesSection
