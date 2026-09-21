import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * ScrollCameraRig — não renderiza nada (retorna null): só pega a câmera
 * ativa do Canvas (via useThree) e reposiciona ela a cada frame conforme
 * `progressRef.current.localProgress`.
 *
 * A câmera "respira": começa próxima (aparelho centralizado, como pedido
 * pro estado inicial), se afasta no meio da transição entre dois
 * aparelhos (dá espaço pro anterior sair e o próximo entrar) e volta a
 * se aproximar ao concluir — daí o `Math.sin(localProgress * PI)`, que é
 * 0 nas pontas (0 e 1) e máximo no meio (0.5).
 *
 * `THREE.MathUtils.damp` (em vez de lerp fixo) suaviza o movimento de
 * forma independente de framerate: usa `delta` (tempo real do frame)
 * então o resultado é o mesmo em uma tela de 60Hz ou 144Hz.
 */
function ScrollCameraRig({ progressRef }) {
  const camera = useThree((state) => state.camera)

  useFrame((_, delta) => {
    const { localProgress } = progressRef.current

    const targetZ = 2.6 + Math.sin(localProgress * Math.PI) * 0.7
    const targetY = 1 + Math.sin(localProgress * Math.PI * 2) * 0.08

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default ScrollCameraRig
