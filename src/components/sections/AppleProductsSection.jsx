import { useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { appleProducts } from '../../data/appleProducts'
import Product3D from '../products/Product3D'
import './AppleProductsSection.css'

function ProductEndpoint({ product, visible }) {
  return (
    <div className="apple-products__endpoint">
      {visible && <Product3D product={product} interactive={Boolean(product.modelPath)} />}
      <div className="apple-products__endpoint-label">
        <span>{product.year}</span>
        <strong>{product.name}</strong>
      </div>
    </div>
  )
}

function AppleProductsSection() {
  const sectionNodeRef = useRef(null)
  const sectionInView = useInView(sectionNodeRef)

  return (
    <section className="apple-products section-shell" id="produtos-apple" ref={sectionNodeRef}>
      <div className="apple-products__header">
        <p className="section-kicker">Produtos Apple</p>
        <h2 className="section-heading">Uma história além do iPhone.</h2>
        <p className="section-lede">Cada categoria começa com uma ideia e termina em uma nova forma de viver com tecnologia.</p>
      </div>

      <div className="apple-products__list">
        {appleProducts.map((product) => (
          <article className="apple-products__row" key={product.category}>
            <div className="apple-products__category">
              <span>{product.category}</span>
              <small>primeiro lançamento → mais recente</small>
            </div>
            <ProductEndpoint product={product.first} visible={sectionInView} />
            <div className="apple-products__arrow" aria-hidden="true">→</div>
            <ProductEndpoint product={product.latest} visible={sectionInView} />
          </article>
        ))}
      </div>
    </section>
  )
}

export default AppleProductsSection