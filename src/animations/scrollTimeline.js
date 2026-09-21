import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * createScrollTimeline — função pura (não é hook, não é componente) que
 * monta a timeline GSAP/ScrollTrigger que conduz toda a experiência de
 * scroll. Fica separada de React de propósito: é só configuração de
 * animação, então é testável/lida isoladamente, e o hook que a usa
 * (useScrollTimeline) cuida apenas do ciclo de vida React em volta dela.
 *
 * `segments` é o número de "transições" a percorrer (nº de aparelhos - 1).
 * A seção fica pinada (`pin`) por `segments` alturas de viewport — cada
 * altura de viewport rolada corresponde a passar de um aparelho pro
 * próximo. `scrub: 1` faz a timeline seguir o scroll com um pequeno atraso
 * suavizado (1s de "lag" elástico) em vez de saltar 1:1 com o wheel,
 * o que evita a sensação de animação "presa" ao pixel do mouse.
 *
 * `onUpdate` é chamado pelo ScrollTrigger a cada tick de scroll (throttled
 * ao refresh do navegador) e é a ÚNICA fonte de verdade do progresso —
 * tanto o hook (que decide trocar o aparelho ativo no store) quanto a
 * cena 3D (via ref, fora de React) leem o mesmo `self.progress`.
 */
export function createScrollTimeline({ section, pin, title, panel, segments, onUpdate }) {
  const safeSegments = Math.max(1, segments)

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      // '+=' relativo: a seção fica pinada por N alturas de viewport,
      // uma por transição entre aparelhos consecutivos.
      end: () => `+=${safeSegments * window.innerHeight * 1.4}`,
      pin,
      scrub: 1,
      anticipatePin: 1,
      onUpdate,
    },
  })

  // Tweens do DOM (título de abertura e painel de informações) — rodam na
  // mesma timeline "scrubada" pelo scroll, então saem/entram em sincronia
  // com o que a cena 3D está fazendo, sem precisar de nenhum listener extra.
  //
  // Importante: a timeline não tem NENHUM outro conteúdo além desses dois
  // tweens, então a duração total dela é definida por eles. Se a duração
  // fosse só "0.6", esses 0.6 segundos passariam a representar 100% do
  // scroll pinado inteiro (todos os `segments`) — ou seja, o título levaria
  // a rolagem de TODA a seção pra sumir, em vez de sumir rápido logo no
  // início como pede o spec ("no início: título visível" / "durante o
  // scroll: informações aparecem"). Por isso fixamos a duração total da
  // timeline em `safeSegments` (uma unidade de tempo por transição entre
  // aparelhos) com um marcador vazio no fim, e colocamos o fade-out do
  // título/fade-in do painel só nos primeiros 0.3 dessas unidades — uma
  // fração pequena e fixa do início, não da seção toda.
  const introDuration = Math.min(0.3, safeSegments * 0.3)

  // `.fromTo()` com os dois lados explícitos (em vez de `.from()`/`.to()`
  // deduzindo um lado a partir do valor "atual" do DOM) — importante em
  // React: no StrictMode (dev), efeitos rodam montar→limpar→montar, então
  // pode existir um estilo inline residual de uma instância anterior no
  // exato instante em que esta timeline é criada. Se um `.from()` lesse
  // esse resíduo como "valor nativo de destino", a animação silenciosamente
  // não teria efeito nenhum (origem e destino iguais). `.fromTo()` nunca
  // depende do estado atual do DOM pra nenhuma das pontas.
  timeline
    .fromTo(title, { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: introDuration, ease: 'power1.out' }, 0)
    .fromTo(panel, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: introDuration, ease: 'power1.out' }, 0)
    // Marcador de duração zero no fim da timeline: só existe pra "esticar"
    // a duração total até `safeSegments`, mantendo o mapeamento 1 unidade
    // de timeline = 1 transição entre aparelhos.
    .to({}, { duration: 0 }, safeSegments)

  const scrollTrigger = timeline.scrollTrigger

  // Cleanup único: quem usa isso (useScrollTimeline) chama essa função no
  // retorno do efeito, garantindo que nada fique "pinado" ou escutando
  // scroll depois que o componente desmonta (troca de rota, HMR etc.).
  // `clearProps` remove os estilos inline que o GSAP aplicou (opacity,
  // transform), devolvendo os elementos ao estado definido só pelo CSS —
  // sem isso, uma remontagem (StrictMode, HMR) herdaria um estilo residual
  // da instância anterior, como aconteceu ao depurar essa timeline.
  return function cleanup() {
    scrollTrigger?.kill()
    timeline.kill()
    gsap.set([title, panel], { clearProps: 'opacity,transform' })
  }
}
