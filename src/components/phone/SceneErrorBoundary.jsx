import { Component } from 'react'
import { Html } from '@react-three/drei'

// Error boundary só pode ser classe (React não tem hook equivalente).
// Isola falhas de carregamento de um modelo/ambiente específico (GLB
// corrompido, textura indisponível) para que elas não derrubem o app
// inteiro — só esse viewer mostra um aviso.
class SceneErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('[PhoneViewer] falha ao carregar a cena:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="phone-viewer__loader" role="alert">
            Não foi possível carregar o modelo 3D.
          </div>
        </Html>
      )
    }

    return this.props.children
  }
}

export default SceneErrorBoundary
