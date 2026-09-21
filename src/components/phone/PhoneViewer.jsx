import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import PhoneModel from './PhoneModel'
import { useExperienceStore } from '../../store/useExperienceStore'
import './PhoneViewer.css'

/**
 * PhoneViewer: dono do <Canvas> do React Three Fiber. É montado uma única
 * vez em App.jsx e fica fixo atrás do conteúdo DOM (ver PhoneViewer.css) —
 * por isso ele existe fora das seções, não dentro de cada uma. Isso evita
 * recriar o contexto WebGL a cada troca de seção, conforme decidido no
 * doc de arquitetura.
 *
 * Nesta etapa inicial ele só mostra o aparelho ativo do store, sem câmera
 * dirigida por scroll — isso entra em uma fase posterior do roadmap.
 */
function PhoneViewer() {
  const activeDevice = useExperienceStore((state) => state.activeDevice)

  return (
    <div className="phone-viewer" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.3} />
        <Suspense fallback={null}>
          <PhoneModel device={activeDevice} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.35}
            blur={2.4}
            scale={6}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default PhoneViewer
