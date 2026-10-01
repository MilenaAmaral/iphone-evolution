import PropTypes from 'prop-types'
import './SpecList.css'

/**
 * SpecList — ficha técnica em pares rótulo/valor, usada nas seções do
 * primeiro iPhone, do iPhone 18 Pro Max e do Último lançamento.
 *
 * Separação deliberada entre o que é confirmado e o que não é:
 * - `specs`: somente dados confirmados (ver src/data/appleProducts.js);
 * - `notDisclosed`: itens que a fonte oficial não divulga. Aparecem em
 *   bloco próprio, rotulado, e nunca recebem valor estimado. Se um dia a
 *   informação for publicada, basta movê-la para `specs`.
 */
function SpecList({ title, specs, notDisclosed = [], columns = 1 }) {
  return (
    <div className={`spec-list spec-list--cols-${columns}`}>
      {title && <p className="spec-list__title">{title}</p>}
      <dl className="spec-list__grid">
        {specs.map((spec) => (
          <div className="spec-list__item" key={spec.label}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
      {notDisclosed.length > 0 && (
        <p className="spec-list__pending">
          <span>Não divulgado oficialmente:</span> {notDisclosed.join(' · ')}
        </p>
      )}
    </div>
  )
}

SpecList.propTypes = {
  title: PropTypes.string,
  specs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired }))
    .isRequired,
  notDisclosed: PropTypes.arrayOf(PropTypes.string),
  columns: PropTypes.oneOf([1, 2]),
}

export default SpecList
