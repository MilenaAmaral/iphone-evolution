// deviceColorMap.mjs
//
// Mapa de nome de cor (como aparece em `devices.js`, ex.: "Cinza-espacial",
// "(Product)RED") -> um tom RGB aproximado, usado só pra colorir os
// modelos 3D gerados (ver generate-device-models.mjs). Isso NÃO é uma cor
// "oficial" da Apple copiada de nenhum lugar — é uma interpretação nossa,
// estilizada, de como cada nome de cor real (já verificado em devices.js)
// deveria parecer num material simples e fosco, consistente com a
// identidade visual original do projeto (ver index.css: paleta sem azul-
// sistema, sem tentar imitar o acabamento exato de metal/vidro da Apple).
//
// `normalizeColorName` remove anotações entre parênteses ("(chegou em
// abril de 2011)", "(adicionado em 2017)") e pega só o nome de cor em si,
// já que o texto completo de `colors[]` às vezes inclui essa nota
// histórica junto (dado real, mas irrelevante pra escolher um tom).

const COLOR_HEX = {
  'preto': '#1c1c1e',
  'preto brilhante': '#0a0a0c',
  'branco': '#f0efe9',
  'cinza-espacial': '#48484a',
  'prata': '#d6d6d8',
  'dourado': '#e6d2ab',
  'ouro rosa': '#f0d2c9',
  '(product)red': '#a82834',
  'roxo': '#8a7bb0',
  'amarelo': '#e3cf5a',
  'verde': '#7c9a80',
  'azul': '#4f6fa0',
  'meia-noite': '#232326',
  'estelar': '#ece3d2',
  'rosa': '#e6c3c8',
  'ultramarine': '#48588f',
  'teal': '#3f7877',
  'lavanda': '#b6acce',
  'sage': '#a4ac8e',
  'azul-névoa': '#a7bbce',
  'glacier': '#d7e2e6',
  'bordô': '#551620',
  'ardósia': '#3c3d43',
}

const DEFAULT_HEX = '#3a3a3d'

export function normalizeColorName(rawColor) {
  return rawColor
    .replace(/\([^)]*\)/g, '') // remove anotações "(chegou em ...)" — mas preserva "(PRODUCT)RED" tratado à parte abaixo
    .trim()
    .toLowerCase()
}

export function colorNameToHex(rawColor) {
  const lower = rawColor.toLowerCase()
  if (lower.includes('product)red') || lower.includes('product) red')) return COLOR_HEX['(product)red']

  const normalized = normalizeColorName(rawColor)
  // Nomes compostos ("Preto e Ardósia", "Branco e Prata") — usa a primeira
  // metade, que já é o nome de cor "principal" citado no dado real.
  const firstPart = normalized.split(/ e /)[0].trim()

  return COLOR_HEX[firstPart] ?? COLOR_HEX[normalized] ?? DEFAULT_HEX
}

export function hexToRgbFloat(hex) {
  const clean = hex.replace('#', '')
  const r = Number.parseInt(clean.slice(0, 2), 16) / 255
  const g = Number.parseInt(clean.slice(2, 4), 16) / 255
  const b = Number.parseInt(clean.slice(4, 6), 16) / 255
  return [r, g, b]
}
