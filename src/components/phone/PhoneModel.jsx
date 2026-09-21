import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'

/**
 * PhoneModel: renderiza o objeto 3D de um aparelho dentro da cena.
 *
 * Nenhum arquivo .glb real foi produzido ainda — isso é trabalho da Fase 0
 * do pipeline de assets descrito no doc de arquitetura (retopologia,
 * geração de LOD, compressão Draco/KTX2). Enquanto `device.modelPath` for
 * `null`, este componente renderiza um placeholder geométrico no formato
 * aproximado de um smartphone, só para validar câmera, luz, proporção e
 * animação da cena.
 *
 * Quando os modelos otimizados existirem, o bloco de placeholder abaixo
 * deve ser trocado por `useGLTF(device.modelPath)` dentro de um
 * <Suspense>, sem alterar a interface do componente (continua recebendo
 * `device` e vivendo dentro do mesmo <group>).
 */
function PhoneModel({ device }) {
  const groupRef = useRef(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Rotação lenta e contínua — feita direto no objeto Three.js (via ref),
    // nunca via setState/store, para não gerar re-render do React a cada frame.
    groupRef.current.rotation.y += delta * 0.25
  })

  if (!device) return null

  const isPlaceholder = !device.modelPath

  return (
    <group ref={groupRef}>
      {isPlaceholder ? (
        <PlaceholderPhone />
      ) : (
        // TODO (Fase 0 do roadmap): const { scene } = useGLTF(device.modelPath)
        // return <primitive object={scene} />
        <PlaceholderPhone />
      )}
    </group>
  )
}

// Placeholder geométrico simples: corpo + "tela". Serve só para ter algo
// visível e testável em cena antes de existirem modelos 3D reais.
function PlaceholderPhone() {
  return (
    <>
      <RoundedBox args={[0.9, 1.9, 0.09]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.25} />
      </RoundedBox>
      <RoundedBox
        args={[0.8, 1.76, 0.01]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0.052]}
      >
        <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.15} />
      </RoundedBox>
    </>
  )
}

export default PhoneModel
