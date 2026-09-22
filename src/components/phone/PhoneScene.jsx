import { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import './PhoneViewer.css'

/**
 * PhoneScene — o miolo compartilhado entre <PhoneViewer> (visualizador
 * principal, com OrbitControls e auto-rotação) e <StaticPhoneViewer>
 * (usado em CompareSection, parado e sem loop de render contínuo).
 *
 * Antes desta extração, os dois componentes duplicavam quase 100% da
 * configuração do <Canvas> (luz, error boundary, Suspense, PhoneModel,
 * sombra de contato) — só câmera, frameloop e a presença de OrbitControls
 * mudavam de um pro outro. Centralizar isso aqui significa que um ajuste
 * de iluminação ou sombra passa a valer pros dois automaticamente, sem
 * risco de um ficar desatualizado em relação ao outro.
 */
function PhoneScene({
  modelPath,
  rotation = [0, 0, 0],
  scale = 1,
  position = [0, 0, 0],
  frameloop = 'always',
  camera,
  contactShadowsOpacity = 0.45,
  contactShadowsBlur = 2.6,
  orbitControls = false,
  label,
}) {
  return (
    // `role="img"` + `aria-label` dão ao <canvas> WebGL uma descrição
    // acessível própria pra quem usa leitor de tela — sem isso, o
    // conteúdo do Canvas é invisível pra tecnologia assistiva, mesmo
    // quando há texto próximo descrevendo o aparelho (a associação entre
    // os dois não é automática). Só aplicado quando quem chama passa um
    // `label` — sem ele, um `role="img"` com `aria-label` vazio seria
    // pior que não ter nada.
    <div className="phone-viewer" role={label ? 'img' : undefined} aria-label={label}>
      <Canvas frameloop={frameloop} shadows={orbitControls} dpr={[1, 2]} camera={camera} gl={{ antialias: true }}>
        {/* Iluminação + ambiente procedural compartilhados com a cena de
            scroll (ver SceneLighting.jsx) — sem depender de HDRI externo. */}
        <SceneLighting />

        <SceneErrorBoundary modelPath={modelPath}>
          <Suspense fallback={<ModelLoaderFallback />}>
            <PhoneModel modelPath={modelPath} rotation={rotation} scale={scale} position={position} />
          </Suspense>
        </SceneErrorBoundary>

        {/* Sombra de contato: soft shadow barata, sem precisar de um chão
            "de verdade" recebendo sombra — mantém a cena minimalista. */}
        <ContactShadows
          position={[0, -1.05, 0]}
          opacity={contactShadowsOpacity}
          blur={contactShadowsBlur}
          scale={8}
          far={2}
        />

        {orbitControls && (
          // Câmera controlável: o usuário orbita (equivale a "rotacionar
          // o aparelho" visualmente) e a cena gira sozinha quando ele não
          // está interagindo. Pan desligado e zoom limitado para o
          // aparelho nunca sair de enquadramento.
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
        )}
      </Canvas>
    </div>
  )
}

PhoneScene.propTypes = {
  modelPath: PropTypes.string,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  frameloop: PropTypes.oneOf(['always', 'demand', 'never']),
  camera: PropTypes.object,
  contactShadowsOpacity: PropTypes.number,
  contactShadowsBlur: PropTypes.number,
  orbitControls: PropTypes.bool,
  label: PropTypes.string,
}

export default PhoneScene
