import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import PhoneModel from './PhoneModel'

/**
 * ScrollControlledPhone — envolve UM <PhoneModel> e o anima quadro a
 * quadro conforme `progressRef` (escrito por useScrollTimeline fora do
 * ciclo de render do React — ver src/hooks/useScrollProgress.jsx).
 *
 * `role` diz se esse aparelho é o "current" (o que está saindo de cena
 * enquanto o scroll avança) ou o "next" (o que está entrando). Os dois
 * papéis leem o MESMO `localProgress` (0..1 dentro da transição atual),
 * só invertem o sentido: `current` desaparece conforme `localProgress`
 * cresce, `next` aparece.
 *
 * Tudo aqui é mutação imperativa dentro de useFrame — nada passa por
 * useState/props a cada frame. É exatamente o padrão documentado em
 * useScrollProgress.jsx: ler um ref, escrever direto no objeto three.js.
 */
function ScrollControlledPhone({ modelPath, role, progressRef, baseRotationSpeed = 0.15 }) {
  const groupRef = useRef(null)
  const materialsRef = useRef([])

  // Ao montar (ou trocar de modelo), varre a árvore uma única vez e
  // guarda os materiais num array próprio. Evita fazer esse traverse a
  // cada frame só pra achar "quem tem opacidade pra mexer".
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
  }, [modelPath])

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return

    const { localProgress, progress } = progressRef.current

    // `eased` suaviza a transição linear do scroll (evita que o
    // fade/deslocamento pareça mecânico); smoothstep tem derivada zero
    // nas pontas, então a troca de aparelho começa e termina suave.
    const eased = THREE.MathUtils.smoothstep(localProgress, 0, 1)
    // current: 0 → 1 (sai); next: 1 → 0 (chega). Mesma matemática, sentido oposto.
    const t = role === 'current' ? eased : 1 - eased

    const opacity = 1 - t
    const scale = THREE.MathUtils.lerp(1, 0.85, t)
    const direction = role === 'current' ? -1 : 1
    const offsetX = direction * 0.7 * t

    group.scale.setScalar(scale)
    group.position.x = offsetX
    group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.04
    // Rotação contínua (vida própria, lenta) + avanço proporcional ao
    // progresso total do scroll — dá a sensação de "girar conforme rola".
    group.rotation.y = state.clock.elapsedTime * baseRotationSpeed + progress * Math.PI * 2
    group.visible = opacity > 0.01

    for (const material of materialsRef.current) {
      material.opacity = opacity
    }

    void delta
  })

  return (
    <group ref={groupRef}>
      <PhoneModel modelPath={modelPath} />
    </group>
  )
}

export default ScrollControlledPhone
