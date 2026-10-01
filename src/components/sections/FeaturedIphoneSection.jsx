import { useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePreloadModel } from '../../hooks/usePreloadModel'
import Product3D from '../products/Product3D'
import SpecList from '../shared/SpecList'
import './FeaturedIphoneSection.css'

function FeaturedIphoneSection({ id, eyebrow, title, description, product, side = 'left' }) {
  const sectionNodeRef = useRef(null)
  const sectionInView = useInView(sectionNodeRef)
  // Baixa o .glb com uma viewport de antecedência; o Canvas continua
  // montando só quando a seção está visível.
  usePreloadModel(sectionNodeRef, product.modelPath)

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
        {product.specs && (
          <div className="featured-iphone__specs">
            <SpecList title={product.specsTitle} specs={product.specs} notDisclosed={product.notDisclosed} />
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedIphoneSection
