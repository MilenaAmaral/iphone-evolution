import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import './PhoneViewer.css'

/**
 * PhoneViewer — visualizador 3D reutilizável de um aparelho.
 *
 * Componente "burro": não lê nenhum estado global, só o que recebe por
 * props (`modelPath`, `rotation`, `scale`, `position`). Isso permite usá-lo
 * em qualquer contexto — visualizador principal, uma miniatura, um preview
 * de comparação — bastando passar props diferentes. Quem decide QUAL
 * aparelho mostrar (lendo o store, por exemplo) é o componente pai.
 *
 * Preenche 100% do elemento pai (ver PhoneViewer.css) — o tamanho do
 * viewer é controlado por quem o usa, não por ele mesmo.
 */
function PhoneViewer({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0] }) {
  return (
    <div className="phone-viewer">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [1.6, 1, 3.2], fov: 32 }}
        gl={{ antialias: true }}
      >
        {/* Iluminação + ambiente procedural compartilhados com a cena de
            scroll (ver SceneLighting.jsx) — sem depender de HDRI externo. */}
        <SceneLighting />

        <SceneErrorBoundary>
          <Suspense fallback={<ModelLoaderFallback />}>
            <PhoneModel
              modelPath={modelPath}
              rotation={rotation}
              scale={scale}
              position={position}
            />
          </Suspense>
        </SceneErrorBoundary>

        {/* Sombra de contato: soft shadow barata, sem precisar de um chão
            "de verdade" recebendo sombra — mantém a cena minimalista. */}
        <ContactShadows position={[0, -1.05, 0]} opacity={0.45} blur={2.6} scale={8} far={2} />

        {/* Câmera controlável: o usuário orbita (equivale a "rotacionar o
            aparelho" visualmente) e a cena gira sozinha quando ele não
            está interagindo. Pan desligado e zoom limitado para o
            aparelho nunca sair de enquadramento. */}
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
    </div>
  )
}

export default PhoneViewer
