import { getDeviceById } from './devices'

/**
 * milestones.js
 *
 * Curadoria de "grandes mudanças" de design pra seção GRANDES MUDANÇAS.
 * Este arquivo NÃO cria nenhum texto novo sobre os aparelhos: cada
 * `description` abaixo é uma string copiada literalmente de
 * `highlights` em devices.js — a mesma fonte verificada usada no resto da
 * experiência. A única decisão tomada aqui é QUAIS marcos entram na
 * narrativa e em que ordem (a curadoria em si, nunca o fato).
 */
const pickHighlight = (id, highlightIndex = 0) => {
  const device = getDeviceById(id)
  return {
    id: device.id,
    year: device.year,
    name: device.name,
    description: device.highlights[highlightIndex],
  }
}

export const milestones = [
  pickHighlight('iphone-4', 0), // "Primeiro iPhone com tela 'Retina'"
  pickHighlight('iphone-5', 0), // Conector Lightning
  pickHighlight('iphone-7', 1), // Remoção da entrada de fone de ouvido
  pickHighlight('iphone-x', 0), // Face ID, sem botão Home
  pickHighlight('iphone-12', 1), // MagSafe
  pickHighlight('iphone-15', 1), // Dynamic Island no modelo padrão
]
