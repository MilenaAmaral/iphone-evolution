import PropTypes from 'prop-types'
import PhoneScene from './PhoneScene'

/**
 * StaticPhoneViewer — como <PhoneViewer>, mas sem <OrbitControls> e sem
 * loop de render contínuo. Construído especificamente pra CompareSection:
 * dois destes ficam lado a lado ali (ver CompareSection.jsx), e deixar
 * cada um auto-rotacionar competiria com o próprio propósito de uma
 * comparação lado a lado — o usuário quer os dois aparelhos parados num
 * ângulo legível enquanto ELE controla a comparação via o slider de
 * arrastar, não a câmera.
 *
 * `frameloop="demand"` (em vez do padrão "always" usado no restante do
 * app, ver PhoneViewer.jsx) é seguro justamente porque não há nada aqui
 * que mude sozinho a cada frame (sem autoRotate, sem useFrame) — o R3F só
 * desenha um novo frame quando algo de fato muda (montagem, resize, um
 * material que termina de carregar), então não fica gastando CPU/GPU
 * desenhando a mesma imagem estática repetidamente.
 *
 * A configuração do <Canvas> em si vive em PhoneScene.jsx, compartilhada
 * com <PhoneViewer> — aqui só ficam os valores que tornam este viewer
 * especificamente "estático" (frameloop sob demanda, câmera um pouco mais
 * afastada, sem OrbitControls).
 */
function StaticPhoneViewer({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0], fitModel = false, interactive = false, autoRotate = false, label }) {
  return (
    <PhoneScene
      modelPath={modelPath}
      rotation={rotation}
      scale={scale}
      position={position}
      fitModel={fitModel}
      frameloop={interactive || autoRotate ? 'always' : 'demand'}
      camera={{ position: [1.35, 0.7, 3.2], fov: 30 }}
      contactShadowsOpacity={0.4}
      contactShadowsBlur={2.4}
      orbitControls={interactive}
      autoRotate={autoRotate}
      autoRotateSpeed={0.45}
      enableZoom
      minDistance={2.2}
      maxDistance={5}
      label={label}
    />
  )
}

StaticPhoneViewer.propTypes = {
  modelPath: PropTypes.string,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  fitModel: PropTypes.bool,
  interactive: PropTypes.bool,
  autoRotate: PropTypes.bool,
  label: PropTypes.string,
}

export default StaticPhoneViewer
