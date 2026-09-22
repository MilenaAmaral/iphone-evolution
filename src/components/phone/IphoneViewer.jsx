import { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import IphoneModel from './IphoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import './PhoneViewer.css'

const MODEL_PATH = '/models/iphone-18-pro-max.glb'

function IphoneViewer({ modelPath = MODEL_PATH, label = 'Visualizador 3D do iPhone 18 Pro Max' }) {
  return (
    <div className="phone-viewer" role="img" aria-label={label}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.15, 0.1, 3.8], fov: 35, near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <SceneLighting />
        <SceneErrorBoundary modelPath={modelPath}>
          <Suspense fallback={<ModelLoaderFallback />}>
            <IphoneModel modelPath={modelPath} />
          </Suspense>
        </SceneErrorBoundary>
        <ContactShadows position={[0, -1.12, 0]} opacity={0.42} blur={2.4} scale={5} far={2.5} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          minDistance={2.6}
          maxDistance={5.2}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  )
}

IphoneViewer.propTypes = {
  modelPath: PropTypes.string,
  label: PropTypes.string,
}

export { MODEL_PATH }
export default IphoneViewer