import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import IphoneModel from './IphoneModel'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import SceneErrorBoundary from './SceneErrorBoundary'
import { prefersReducedMotion } from '../../utils/motionPreference'
import { getDprRange } from '../../utils/devicePerformance'
import { useInView } from '../../hooks/useInView'
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
  const wrapperRef = useRef(null)
  // O Hero nunca desmonta. Antes, o logo continuava sendo renderizado a
  // 60 fps mesmo com o usuário lá embaixo na página, disputando GPU com os
  // outros modelos 3D. Fora da tela o loop é pausado ('never'); o contexto
  // WebGL e o modelo continuam montados, então voltar ao topo é instantâneo.
  const inView = useInView(wrapperRef, { rootMargin: '0px' })

  return (
    <div className="hero__apple-logo" aria-hidden="true" ref={wrapperRef}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={getDprRange()}
        camera={{ position: [0, 0, 3.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <SceneLighting />
        <SceneErrorBoundary modelPath={MODEL_PATH}>
          <Suspense fallback={<ModelLoaderFallback />}>
            <RotatingAppleLogo />
          </Suspense>
        </SceneErrorBoundary>
        {/* resolution 256 (padrão 512): sombra com blur 2.8 sob uma camada de
            30% de opacidade; a diferença de resolução não é perceptível. */}
        <ContactShadows position={[0, -0.72, 0]} opacity={0.2} blur={2.8} scale={4} far={1.5} resolution={256} />
      </Canvas>
    </div>
  )
}

export default AppleLogoHero
