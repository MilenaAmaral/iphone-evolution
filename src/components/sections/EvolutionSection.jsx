import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import Timeline from '../timeline/Timeline'
import PhoneInfo from '../phone/PhoneInfo'
import SceneErrorBoundary from '../phone/SceneErrorBoundary'
import SceneLighting from '../phone/SceneLighting'
import ModelLoaderFallback from '../phone/ModelLoaderFallback'
import ScrollControlledPhone from '../phone/ScrollControlledPhone'
import ScrollCameraRig from '../phone/ScrollCameraRig'
import { ScrollProgressProvider, useScrollProgress, useNavigateRef } from '../../hooks/useScrollProgress'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
import { useExperienceStore } from '../../store/useExperienceStore'
import './EvolutionSection.css'

/**
 * EvolutionSection — wrapper fino cuja única função é abrir o
 * <ScrollProgressProvider> (o ref compartilhado entre quem escreve o
 * progresso do scroll e quem lê dentro de useFrame). A lógica de verdade
 * mora em EvolutionSectionContent, que já nasce dentro do Provider e
 * pode chamar useScrollProgress().
 */
function EvolutionSection() {
  return (
    <ScrollProgressProvider>
      <EvolutionSectionContent />
    </ScrollProgressProvider>
  )
}

function EvolutionSectionContent() {
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const titleRef = useRef(null)
  const panelRef = useRef(null)

  const devices = useExperienceStore((state) => state.devices)
  const activeIndex = useExperienceStore((state) => state.activeIndex)
  const activeDevice = useExperienceStore((state) => state.activeDevice)
  const nextDevice = devices[activeIndex + 1]

  const progressRef = useScrollProgress()
  const navigateRef = useNavigateRef()

  // Monta e desmonta a timeline GSAP/ScrollTrigger em torno desta seção.
  // Todo o "cérebro" do scroll vive nesse hook — este componente só
  // fornece os refs de DOM que ele precisa medir/pinar. `navigateRef` é
  // preenchido pelo próprio hook com a função que a Timeline usa pra
  // navegar por clique (ver useScrollProgress.jsx).
  useScrollTimeline({
    sectionRef,
    pinRef,
    titleRef,
    panelRef,
    deviceCount: devices.length,
    progressRef,
    navigateRef,
  })

  return (
    <section ref={sectionRef} className="evolution-section" id="evolucao">
      <div ref={pinRef} className="evolution-section__pin">
        {/* Título de abertura: visível no início da seção, some conforme
            o usuário rola (tween controlado pela própria timeline, ver
            src/animations/scrollTimeline.js). pointer-events none pra
            nunca bloquear clique na Timeline/painel por baixo. */}
        <div ref={titleRef} className="evolution-section__intro">
          <h2>A evolução</h2>
          <p>Role para acompanhar cada geração, do 3G ao modelo mais recente.</p>
        </div>

        <div className="evolution-section__viewer">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [1.6, 1, 3.2], fov: 32 }}
            gl={{ antialias: true }}
          >
            <SceneLighting />

            <SceneErrorBoundary>
              <Suspense fallback={<ModelLoaderFallback />}>
                {/* Dois aparelhos montados ao mesmo tempo: o "current"
                    desaparece e o "next" aparece conforme o usuário rola
                    dentro do segmento atual (ver ScrollControlledPhone).
                    Sem `nextDevice` (último aparelho da linha), só o
                    atual é renderizado. */}
                <ScrollControlledPhone
                  key={`current-${activeDevice.id}`}
                  role="current"
                  modelPath={activeDevice.modelPath}
                  progressRef={progressRef}
                />
                {nextDevice && (
                  <ScrollControlledPhone
                    key={`next-${nextDevice.id}`}
                    role="next"
                    modelPath={nextDevice.modelPath}
                    progressRef={progressRef}
                  />
                )}
              </Suspense>
            </SceneErrorBoundary>

            <ScrollCameraRig progressRef={progressRef} />

            <ContactShadows position={[0, -1.05, 0]} opacity={0.45} blur={2.6} scale={8} far={2} />
          </Canvas>
        </div>

        <div ref={panelRef} className="evolution-section__panel">
          <Timeline />
          <PhoneInfo />
        </div>
      </div>
    </section>
  )
}

export default EvolutionSection
