import PropTypes from 'prop-types'
import './HighlightList.css'

/**
 * HighlightList — lista de destaques com marcador em ponto, usada tanto
 * em OriginSection quanto em CurrentSection (os dois "capítulos-âncora"
 * da narrativa, abrindo e fechando a linha do tempo).
 *
 * Antes desta extração, `.origin-section__highlights` e
 * `.current-section__highlights` existiam como dois blocos de CSS
 * idênticos (mesmo marcador, espaçamento, tipografia — só o prefixo da
 * classe mudava), e cada seção repetia a mesma estrutura de `<ul>` no
 * JSX. Os textos vêm sempre de `device.highlights` (devices.js) — este
 * componente só cuida da apresentação, nunca decide o conteúdo.
 */
function HighlightList({ items }) {
  return (
    <ul className="highlight-list">
      {items.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  )
}

HighlightList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default HighlightList
