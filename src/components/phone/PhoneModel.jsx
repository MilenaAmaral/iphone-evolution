import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { USE_DRACO, USE_MESHOPT } from '../../three/gltfCache'

const AUTO_ROTATION_SPEED = 0.24

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
function PhoneModel({ modelPath, rotation = [0, 0, 0], scale = 1, position = [0, 0, 0], targetSize }) {
  if (!modelPath) return null

  return (
    <GltfPhoneModel
      modelPath={modelPath}
      rotation={rotation}
      scale={scale}
      position={position}
      targetSize={targetSize}
    />
  )
}

function GltfPhoneModel({ modelPath, rotation, scale, position, targetSize }) {
  const groupRef = useRef(null)
  const { camera, size, invalidate } = useThree()
  const controls = useThree((state) => state.controls)
  // `USE_DRACO`/`USE_MESHOPT` vêm de gltfCache.js — as mesmas flags usadas
  // em `preloadModel`/`releaseModel`, pra carregar e pré-carregar sempre
  // com a mesma configuração de loader (ver os comentários lá sobre por
  // que Draco fica desligado e Meshopt ligado por padrão).
  const { scene, animations } = useGLTF(modelPath, USE_DRACO, USE_MESHOPT)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = rotation[1] + (performance.now() / 1000) * AUTO_ROTATION_SPEED
  })

  // `useGLTF` cacheia por URL e devolve A MESMA instância de `scene` para
  // qualquer componente que peça o mesmo `modelPath` — inclusive duas
  // instâncias de PhoneModel ao mesmo tempo. Mexer nela direto faria uma
  // instância vazar transformação/estado pra outra. `SkeletonUtils.clone`
  // clona a árvore de objetos (preservando skinning, se houver) mas
  // reaproveita geometria/material por referência — leve. `useMemo` com
  // `scene` como dependência garante que o clone só é refeito quando o
  // modelo realmente muda, nunca a cada render do componente.
  // `position` chega como array literal (novo a cada render do pai); a
  // chave em string evita refazer o clone do modelo a cada re-render
  // (ex.: a cada movimento do slider em CompareSection).
  const positionKey = position.join(',')

  const fittedModel = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    if (!targetSize) return { clone, scale, position: positionKey.split(',').map(Number), radius: null }

    const bounds = new THREE.Box3().setFromObject(clone)
    const boundsSize = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const largestDimension = Math.max(boundsSize.x, boundsSize.y, boundsSize.z) || 1
    const fitScale = targetSize / largestDimension

    return {
      clone,
      scale: fitScale,
      position: [-center.x * fitScale, -center.y * fitScale, -center.z * fitScale],
      // Raio da esfera envolvente JÁ na escala exibida. Antes o enquadramento
      // da câmera media o clone sem a escala do grupo pai (a matriz do pai
      // ainda não existe nesse momento) e calculava a distância com o
      // tamanho bruto do .glb: câmera colada no aparelho (close extremo)
      // quando não havia OrbitControls para corrigir.
      radius: (boundsSize.length() / 2) * fitScale,
    }
  }, [positionKey, scale, scene, targetSize])

  const clonedScene = fittedModel.clone

  const { actions, names } = useAnimations(animations, groupRef)

  useLayoutEffect(() => {
    if (!targetSize || !camera.isPerspectiveCamera || !size.width || !size.height) return

    const sphere = { radius: fittedModel.radius }
    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
    const limitingFov = Math.min(verticalFov, horizontalFov)
    const distance = (sphere.radius / Math.tan(limitingFov / 2)) * 1.22
    const direction = camera.position.clone().normalize()

    camera.position.copy(direction.multiplyScalar(distance))

    // Os limites de zoom do OrbitControls são fixos (ex.: 2.2 a 5). Em telas
    // estreitas (celular em pé) a distância ideal pode passar do máximo, e o
    // controle "puxava" a câmera de volta, cortando o aparelho nas bordas.
    // Os limites passam a sempre incluir a distância de enquadramento.
    if (controls && 'maxDistance' in controls) {
      controls.maxDistance = Math.max(controls.maxDistance, distance * 1.35)
      controls.minDistance = Math.min(controls.minDistance, distance * 0.7)
      controls.update?.()
    }

    const farLimit = Math.max(distance, controls?.maxDistance ?? distance)
    const nearLimit = Math.min(distance, controls?.minDistance ?? distance)
    camera.near = Math.max(0.01, nearLimit - sphere.radius * 2)
    camera.far = farLimit + sphere.radius * 4
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, controls, fittedModel.radius, invalidate, size.height, size.width, targetSize])

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
      scale={fittedModel.scale}
      position={fittedModel.position}
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

PhoneModel.propTypes = {
  modelPath: PropTypes.string,
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
  position: PropTypes.arrayOf(PropTypes.number),
  targetSize: PropTypes.number,
}

export default PhoneModel
