import PropTypes from 'prop-types'
import PhoneScene from './PhoneScene'

/**
 * PhoneViewer — visualizador 3D reutilizável de um aparelho: auto-rotação
 * contínua e controle de órbita pelo usuário (arrastar pra girar).
 *
 * Componente "burro": não lê nenhum estado global, só o que recebe por
 * props (`modelPath`, `rotation`, `scale`, `position`). Isso permite usá-lo
 * em qualquer contexto — visualizador principal, uma miniatura, um preview
 * de comparação — bastando passar props diferentes. Quem decide QUAL
 * aparelho mostrar (lendo o store, por exemplo) é o componente pai.
 *
 * Preenche 100% do elemento pai (ver PhoneViewer.css) — o tamanho do
 * viewer é controlado por quem o usa, não por ele mesmo.
 *
 * A configuração do <Canvas> em si (luz, error boundary, sombra) vive em
 * PhoneScene.jsx, compartilhada com <StaticPhoneViewer> — aqui só ficam os
 * valores que tornam este viewer especificamente "o principal, interativo"
 * (frameloop contínuo, câmera mais próxima, OrbitControls com auto-rotação).
 */
function PhoneViewer({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0], label }) {
  return (
    <PhoneScene
      modelPath={modelPath}
      rotation={rotation}
      scale={scale}
      position={position}
      frameloop="always"
      camera={{ position: [1.6, 1, 3.2], fov: 32 }}
      contactShadowsOpacity={0.45}
      contactShadowsBlur={2.6}
      orbitControls
      autoRotate
      autoRotateSpeed={0.6}
      enableZoom
      minDistance={2}
      maxDistance={5}
      shadows
      label={label}
    />
  )
}

PhoneViewer.propTypes = {
  modelPath: PropTypes.string,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  label: PropTypes.string,
}

export default PhoneViewer
