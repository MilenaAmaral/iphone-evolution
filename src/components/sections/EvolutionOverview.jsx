import './EvolutionOverview.css'

const milestones = [
  ['2007', 'A ideia', 'Telefone, iPod e internet em uma única superfície.'],
  ['2010', 'A definição', 'Vidro, aço e Retina estabeleceram uma nova linguagem.'],
  ['2017', 'A ruptura', 'A tela inteira e o Face ID mudaram o gesto.'],
  ['2020', 'A expansão', '5G, MagSafe e novos formatos ampliaram o ecossistema.'],
  ['agora', 'A síntese', 'Câmeras, materiais e inteligência trabalham como um sistema.'],
]

function EvolutionOverview() {
  return (
    <section className="evolution-overview section-shell" id="evolucao">
      <div className="evolution-overview__header">
        <p className="section-kicker">2007 — atualidade</p>
        <h2 className="section-heading">A evolução não foi linear.</h2>
        <p className="section-lede">Foi uma sequência de decisões: menos bordas, mais superfície, câmeras mais capazes e materiais que mudaram a sensação na mão.</p>
      </div>

      <div className="evolution-overview__track" aria-label="Marcos da evolução do iPhone">
        {milestones.map(([year, title, description]) => (
          <article className="evolution-overview__milestone" key={year}>
            <span>{year}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="evolution-overview__dimensions" aria-label="Dimensões da evolução">
        <span>design</span>
        <span>telas</span>
        <span>câmeras</span>
        <span>materiais</span>
        <span>tecnologia</span>
      </div>
    </section>
  )
}

export default EvolutionOverview