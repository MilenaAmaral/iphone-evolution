import { create } from 'zustand'
import { devices } from '../data/devices'

/**
 * useExperienceStore.js
 *
 * Store global (Zustand) com o estado "lógico" da experiência: qual
 * geração está ativa. Zustand foi escolhido no lugar de React Context
 * porque permite que cada componente assine só a fatia de estado que
 * usa, sem re-renderizar a árvore inteira a cada mudança — importante
 * quando a cena 3D e o DOM leem o mesmo estado.
 *
 * Importante (ver doc de arquitetura): nenhum valor que muda a cada frame
 * (posição de câmera, progresso contínuo de scroll etc.) deve entrar
 * aqui. Isso fica em refs dentro dos componentes de cena, lido por
 * useFrame. Este store guarda apenas estado discreto, que muda por ação
 * do usuário (clique na timeline, por exemplo).
 *
 * `devices` NÃO faz parte do estado exposto por este store — é um array
 * estático (definido uma vez em data/devices.js, nunca modificado em
 * runtime), então todo componente que precisa dele importa diretamente de
 * lá (`import { devices } from '../../data/devices'`), a mesma fonte que
 * este arquivo já usa internamente pra calcular `activeDevice`. Antes
 * dessa limpeza, `devices` também vivia aqui como conveniência, e alguns
 * componentes liam por aqui enquanto outros importavam direto — duas
 * formas de acessar o mesmo dado, sem motivo (ver auditoria de
 * "gerenciamento de estado").
 */
export const useExperienceStore = create((set) => ({
  activeIndex: 0,
  activeDevice: devices[0],

  setActiveIndex: (index) =>
    set(() => {
      const clamped = Math.max(0, Math.min(index, devices.length - 1))
      return { activeIndex: clamped, activeDevice: devices[clamped] }
    }),

  setActiveDeviceId: (id) =>
    set(() => {
      const index = devices.findIndex((device) => device.id === id)
      if (index === -1) return {}
      return { activeIndex: index, activeDevice: devices[index] }
    }),
}))
