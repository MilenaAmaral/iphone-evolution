/**
 * motionPreference.js
 *
 * Um único ponto de leitura pra preferência do sistema/navegador por
 * "reduzir movimento" (`prefers-reduced-motion`). Usado por toda animação
 * do projeto (GSAP e Three.js) pra decidir entre a versão completa da
 * animação e uma alternativa mais enxuta.
 *
 * Importante: isso nunca desliga a INTERATIVIDADE em si — o scroll pinado
 * da EvolutionSection continua funcionando normalmente com essa
 * preferência ativa, por exemplo; só o exagero puramente decorativo (a
 * câmera "respirando", a linha do tempo se desenhando conforme rola, o
 * deslocamento vertical nas animações de entrada) é removido ou reduzido
 * a uma transição quase instantânea.
 *
 * Lida uma vez por chamada (não reage a uma mudança da preferência em
 * tempo real durante a sessão) — suficiente aqui porque cada animação já
 * é recriada a cada montagem do componente que a usa.
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default prefersReducedMotion
