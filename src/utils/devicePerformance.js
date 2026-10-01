/**
 * devicePerformance.js
 *
 * Sinal simples de "dispositivo com pouca margem de GPU/CPU", usado só
 * pra decidir a RESOLUÇÃO de render (dpr) e o tamanho do shadow map —
 * nunca pra ligar/desligar recursos por completo. A ideia não é
 * "diminuir tudo em mobile": é reduzir especificamente o que é caro e
 * pouco perceptível numa tela pequena (super-sampling acima de 1x,
 * sombra em alta resolução) só quando há sinal real de hardware
 * limitado — nunca por suposição.
 *
 * Critério deliberadamente conservador — os dois precisam ser verdade:
 * 1) `pointer: coarse` (entrada por toque, não mouse) — sinaliza
 *    celular/tablet, não um notebook fraco com mouse.
 * 2) `navigator.hardwareConcurrency <= 4` — poucos núcleos de CPU, um
 *    proxy razoável (não perfeito, mas amplamente suportado) pra
 *    hardware de entrada/intermediário.
 *
 * Só classifica como 'low' quando as DUAS batem. Qualquer ambiguidade
 * (API ausente, SSR, valor indisponível) cai em 'high' — preserva
 * qualidade quando não há certeza, como pedido: reduzir errado por
 * excesso de cautela custa mais visualmente do que deixar de reduzir
 * num aparelho que aguentaria menos.
 *
 * Resultado é calculado uma única vez por sessão (o hardware não muda
 * em runtime) e cacheado em módulo — mesmo padrão de
 * `prefersReducedMotion` em motionPreference.js, só que aqui vale a
 * pena cachear porque `matchMedia` roda em toda montagem de <Canvas>.
 */
let cachedTier

export function getQualityTier() {
  if (cachedTier) return cachedTier

  if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'high'
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const fewCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4

  cachedTier = coarsePointer && fewCores ? 'low' : 'high'
  return cachedTier
}

// Teto de dpr (device pixel ratio) passado ao <Canvas> do R3F. Em 'low',
// trava em 1x (sem super-sampling); em 'high', mantém o intervalo
// [1, 2] que já existia antes desta otimização — telas retina/high-DPI
// continuam nítidas em qualquer aparelho com folga de GPU.
export function getDprRange() {
  // Teto de 1.5x (antes 2x): em tela retina, 2x renderiza ~78% mais pixels
  // que 1.5x para um ganho de nitidez difícil de perceber num viewer com
  // antialias. É o mesmo teto que o Canvas do logo da abertura já usava.
  return getQualityTier() === 'low' ? 1 : [1, 1.5]
}

// Resolução do shadow map da luz direcional principal (ver
// SceneLighting.jsx). 1024 já era um valor moderado; 512 em 'low' custa
// 4x menos memória/preenchimento de textura de sombra, com perda visual
// pequena numa tela de celular (onde a sombra ocupa poucos pixels de
// qualquer forma).
export function getShadowMapSize() {
  return getQualityTier() === 'low' ? 512 : 1024
}

export default getQualityTier
