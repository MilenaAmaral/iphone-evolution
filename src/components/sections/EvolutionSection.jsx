import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { devices } from '../../data/devices'
import Timeline from '../timeline/Timeline'
import PhoneInfo from '../phone/PhoneInfo'
import SceneErrorBoundary from '../phone/SceneErrorBoundary'
import SceneLighting from '../phone/SceneLighting'
import ModelLoaderFallback from '../phone/ModelLoaderFallback'
import ScrollControlledPhone from '../phone/ScrollControlledPhone'
import ScrollCameraRig from '../phone/ScrollCameraRig'
import { ScrollProgressProvider, useScrollProgress, useNavigateRef } from '../../hooks/useScrollProgress'
import { useScrollTimeline } from '../../hooks/useScrollTimeline'
import { useModelWindow } from '../../hooks/useModelWindow'
import { useInView } from '../../hooks/useInView'
import { useExperienceStore } from '../../store/useExperienceStore'
import './EvolutionSection.css'

/**
 * EvolutionSection — wrapper fino cuja única função é abrir o
 * <ScrollProgressProvider> (o ref compartilhado entre quem escreve o
 * progresso do scroll e quem lê dentro de useFrame). A lógica de verdade
 * mora em EvolutionSectionContent, que já nasce dentro do Provider e
 * pode chamar useScrollProgress().
 *
 * --- Troca dinâmica de modelo 3D: por que NÃO é só montar/desmontar ---
 *
 * A forma mais óbvia de "trocar de modelo 3D" seria só isso: quando o
 * aparelho ativo muda, desmontar o componente do antigo e montar um novo
 * com o `modelPath` do próximo. Não fizemos assim, por dois problemas
 * reais que essa abordagem tem nesta experiência especificamente:
 *
 * 1) Suspense global escondendo o que já estava pronto. `useGLTF` suspende
 *    (lança uma Promise) enquanto o .glb carrega. Se os dois aparelhos
 *    visíveis (o que sai + o que entra) dividissem UM <Suspense> só, o
 *    aparelho que entra ainda carregando faria o fallback cobrir A CENA
 *    INTEIRA — inclusive o aparelho que JÁ estava totalmente carregado e
 *    visível um instante antes. É exatamente o tipo de travamento visual
 *    que os requisitos pedem pra evitar. Por isso cada instância aqui tem
 *    o PRÓPRIO <Suspense> (ver os dois blocos abaixo) — um suspende sem
 *    afetar o outro.
 *
 * 2) Remontar destrói e recria trabalho que não precisava ser refeito. Se
 *    a troca de aparelho fosse modelada como dois "slots" fixos
 *    ("current"/"next", como na primeira versão deste componente) e cada
 *    slot tivesse sua própria key, o aparelho que ERA "next" e passa a
 *    ser "current" trocaria de key nessa transição — o React desmontaria
 *    a instância antiga e montaria outra do zero, mesmo sendo O MESMO
 *    aparelho, já carregado, já clonado, já com a opacidade certa. Isso
 *    desperdiça o clone (SkeletonUtils.clone + clonagem de materiais) e,
 *    pior, arrisca um Suspense desnecessário se o cache tiver sido
 *    liberado nesse meio-tempo.
 *
 * A solução: `ScrollControlledPhone` não recebe mais um "papel" — recebe
 * a posição FIXA do aparelho no array (`deviceIndex`) e calcula sozinho,
 * a cada frame, a que distância está do playhead contínuo do scroll (ver
 * o comentário dentro do próprio componente). A key de cada instância
 * aqui embaixo é só `device.id`: o mesmo aparelho mantém a MESMA
 * instância React enquanto estiver "por perto" (seja como o que sai ou o
 * que entra) — ela só desmonta de verdade quando o aparelho sai da
 * janela renderizada (deixa de ser `activeDevice` ou `nextDevice`). Menos
 * trabalho refeito, e o Suspense de cada um é isolado do outro.
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

  const activeIndex = useExperienceStore((state) => state.activeIndex)
  const activeDevice = useExperienceStore((state) => state.activeDevice)
  const nextDevice = devices[activeIndex + 1]
  // Mesma conta que useScrollTimeline faz internamente (nº de aparelhos - 1,
  // nunca menor que 1) — derivada de `devices.length` nos dois lugares, sem
  // nenhum estado independente que possa desincronizar.
  const segments = Math.max(1, devices.length - 1)

  const progressRef = useScrollProgress()
  const navigateRef = useNavigateRef()

  // Com a experiência ficando bem mais longa (8 capítulos de storytelling
  // abaixo desta seção), o <Canvas> daqui NÃO pode continuar rodando
  // useFrame pra sempre depois que o usuário já rolou pra longe — sem
  // isso, cada capítulo seguinte concorreria por CPU/GPU com uma cena 3D
  // que ninguém mais está vendo. `frameloop="never"` (ver abaixo) pausa o
  // loop de render do R3F sem desmontar nada — o scroll pinado/timeline
  // continuam vivos, só o desenho de frames pausa até a seção voltar a
  // ficar perto da viewport.
  const sectionInView = useInView(sectionRef)

  // Mantém os modelos GLB perto da geração ativa pré-carregados (prontos
  // antes de precisarem aparecer) e libera os que ficaram longe — ver
  // src/hooks/useModelWindow.js.
  useModelWindow({ devices, activeIndex })

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

        <div
          className="evolution-section__viewer"
          role="img"
          aria-label={`Modelo 3D do ${activeDevice.name}, lançado em ${activeDevice.year}`}
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [1.6, 1, 3.2], fov: 32 }}
            gl={{ antialias: true }}
            frameloop={sectionInView ? 'always' : 'never'}
          >
            <SceneLighting />

            <SceneErrorBoundary modelPath={activeDevice.modelPath}>
              {/* Dois aparelhos montados ao mesmo tempo: o que está
                  saindo de cena (activeDevice) e o que está entrando
                  (nextDevice), conforme o usuário rola dentro do segmento
                  atual (ver ScrollControlledPhone). Sem `nextDevice`
                  (último aparelho da linha), só o atual é renderizado.

                  A key de cada um é só o `id` do aparelho — NUNCA um
                  papel ("current"/"next") — de propósito: quando o
                  scroll cruza pro próximo segmento, o aparelho que era
                  "next" vira "current" (mesmo id, mesma posição no
                  array), então o React REAPROVEITA a mesma instância —
                  não remonta, não re-clona o modelo, não força um novo
                  Suspense. Só quando um aparelho sai da janela renderizada
                  (deixa de ser activeDevice OU nextDevice) é que ele
                  desmonta de fato. Ver o comentário grande no topo do
                  arquivo sobre por que essa troca de arquitetura importa. */}
              <Suspense fallback={<ModelLoaderFallback />}>
                <ScrollControlledPhone
                  key={activeDevice.id}
                  device={activeDevice}
                  deviceIndex={activeIndex}
                  segments={segments}
                  progressRef={progressRef}
                />
              </Suspense>
            </SceneErrorBoundary>
              {nextDevice && (
                // fallback={null}: o "próximo" aparelho não é o foco
                // principal da tela — se o glb dele ainda não tiver
                // resolvido, é melhor ele simplesmente não aparecer ainda
                // (ficar invisível) do que exibir um spinner ao lado do
                // aparelho atual, que já está totalmente carregado e
                // visível. O spinner "de verdade" (ModelLoaderFallback)
                // fica reservado pro aparelho principal, acima.
                <SceneErrorBoundary modelPath={nextDevice.modelPath}>
                  <Suspense fallback={null}>
                    <ScrollControlledPhone
                      key={nextDevice.id}
                      device={nextDevice}
                      deviceIndex={activeIndex + 1}
                      segments={segments}
                      progressRef={progressRef}
                    />
                  </Suspense>
                </SceneErrorBoundary>
              )}

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
