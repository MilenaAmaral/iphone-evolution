import { useRef } from 'react'
import { useInView } from '../../hooks/useInView'
import { usePreloadModel } from '../../hooks/usePreloadModel'
import { iphoneProduct } from '../../data/appleProducts'
import Product3D from '../products/Product3D'
import SpecList from '../shared/SpecList'
import './LatestLaunchSection.css'

/**
 * LatestLaunchSection — "Último lançamento": o iPhone Duo em 3D
 * (public/models/apple_iphone_duo.glb) com a ficha técnica oficial.
 *
 * Segue a mesma estratégia de carregamento das outras seções 3D:
 * o .glb começa a baixar uma viewport antes (usePreloadModel) e o
 * <Canvas> só existe enquanto a seção está perto da tela (useInView).
 */
function LatestLaunchSection() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef)
  const product = iphoneProduct.duo
  usePreloadModel(sectionRef, product.modelPath)

  return (
    <section className="latest-launch section-shell" id="ultimo-lancamento" ref={sectionRef}>
      <header className="latest-launch__header">
        <p className="section-kicker">Último lançamento / {product.year}</p>
        <h2 className="section-heading">{product.name}.</h2>
        <p className="section-lede">
          O primeiro iPhone dobrável: uma tela externa para o uso rápido e uma tela interna maior
          que transforma o aparelho em espaço de trabalho.
        </p>
        <ul className="latest-launch__status" aria-label="Status do produto">
          <li className="latest-launch__status-official">{product.status}</li>
          <li>{product.announced}</li>
          <li>{product.availability}</li>
        </ul>
      </header>

      <div className="latest-launch__layout">
        <div className="latest-launch__model">
          {inView && <Product3D product={product} />}
          <p className="latest-launch__hint">Arraste para girar · modelo 3D ilustrativo</p>
        </div>
        <SpecList
          title="Especificações confirmadas pela Apple"
          specs={product.specs}
          notDisclosed={product.notDisclosed}
        />
      </div>
    </section>
  )
}

export default LatestLaunchSection
