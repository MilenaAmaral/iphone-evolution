import { Environment, Lightformer } from '@react-three/drei'

/**
 * SceneLighting — iluminação em três pontos (key/fill/rim) + ambiente
 * procedural, compartilhada entre o PhoneViewer "manual" (OrbitControls)
 * e a cena controlada por scroll. Extraído pra cá pra não duplicar a
 * mesma configuração de luz nos dois lugares.
 *
 * O <Environment> usa Lightformers (formas emissoras geradas na hora)
 * em vez de um preset HDRI: presets baixam um arquivo de um CDN externo,
 * o que falha atrás de proxies/firewalls restritivos. Isso é 100%
 * procedural, sem nenhuma requisição de rede.
 */
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[3, 4, 2]}
        intensity={1.6}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.35} color="#bcd4ff" />
      <spotLight position={[0, 3, -4]} intensity={0.6} angle={0.5} penumbra={1} />

      <Environment resolution={256} background={false}>
        <Lightformer form="ring" intensity={2} position={[0, 3, 0]} scale={4} />
        <Lightformer form="rect" intensity={1} position={[-3, 1, 2]} scale={3} />
        <Lightformer form="rect" intensity={0.6} position={[3, -1, -2]} scale={3} />
      </Environment>
    </>
  )
}

export default SceneLighting
