import { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import IphoneModel from './IphoneModel'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import SceneErrorBoundary from './SceneErrorBoundary'
import { prefersReducedMotion } from '../../utils/motionPreference'
import './PhoneViewer.css'

const MODEL_PATH = '/models/apple-logo.glb'

function RotatingAppleLogo() {
  const groupRef = useRef(null)
  const shouldAnimate = !prefersReducedMotion()

  useFrame((state) => {
    if (!groupRef.current || !shouldAnimate) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.72) * 0.48
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <IphoneModel modelPath={MODEL_PATH} />
    </group>
  )
}

function AppleLogoHero() {
  return (
    <div className="hero__apple-logo" aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <SceneLighting />
        <SceneErrorBoundary modelPath={MODEL_PATH}>
          <Suspense fallback={<ModelLoaderFallback />}>
            <RotatingAppleLogo />
          </Suspense>
        </SceneErrorBoundary>
        <ContactShadows position={[0, -0.72, 0]} opacity={0.2} blur={2.8} scale={4} far={1.5} />
      </Canvas>
    </div>
  )
}

export default AppleLogoHero