import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { USE_DRACO, USE_MESHOPT } from '../../three/gltfCache'

const TARGET_SIZE = 1.15

function IphoneModel({ modelPath, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(modelPath, USE_DRACO, USE_MESHOPT)

  const fittedModel = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    const bounds = new THREE.Box3().setFromObject(clone)
    const size = bounds.getSize(new THREE.Vector3())
    const center = bounds.getCenter(new THREE.Vector3())
    const largestDimension = Math.max(size.x, size.y, size.z) || 1
    const scale = TARGET_SIZE / largestDimension

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return {
      clone,
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale],
    }
  }, [scene])

  return (
    <group rotation={rotation} scale={fittedModel.scale} position={fittedModel.position} dispose={null}>
      <primitive object={fittedModel.clone} />
    </group>
  )
}

IphoneModel.propTypes = {
  modelPath: PropTypes.string.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
}

export default IphoneModel