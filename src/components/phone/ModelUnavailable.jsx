import { Html } from '@react-three/drei'

function ModelUnavailable() {
  return (
    <Html center>
      <div className="phone-viewer__loader" role="alert">
        <span>Modelo 3D indisponível.</span>
        <span className="phone-viewer__loader-hint">O arquivo GLB não foi informado.</span>
      </div>
    </Html>
  )
}

export default ModelUnavailable
