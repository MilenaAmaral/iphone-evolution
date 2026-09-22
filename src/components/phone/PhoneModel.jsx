import { useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useGLTF, useAnimations, RoundedBox } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { USE_DRACO, USE_MESHOPT } from '../../three/gltfCache'

/**
 * PhoneModel — carrega e exibe o modelo 3D de UM aparelho.
 *
 * Com `modelPath`: carrega o .glb/.gltf de verdade via `useGLTF` (dentro
 * de <Suspense>, ver PhoneViewer) — hoje é o caso dos 19 aparelhos do
 * dataset, cada um com seu próprio .glb gerado (ver comentário de
 * `modelPath` em devices.js). Sem `modelPath`: cai num placeholder
 * geométrico (não é imagem 2D — é malha 3D real), mantido como fallback
 * defensivo para um eventual aparelho futuro adicionado ao dataset antes
 * de ter um modelo gerado para ele.
 */
function PhoneModel({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0] }) {
  if (!modelPath) {
    return (
      <PlaceholderPhone rotation={rotation} scale={scale} position={position} />
    )
  }

  return (
    <GltfPhoneModel
      modelPath={modelPath}
      rotation={rotation}
      scale={scale}
      position={position}
    />
  )
}

function GltfPhoneModel({ modelPath, rotation, scale, position }) {
  const groupRef = useRef(null)
  // `USE_DRACO`/`USE_MESHOPT` vêm de gltfCache.js — as mesmas flags usadas
  // em `preloadModel`/`releaseModel`, pra carregar e pré-carregar sempre
  // com a mesma configuração de loader (ver os comentários lá sobre por
  // que Draco fica desligado e Meshopt ligado por padrão).
  const { scene, animations } = useGLTF(modelPath, USE_DRACO, USE_MESHOPT)

  // `useGLTF` cacheia por URL e devolve A MESMA instância de `scene` para
  // qualquer componente que peça o mesmo `modelPath` — inclusive duas
  // instâncias de PhoneModel ao mesmo tempo. Mexer nela direto faria uma
  // instância vazar transformação/estado pra outra. `SkeletonUtils.clone`
  // clona a árvore de objetos (preservando skinning, se houver) mas
  // reaproveita geometria/material por referência — leve. `useMemo` com
  // `scene` como dependência garante que o clone só é refeito quando o
  // modelo realmente muda, nunca a cada render do componente.
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  const { actions, names } = useAnimations(animations, groupRef)

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        // `useGLTF` cacheia MATERIAIS também, e são compartilhados por
        // referência entre toda instância que usa o mesmo modelPath —
        // inclusive entre "current" e "next" ao mesmo tempo na cena de
        // scroll. Sem clonar aqui, animar `material.opacity` numa
        // instância vazaria pra todas as outras (inclusive a de outro
        // device, se compartilharem o mesmo asset). Clona uma vez por
        // instância montada, não por frame.
        if (Array.isArray(child.material)) {
          child.material = child.material.map((material) => material.clone())
        } else if (child.material) {
          child.material = child.material.clone()
        }
      }
    })
  }, [clonedScene])

  useEffect(() => {
    // Toca a primeira animação embutida no arquivo, se o modelo trouxer
    // alguma (ex.: dobra de tela, abertura de câmera). Nenhum device atual
    // tem clipes, mas o suporte fica pronto pro dia que tiver.
    const [firstClip] = names
    if (!firstClip) return undefined

    const action = actions[firstClip]
    action?.reset().fadeIn(0.4).play()
    return () => action?.fadeOut(0.4)
  }, [actions, names])

  return (
    <group
      ref={groupRef}
      rotation={rotation}
      scale={scale}
      position={position}
      // Evita que o R3F chame dispose() nos objetos ao desmontar — a
      // GEOMETRIA (diferente do material, clonado acima) continua
      // compartilhada por referência com o cache do useGLTF; descartá-la
      // aqui quebraria qualquer outra instância montada (ou futura) do
      // mesmo modelo. A liberação de recursos de verdade é feita de
      // propósito, no nível do CACHE — não no unmount de uma instância —
      // por `releaseModel` (ver src/three/gltfCache.js e useModelWindow).
      dispose={null}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

// Placeholder geométrico: corpo + "tela" em caixas arredondadas. Fica no
// lugar do modelo real enquanto `modelPath` não existir para o aparelho.
function PlaceholderPhone({ rotation, scale, position }) {
  return (
    <group rotation={rotation} scale={scale} position={position}>
      <RoundedBox args={[0.9, 1.9, 0.09]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.25} />
      </RoundedBox>
      <RoundedBox
        args={[0.8, 1.76, 0.01]}
        radius={0.1}
        smoothness={4}
        position={[0, 0, 0.052]}
        castShadow
      >
        <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.15} />
      </RoundedBox>
    </group>
  )
}

PhoneModel.propTypes = {
  modelPath: PropTypes.string,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
}

export default PhoneModel
