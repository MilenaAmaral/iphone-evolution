import { useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import Product3D from '../products/Product3D'
import './FeaturedIphoneSection.css'

function FeaturedIphoneSection({ id, eyebrow, title, description, product, side = 'left' }) {
  const sectionNodeRef = useRef(null)
  const sectionInView = useInView(sectionNodeRef)

  return (
    <section className={`featured-iphone section-shell featured-iphone--${side}`} id={id} ref={sectionNodeRef}>
      <div className="featured-iphone__layout">
        <div className="featured-iphone__copy">
          <p className="section-kicker">{eyebrow}</p>
          <h2 className="section-heading">{title}</h2>
          <p className="section-lede">{description}</p>
          <div className="featured-iphone__meta">
            <span>{product.name}</span>
            <strong>{product.year}</strong>
            <small>{product.category} / modelo 3D interativo</small>
          </div>
        </div>
        <div className="featured-iphone__model">
          {sectionInView && <Product3D product={product} />}
        </div>
      </div>
    </section>
  )
}

export default FeaturedIphoneSection