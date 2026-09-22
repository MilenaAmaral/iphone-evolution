import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Html } from '@react-three/drei'
import { releaseModel } from '../../three/gltfCache'

// Error boundary só pode ser classe (React não tem hook equivalente).
// Isola falhas de carregamento de um modelo/ambiente específico (GLB
// corrompido, textura indisponível) para que elas não derrubem o app
// inteiro — só esse viewer mostra um aviso.
class SceneErrorBoundary extends Component {
  state = { hasError: false, retryKey: 0 }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('[PhoneViewer] falha ao carregar a cena:', error)
  }

  // "Tentar novamente" precisa de duas coisas pra ter efeito de verdade,
  // não só esconder o aviso:
  //
  // 1) Limpar o cache do(s) `.glb` que falharam (`releaseModel`, de
  //    gltfCache.js). Sem isso, `useGLTF` devolveria a MESMA promise
  //    rejeitada que já tinha em cache — a "nova tentativa" falharia
  //    instantaneamente com o mesmo erro, sem sequer tentar a rede de
  //    novo.
  // 2) Remontar os filhos do zero (`retryKey` incrementado, usado como
  //    `key` do Fragment abaixo) — só resetar `hasError` não força
  //    `useGLTF` a rodar de novo no componente que já lançou o erro.
  //
  // `modelPath` (prop opcional) aceita uma string ou uma lista — em
  // EvolutionSection, por exemplo, dois aparelhos (atual + próximo) podem
  // estar montados ao mesmo tempo dentro do mesmo boundary.
  handleRetry = () => {
    const paths = Array.isArray(this.props.modelPath) ? this.props.modelPath : [this.props.modelPath]
    paths.filter(Boolean).forEach(releaseModel)
    this.setState((state) => ({ hasError: false, retryKey: state.retryKey + 1 }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div className="phone-viewer__loader" role="alert">
            <span>Não foi possível carregar o modelo 3D.</span>
            <button type="button" className="phone-viewer__retry" onClick={this.handleRetry}>
              Tentar novamente
            </button>
          </div>
        </Html>
      )
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
  }
}

SceneErrorBoundary.propTypes = {
  children: PropTypes.node,
  modelPath: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
}

export default SceneErrorBoundary
