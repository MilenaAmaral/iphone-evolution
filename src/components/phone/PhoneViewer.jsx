import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Html, Lightformer, OrbitControls, useProgress } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
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
        {/* Iluminação em três pontos (key/fill/rim) + ambient baixa: dá
            volume ao aparelho sem estourar contraste nem depender de HDRI. */}
        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow
          position={[3, 4, 2]}
          intensity={1.6}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.35} color="#bcd4ff" />
        <spotLight position={[0, 3, -4]} intensity={0.6} angle={0.5} penumbra={1} />

        <SceneErrorBoundary>
          <Suspense fallback={<LoaderFallback />}>
            <PhoneModel
              modelPath={modelPath}
              rotation={rotation}
              scale={scale}
              position={position}
            />
            {/* Ambiente minimalista, só para reflexo/iluminação global
                (background={false}). Gerado por Lightformers em vez do
                preset padrão do drei de propósito: o preset baixa um HDRI
                de um CDN externo, o que falha atrás de proxies/firewalls
                restritivos — isso é 100% procedural, sem rede. */}
            <Environment resolution={256} background={false}>
              <Lightformer form="ring" intensity={2} position={[0, 3, 0]} scale={4} />
              <Lightformer form="rect" intensity={1} position={[-3, 1, 2]} scale={3} />
              <Lightformer form="rect" intensity={0.6} position={[3, -1, -2]} scale={3} />
            </Environment>
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

// Fallback de carregamento: HTML sobreposto à cena (drei <Html>) mostrando
// o progresso real do download do modelo — nunca uma imagem do aparelho.
function LoaderFallback() {
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

export default PhoneViewer
