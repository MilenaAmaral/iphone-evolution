import { Suspense, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import SceneErrorBoundary from './SceneErrorBoundary'
import SceneLighting from './SceneLighting'
import ModelLoaderFallback from './ModelLoaderFallback'
import { getDprRange } from '../../utils/devicePerformance'
import './PhoneViewer.css'

/**
 * StaticShadowMap — a luz direcional e o modelo ficam parados; quem se move
 * é a câmera (OrbitControls/autoRotate). Para luz direcional o shadow map
 * não depende da câmera, então recalculá-lo a cada frame (padrão do
 * three.js) era trabalho repetido. Aqui ele é calculado uma vez quando o
 * modelo termina de carregar e depois congelado: mesma sombra, um passe de
 * renderização a menos por frame.
 */
function StaticShadowMap() {
  const gl = useThree((state) => state.gl)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    invalidate()
    return () => {
      gl.shadowMap.autoUpdate = true
    }
  }, [gl, invalidate])

  return null
}

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
  autoRotate = false,
  autoRotateSpeed = 0.6,
  enableZoom = true,
  minDistance = 2,
  maxDistance = 5,
  fitTargetSize,
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
      {/* `dpr` vem de getDprRange() (ver devicePerformance.js) — [1,2] na
          maioria dos aparelhos (mesmo comportamento de antes), travado em
          1 só quando há sinal real de hardware limitado (touch + poucos
          núcleos de CPU). Evita gastar super-sampling num celular fraco
          sem tocar em nada visível em desktop/celular potente. */}
      {/* `shadows="percentage"` (PCFShadowMap): o padrão `true` pedia
          PCFSoftShadowMap, removido do three.js r186 — ele já caía em PCF
          com um aviso no console. Mesma aparência, sem o aviso. */}
      <Canvas
        frameloop={frameloop}
        shadows={orbitControls ? 'percentage' : false}
        dpr={getDprRange()}
        camera={camera}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Iluminação + ambiente procedural compartilhados com a cena de
            scroll (ver SceneLighting.jsx) — sem depender de HDRI externo. */}
        <SceneLighting />

        <SceneErrorBoundary modelPath={modelPath}>
          <Suspense fallback={<ModelLoaderFallback />}>
            <PhoneModel modelPath={modelPath} rotation={rotation} scale={scale} position={position} targetSize={fitTargetSize} />
            {/* Sombra de contato: soft shadow barata, sem precisar de um chão
                "de verdade" recebendo sombra — mantém a cena minimalista.
                Fica DENTRO do Suspense e com `frames={1}`: é desenhada uma
                única vez, já com o modelo carregado. O modelo não se move
                (só a câmera orbita), então o resultado é idêntico ao padrão
                (`frames={Infinity}`), que refazia 3 passes extras por frame. */}
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={contactShadowsOpacity}
              blur={contactShadowsBlur}
              scale={8}
              far={2}
              frames={1}
            />
            {orbitControls && <StaticShadowMap />}
          </Suspense>
        </SceneErrorBoundary>

        {orbitControls && (
          // Câmera controlável: o usuário orbita (equivale a "rotacionar
          // o aparelho" visualmente) e a cena gira sozinha quando ele não
          // está interagindo. Pan desligado e zoom limitado para o
          // aparelho nunca sair de enquadramento.
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={enableZoom}
            minDistance={minDistance}
            maxDistance={maxDistance}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
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
  autoRotate: PropTypes.bool,
  autoRotateSpeed: PropTypes.number,
  enableZoom: PropTypes.bool,
  minDistance: PropTypes.number,
  maxDistance: PropTypes.number,
  label: PropTypes.string,
  fitTargetSize: PropTypes.number,
}

export default PhoneScene
