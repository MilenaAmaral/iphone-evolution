import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import PhoneModel from './PhoneModel'

/**
 * ScrollControlledPhone — envolve UM <PhoneModel> de UM aparelho fixo
 * (`device`) e o anima quadro a quadro conforme `progressRef` (escrito
 * por useScrollTimeline fora do ciclo de render do React — ver
 * src/hooks/useScrollProgress.jsx).
 *
 * Diferente da primeira versão deste componente, ele NÃO recebe um
 * `role` ("current"/"next"): recebe `deviceIndex`, a posição FIXA desse
 * aparelho no array `devices`, e calcula sozinho, a cada frame, a que
 * distância ele está do "playhead" contínuo do scroll
 * (`progress * segments`). Isso importa pra estabilidade do componente —
 * ver o comentário grande em EvolutionSection.jsx sobre por que essa
 * mudança existe (resumo: evita remontar/re-clonar o modelo toda vez que
 * um aparelho passa de "próximo" pra "atual").
 *
 * `dist` (playhead - deviceIndex) é o único dado de entrada pra toda a
 * animação:
 * - `dist` em [0, 1)  → este aparelho é o que está SAINDO de cena, `t`
 *   (0→1) mede o quanto já saiu.
 * - `dist` em [-1, 0) → este aparelho é o que está ENTRANDO, `t` (1→0)
 *   mede o quanto falta entrar.
 * - fora desse intervalo → totalmente invisível (o componente só chega a
 *   ser montado, de qualquer forma, quando está perto o bastante — ver
 *   a janela renderizada em EvolutionSection.jsx).
 */
function ScrollControlledPhone({ device, deviceIndex, segments, progressRef, baseRotationSpeed = 0.15 }) {
  const groupRef = useRef(null)
  const materialsRef = useRef([])

  // Ao montar (ou trocar de modelo — na prática não muda mais durante a
  // vida do componente, já que `device` é uma posição fixa do array, mas
  // a dependência continua correta caso isso um dia deixe de ser verdade),
  // varre a árvore uma única vez e guarda os materiais num array próprio.
  // Evita fazer esse traverse a cada frame só pra achar "quem tem
  // opacidade pra mexer".
  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    const materials = []
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.transparent = true
        materials.push(child.material)
      }
    })
    materialsRef.current = materials
  }, [device.modelPath])

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    const { progress } = progressRef.current
    const playhead = progress * segments
    const dist = playhead - deviceIndex

    // Ambos os ramos abaixo produzem `t` no mesmo intervalo (0 = totalmente
    // visível, 1 = totalmente fora), só com `direction` invertida — é o
    // que permite tratar "saindo" e "entrando" com a mesma matemática daqui
    // pra baixo, sem duplicar a lógica de fade/escala/rotação.
    const isLeaving = dist >= 0
    const localT = THREE.MathUtils.clamp(isLeaving ? dist : dist + 1, 0, 1)
    const eased = THREE.MathUtils.smoothstep(localT, 0, 1)
    const t = isLeaving ? eased : 1 - eased
    const direction = isLeaving ? -1 : 1

    const opacity = 1 - t
    const scale = THREE.MathUtils.lerp(1, 0.85, t) * (device.modelScale ?? 1)
    const offsetX = direction * 0.7 * t

    group.scale.setScalar(scale)
    group.position.x = offsetX
    group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.04
    // Rotação = duas camadas somadas. (1) idle contínuo e lento — vida
    // própria do aparelho parado, sempre ligado. (2) um "giro de troca"
    // extra que só existe enquanto `t` está entre 0 e 1 (ou seja, só
    // durante a transição): o aparelho que sai continua a mesma rotação
    // que já tinha e ainda gira mais ~35° na saída; o que entra chega já
    // girado ~35° na direção oposta e volta a 0° assim que termina de
    // entrar.
    const idleSpin = state.clock.elapsedTime * baseRotationSpeed + progress * Math.PI * 2
    const swapSpin = direction * t * (Math.PI / 5)
    group.rotation.y = idleSpin + swapSpin
    group.visible = opacity > 0.01

    for (const material of materialsRef.current) {
      material.opacity = opacity
    }
  })

  return (
    <group ref={groupRef}>
      <PhoneModel modelPath={device.modelPath} />
    </group>
  )
}

export default ScrollControlledPhone
