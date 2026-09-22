import PropTypes from 'prop-types'

/**
 * devicePropType — formato de UM item de `devices.js` (ver o comentário no
 * topo daquele arquivo pra cada campo). Compartilhado por componentes que
 * recebem um aparelho inteiro por prop (ex.: ScrollControlledPhone), em
 * vez de cada um redeclarar a mesma forma isoladamente.
 */
export const devicePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  generation: PropTypes.number,
  display: PropTypes.string,
  processor: PropTypes.string,
  camera: PropTypes.string,
  weight: PropTypes.string,
  thickness: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  highlights: PropTypes.arrayOf(PropTypes.string),
  modelPath: PropTypes.string,
  modelScale: PropTypes.number,
  timelineHighlight: PropTypes.bool,
})

export default devicePropType
