import PropTypes from 'prop-types'
import StaticPhoneViewer from '../phone/StaticPhoneViewer'
import './Product3D.css'

function Product3D({ product, interactive = true }) {
  if (!product.modelPath) {
    return (
      <div className="product-3d product-3d--pending" role="status">
        <span className="product-3d__pending-label">{product.category}</span>
        <strong>Modelo 3D em preparação</strong>
        <span>{product.status}</span>
      </div>
    )
  }

  return (
    <div className="product-3d">
      <StaticPhoneViewer
        modelPath={product.modelPath}
        fitModel
        interactive={interactive}
        autoRotate={!interactive}
        label={`${product.name}, ${product.year}`}
      />
    </div>
  )
}

Product3D.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    modelPath: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  interactive: PropTypes.bool,
}

export default Product3D