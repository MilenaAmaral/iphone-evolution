/**
 * deviceStats.js
 *
 * Pequenos parsers que EXTRAEM números já presentes nos textos verificados
 * de `devices.js` — nunca inventam um valor novo. Servem só pra desenhar
 * comparações visuais (barras, listas ordenadas) a partir de dados que já
 * existem como string, ex.: o texto "12,3 mm" vira o número `12.3`.
 *
 * Cada função devolve `null` quando não encontra o padrão esperado, pra
 * nunca renderizar um valor errado por engano (silenciosamente "zero").
 */

const parsePtNumber = (raw) => {
  const number = Number.parseFloat(raw.replace(',', '.'))
  return Number.isFinite(number) ? number : null
}

// "12,3 mm" -> 12.3
export const getThicknessMm = (device) => {
  const match = device.thickness.match(/(\d+(?:,\d+)?)/)
  return match ? parsePtNumber(match[1]) : null
}

// "133 g" -> 133
export const getWeightGrams = (device) => {
  const match = device.weight.match(/(\d+(?:,\d+)?)/)
  return match ? parsePtNumber(match[1]) : null
}

// '3,5" LCD, 480×320 px (163 ppi)' -> 3.5
export const getDisplayInches = (device) => {
  const match = device.display.match(/(\d+(?:,\d+)?)"/)
  return match ? parsePtNumber(match[1]) : null
}

// "48MP principal ƒ/1.6 + 12MP ultra grande angular..." -> 48 (resolução do
// primeiro sensor citado no texto).
export const getMainCameraMP = (device) => {
  const match = device.camera.match(/(\d+)\s*MP/)
  return match ? Number.parseInt(match[1], 10) : null
}

// Número de lentes traseiras citado no texto ("Dupla"/"Tripla"); sem menção
// explícita, o texto descreve uma lente só.
export const getLensCount = (device) => {
  const text = device.camera.toLowerCase()
  if (text.includes('tripla')) return 3
  if (text.includes('dupla')) return 2
  return 1
}
