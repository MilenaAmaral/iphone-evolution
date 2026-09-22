import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

/**
 * gsapSetup.js — configuração ÚNICA e global do GSAP/ScrollTrigger,
 * importada uma vez por efeito colateral em main.jsx, antes de qualquer
 * componente montar. `registerPlugin` já é chamado individualmente em
 * alguns hooks/componentes (scrollTimeline.js, useScrollReveal.js) — isso
 * continua seguro (é idempotente), mas a CONFIGURAÇÃO global do
 * ScrollTrigger só faz sentido existir em um único lugar.
 *
 * `ignoreMobileResize: true` evita que o ScrollTrigger recalcule TODOS os
 * triggers da página (são muitos — cada elemento `[data-reveal]` cria o
 * seu próprio, ver useScrollReveal.js) sempre que a barra de
 * endereço/teclado do navegador mobile aparece ou some. Esse
 * show/hide dispara um evento de resize sem o viewport ter mudado de
 * largura de verdade, e sem essa config isso causava um recálculo (e
 * tranco visível) bem no meio da rolagem em Safari/Chrome mobile.
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }
