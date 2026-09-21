import { Html, useProgress } from '@react-three/drei'

/**
 * ModelLoaderFallback — fallback de <Suspense> compartilhado: mostra o
 * progresso REAL de download do modelo (via useProgress, que lê os
 * loaders do three.js) como HTML sobreposto à cena. Nunca uma imagem
 * estática do aparelho — é só um indicador de carregamento.
 */
function ModelLoaderFallback() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="phone-viewer__loader" role="status">
        <span className="phone-viewer__loader-bar" style={{ '--progress': `${progress}%` }} />
        <span>{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

export default ModelLoaderFallback
