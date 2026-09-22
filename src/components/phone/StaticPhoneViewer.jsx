import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import './PhoneViewer.css'

/**
 * StaticPhoneViewer — like <PhoneViewer>, but without <OrbitControls> and
 * without a continuous render loop. Built specifically for CompareSection:
 * two of these sit stacked on top of each other there (ver
 * CompareSection.jsx), and letting each one auto-rotate would fight the
 * whole point of a side-by-side comparison — the user wants both phones
 * to hold still at a readable angle while THEY control the comparison via
 * the drag slider, not the camera.
 *
 * `frameloop="demand"` (em vez do padrão "always" usado no restante do
 * app) é seguro justamente porque não há nada aqui que mude sozinho a
 * cada frame (sem autoRotate, sem useFrame) — o R3F só desenha um novo
 * frame quando algo de fato muda (montagem, resize, um material que
 * termina de carregar), então não fica gastando CPU/GPU desenhando a
 * mesma imagem estática repetidamente.
 */
function StaticPhoneViewer({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0] }) {
  return (
    <div className="phone-viewer">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ position: [1.7, 0.9, 3.4], fov: 30 }}
        gl={{ antialias: true }}
      >
        <SceneLighting />

        <SceneErrorBoundary>
          <Suspense fallback={<ModelLoaderFallback />}>
            <PhoneModel modelPath={modelPath} rotation={rotation} scale={scale} position={position} />
          </Suspense>
        </SceneErrorBoundary>

        <ContactShadows position={[0, -1.05, 0]} opacity={0.4} blur={2.4} scale={8} far={2} />
      </Canvas>
    </div>
  )
}

export default StaticPhoneViewer
