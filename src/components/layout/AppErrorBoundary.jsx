import { Component } from 'react'
import './AppErrorBoundary.css'

/**
 * AppErrorBoundary — rede de segurança no topo da árvore (ver main.jsx).
 *
 * Antes desta correção, só `SceneErrorBoundary` existia no projeto — e ele
 * protege exclusivamente o conteúdo DENTRO de um `<Canvas>` (um GLB que
 * falha ao carregar, por exemplo). Um erro em qualquer outro lugar (uma
 * seção de texto, o store, um hook fora do Three.js) não tinha nenhum
 * boundary acima dele e derrubava a página inteira em tela branca.
 *
 * Error boundary só pode ser classe (React não expõe hook equivalente a
 * `getDerivedStateFromError`/`componentDidCatch`). Fica fora de
 * `<StrictMode>` na árvore? Não — envolve `<App />` por dentro do
 * StrictMode, então também captura erros durante os double-invokes de
 * desenvolvimento.
 */
class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[AppErrorBoundary] erro não tratado na aplicação:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error" role="alert">
          <p className="app-error__kicker">Algo deu errado</p>
          <h1 className="app-error__title">A página encontrou um erro inesperado.</h1>
          <p className="app-error__message">
            Recarregar a página costuma resolver. Se o problema continuar, tente novamente em
            alguns instantes.
          </p>
          <button type="button" className="app-error__button" onClick={this.handleReload}>
            Recarregar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
