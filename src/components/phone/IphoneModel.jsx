import { useLayoutEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'
import { USE_DRACO, USE_MESHOPT } from '../../three/gltfCache'

const TARGET_SIZE = 1.15
const CAMERA_MARGIN = 1.22

function IphoneModel({ modelPath, rotation = [0, 0, 0], fitCamera = false }) {
  const { scene } = useGLTF(modelPath, USE_DRACO, USE_MESHOPT)
  const { camera, size } = useThree()

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

  useLayoutEffect(() => {
    if (!fitCamera || !camera.isPerspectiveCamera || !size.width || !size.height) return

    const bounds = new THREE.Box3().setFromObject(fittedModel.clone)
    const sphere = bounds.getBoundingSphere(new THREE.Sphere())
    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
    const limitingFov = Math.min(verticalFov, horizontalFov)
    const fittedRadius = sphere.radius * fittedModel.scale
    const distance = (fittedRadius / Math.tan(limitingFov / 2)) * CAMERA_MARGIN
    const direction = camera.position.clone().normalize()

    camera.position.copy(direction.multiplyScalar(distance))
    camera.near = Math.max(0.01, distance - fittedRadius * 2)
    camera.far = distance + fittedRadius * 4
    camera.updateProjectionMatrix()
  }, [camera, fitCamera, fittedModel, size.height, size.width])

  return (
    <group rotation={rotation} scale={fittedModel.scale} position={fittedModel.position} dispose={null}>
      <primitive object={fittedModel.clone} />
    </group>
  )
}

IphoneModel.propTypes = {
  modelPath: PropTypes.string.isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
  fitCamera: PropTypes.bool,
}

export default IphoneModel