/**
 * devices.js
 *
 * Dataset canônico da timeline. Cada objeto representa uma geração do
 * iPhone exibida na experiência.
 *
 * Fonte dos dados: especificações técnicas públicas (páginas de suporte/
 * especificações da Apple e registros históricos de lançamento). Textos de
 * marketing, fotos e identidade visual da Apple NÃO foram copiados —
 * apenas fatos técnicos objetivos (medidas, componentes, datas).
 *
 * Convenções:
 * - `generation`: posição cronológica do aparelho NESTA timeline (1 a 19).
 *   Não é um índice oficial da Apple — é só a ordem de exibição aqui.
 * - `modelPath`: caminho do modelo 3D (.glb) de cada geração —
 *   `/models/<id>.glb` (ex.: `/models/iphone-3g.glb`), montado pela função
 *   `getModelPath(id)` abaixo. Hoje isso aponta pros modelos gerados por
 *   `scripts/generate-device-models.mjs`: corpos ESTILIZADOS e abstratos
 *   (nunca uma reprodução do design real da Apple, nem uma imagem 2D) cujas
 *   proporções, espessura, cor e número de "lentes" são todos DERIVADOS de
 *   campos já verificados deste mesmo arquivo (ver o comentário no topo
 *   daquele script pros detalhes) — nunca inventados. Trocar por modelos
 *   definitivos (feitos por um artista 3D, por fotogrametria real) no
 *   futuro é só sobrescrever o `.glb` de mesmo nome — nenhum componente
 *   precisa mudar (PhoneModel/gltfCache só leem essa string). Rodar
 *   `node scripts/generate-device-models.mjs` de novo regenera todos os 19
 *   a partir dos dados atuais (por exemplo, depois de editar uma cor ou
 *   uma espessura aqui embaixo).
 * - `modelScale`: fator de escala aplicado por cima da animação de
 *   transição (ver ScrollControlledPhone), pra normalizar aparelhos cujo
 *   .glb exportado venha em proporções diferentes entre si (unidades de
 *   modelagem diferentes, aparelhos fisicamente maiores/menores etc.).
 *   Fica em `1` (neutro) em todos os itens porque os modelos gerados por
 *   generate-device-models.mjs já nascem no tamanho relativo correto uns
 *   aos outros (a própria geometria é escalada pelo tamanho real da tela —
 *   ver o comentário de `modelPath` acima), sem precisar de ajuste aqui.
 *   Só volta a ser necessário se um modelo definitivo (feito fora desse
 *   script) vier numa unidade de modelagem diferente dos demais.
 * - Modelos "Plus/Pro/Max/Mini" foram deixados de fora para manter uma
 *   linha do tempo de uma geração por ano. A exceção é o ciclo 2026: a
 *   Apple não lançou uma variante "padrão" do iPhone 18 (ver highlight do
 *   próprio item), então o iPhone 18 Pro é o representante dessa geração.
 * - Câmeras do iPhone 3G e 3GS: a Apple nunca divulgou a abertura (ƒ) dessas
 *   lentes publicamente — por isso o campo `camera` desses dois itens diz
 *   isso de forma explícita, em vez de inventar um número.
 * - `timelineHighlight`: `true` para o subconjunto de gerações "principais"
 *   exibidas como marcador clicável na navegação da Timeline (uma por ano/
 *   nome redondo — 3G, 4, 5, 6, 7, 8, X, 11...18 Pro). As variantes "S"
 *   (3GS, 4S, 5S, 6S) ficam com `false`: continuam no dataset (specs,
 *   scroll da EvolutionSection) só não viram botão na trilha de navegação,
 *   pra manter a UI legível. Esse é o ÚNICO lugar que precisa ser tocado
 *   pra adicionar/remover um aparelho de qualquer parte da experiência —
 *   Timeline, PhoneInfo, SpecsSection e a cena 3D só leem este array.
 */

// Convenção de caminho pros .glb reais — ver nota sobre `modelPath` no
// comentário do topo do arquivo. Precisa vir antes de `devices` porque é
// chamada dentro do próprio array logo abaixo (senão dá erro de "temporal
// dead zone": usar um `const` antes dele terminar de ser definido).
export const getModelPath = (id) => `/models/${id}.glb`

export const devices = [
  {
    id: 'iphone-3g',
    timelineHighlight: true,
    name: 'iPhone 3G',
    generation: 1,
    year: 2008,
    display: '3,5" LCD, 480×320 px (163 ppi)',
    processor: 'Chip baseado em ARM11 (Samsung), 412 MHz',
    camera: '2MP traseira — abertura não divulgada oficialmente pela Apple',
    weight: '133 g',
    thickness: '12,3 mm',
    colors: ['Preto', 'Branco'],
    highlights: [
      'Primeiro iPhone com suporte a redes 3G/UMTS e GPS',
      'Lançado junto com a App Store (iPhone OS 2.0)',
    ],
    modelPath: getModelPath('iphone-3g'),
    modelScale: 1,
  },
  {
    id: 'iphone-3gs',
    timelineHighlight: false,
    name: 'iPhone 3GS',
    generation: 2,
    year: 2009,
    display: '3,5" LCD, 480×320 px',
    processor: 'Samsung S5PC100 (ARM Cortex-A8), 600 MHz',
    camera: '3MP traseira com autofoco, vídeo VGA — abertura não divulgada oficialmente pela Apple',
    weight: '135 g',
    thickness: '12,3 mm',
    colors: ['Preto', 'Branco'],
    highlights: [
      'Primeiro iPhone com gravação de vídeo',
      'Introduziu bússola digital e o Controle por Voz',
    ],
    modelPath: getModelPath('iphone-3gs'),
    modelScale: 1,
  },
  {
    id: 'iphone-4',
    timelineHighlight: true,
    name: 'iPhone 4',
    generation: 3,
    year: 2010,
    display: '3,5" Retina (IPS LCD), 960×640 px, 326 ppi',
    processor: 'Apple A4',
    camera: '5MP traseira, ƒ/2.8',
    weight: '137 g',
    thickness: '9,3 mm',
    colors: ['Preto', 'Branco (chegou em abril de 2011)'],
    highlights: [
      'Primeiro iPhone com tela "Retina"',
      'Primeiro com câmera frontal (FaceTime) e giroscópio',
    ],
    modelPath: getModelPath('iphone-4'),
    modelScale: 1,
  },
  {
    id: 'iphone-4s',
    timelineHighlight: false,
    name: 'iPhone 4S',
    generation: 4,
    year: 2011,
    display: '3,5" Retina (IPS LCD), 960×640 px',
    processor: 'Apple A5 (dual-core)',
    camera: '8MP traseira, ƒ/2.4, vídeo 1080p',
    weight: '140 g',
    thickness: '9,3 mm',
    colors: ['Preto', 'Branco'],
    highlights: [
      'Introduziu a Siri',
      'Último iPhone com conector dock de 30 pinos',
    ],
    modelPath: getModelPath('iphone-4s'),
    modelScale: 1,
  },
  {
    id: 'iphone-5',
    timelineHighlight: true,
    name: 'iPhone 5',
    generation: 5,
    year: 2012,
    display: '4" Retina (IPS LCD)',
    processor: 'Apple A6',
    camera: '8MP traseira, ƒ/2.4',
    weight: '112 g',
    thickness: '7,6 mm',
    colors: ['Preto e Ardósia', 'Branco e Prata'],
    highlights: [
      'Introduziu o conector Lightning, substituindo o dock de 30 pinos',
      'Primeiro iPhone com LTE e nano-SIM',
    ],
    modelPath: getModelPath('iphone-5'),
    modelScale: 1,
  },
  {
    id: 'iphone-5s',
    timelineHighlight: false,
    name: 'iPhone 5S',
    generation: 6,
    year: 2013,
    display: '4" Retina (IPS LCD), 326 ppi',
    processor: 'Apple A7 (primeiro chip de 64 bits em um smartphone)',
    camera: '8MP traseira, ƒ/2.2',
    weight: '112 g',
    thickness: '7,6 mm',
    colors: ['Cinza-espacial', 'Prata', 'Dourado'],
    highlights: [
      'Primeiro iPhone com Touch ID',
      'Primeiro processador de 64 bits do mercado mobile',
    ],
    modelPath: getModelPath('iphone-5s'),
    modelScale: 1,
  },
  {
    id: 'iphone-6',
    timelineHighlight: true,
    name: 'iPhone 6',
    generation: 7,
    year: 2014,
    display: '4,7" Retina HD (IPS LCD), 1334×750 px',
    processor: 'Apple A8',
    camera: '8MP traseira, ƒ/2.2',
    weight: '129 g',
    thickness: '6,9 mm',
    colors: ['Cinza-espacial', 'Prata', 'Dourado'],
    highlights: [
      'Introduziu NFC e Apple Pay na linha padrão',
      'Adicionou barômetro',
    ],
    modelPath: getModelPath('iphone-6'),
    modelScale: 1,
  },
  {
    id: 'iphone-6s',
    timelineHighlight: false,
    name: 'iPhone 6S',
    generation: 8,
    year: 2015,
    display: '4,7" Retina HD (IPS LCD)',
    processor: 'Apple A9',
    camera: '12MP traseira, ƒ/2.2',
    weight: '143 g',
    thickness: '7,1 mm',
    colors: ['Cinza-espacial', 'Prata', 'Dourado', 'Ouro rosa'],
    highlights: [
      'Primeiro iPhone com gravação de vídeo em 4K',
      'Introduziu o 3D Touch',
    ],
    modelPath: getModelPath('iphone-6s'),
    modelScale: 1,
  },
  {
    id: 'iphone-7',
    timelineHighlight: true,
    name: 'iPhone 7',
    generation: 9,
    year: 2016,
    display: '4,7" Retina HD (IPS LCD)',
    processor: 'Apple A10 Fusion',
    camera: '12MP traseira, ƒ/1.8',
    weight: '138 g',
    thickness: '7,1 mm',
    colors: ['Preto brilhante', 'Preto', 'Prata', 'Dourado', 'Ouro rosa', '(Product)RED (adicionado em 2017)'],
    highlights: [
      'Primeiro iPhone oficialmente resistente à água e poeira (IP67)',
      'Removeu a entrada de fone de ouvido de 3,5 mm',
    ],
    modelPath: getModelPath('iphone-7'),
    modelScale: 1,
  },
  {
    id: 'iphone-8',
    timelineHighlight: true,
    name: 'iPhone 8',
    generation: 10,
    year: 2017,
    display: '4,7" Retina HD (IPS LCD)',
    processor: 'Apple A11 Bionic',
    camera: '12MP traseira, ƒ/1.8',
    weight: '148 g',
    thickness: '7,3 mm',
    colors: ['Cinza-espacial', 'Prata', 'Dourado', '(Product)RED (adicionado em abril de 2018)'],
    highlights: [
      'Traseira de vidro viabilizou carregamento sem fio (Qi) pela primeira vez na linha padrão',
    ],
    modelPath: getModelPath('iphone-8'),
    modelScale: 1,
  },
  {
    id: 'iphone-x',
    timelineHighlight: true,
    name: 'iPhone X',
    generation: 11,
    year: 2017,
    display: '5,8" Super Retina HD OLED — primeira tela OLED da linha',
    processor: 'Apple A11 Bionic',
    camera: 'Dupla 12MP — grande angular ƒ/1.8 + teleobjetiva ƒ/2.4',
    weight: '174 g',
    thickness: '7,7 mm',
    colors: ['Prata', 'Cinza-espacial'],
    highlights: [
      'Primeiro iPhone com Face ID e sem botão Home',
      'Primeira tela OLED usada em um iPhone',
    ],
    modelPath: getModelPath('iphone-x'),
    modelScale: 1,
  },
  {
    id: 'iphone-11',
    timelineHighlight: true,
    name: 'iPhone 11',
    generation: 12,
    year: 2019,
    display: '6,1" Liquid Retina (IPS LCD), 1792×828 px',
    processor: 'Apple A13 Bionic',
    camera: 'Dupla 12MP — grande angular ƒ/1.8 + ultra grande angular ƒ/2.4',
    weight: '194 g',
    thickness: '8,3 mm',
    colors: ['Roxo', 'Amarelo', 'Verde', 'Preto', 'Branco', '(Product)RED'],
    highlights: [
      'Introduziu o Modo Noturno',
      'Primeira câmera ultra grande angular dupla na linha padrão',
    ],
    modelPath: getModelPath('iphone-11'),
    modelScale: 1,
  },
  {
    id: 'iphone-12',
    timelineHighlight: true,
    name: 'iPhone 12',
    generation: 13,
    year: 2020,
    display: '6,1" Super Retina XDR OLED, 2532×1170 px',
    processor: 'Apple A14 Bionic',
    camera: 'Dupla 12MP — grande angular ƒ/1.6 + ultra grande angular ƒ/2.4',
    weight: '162 g',
    thickness: '7,4 mm',
    colors: ['Preto', 'Branco', '(Product)RED', 'Verde', 'Azul', 'Roxo (adicionado em abril de 2021)'],
    highlights: [
      'Primeiro iPhone padrão com tela OLED e conectividade 5G',
      'Introduziu o sistema magnético MagSafe',
    ],
    modelPath: getModelPath('iphone-12'),
    modelScale: 1,
  },
  {
    id: 'iphone-13',
    timelineHighlight: true,
    name: 'iPhone 13',
    generation: 14,
    year: 2021,
    display: '6,1" Super Retina XDR OLED',
    processor: 'Apple A15 Bionic',
    camera: 'Dupla 12MP — grande angular ƒ/1.6 + ultra grande angular ƒ/2.4',
    weight: '174 g',
    thickness: '7,65 mm',
    colors: ['Meia-noite', 'Estelar', '(Product)RED', 'Azul', 'Rosa', 'Verde (adicionado em março de 2022)'],
    highlights: [
      'Introduziu o Modo Cinema',
      'Estabilização de imagem por deslocamento de sensor chegou ao modelo padrão',
    ],
    modelPath: getModelPath('iphone-13'),
    modelScale: 1,
  },
  {
    id: 'iphone-14',
    timelineHighlight: true,
    name: 'iPhone 14',
    generation: 15,
    year: 2022,
    display: '6,1" Super Retina XDR OLED',
    processor: 'Apple A15 Bionic',
    camera: 'Dupla 12MP — grande angular ƒ/1.5 + ultra grande angular ƒ/2.4',
    weight: '172 g',
    thickness: '7,8 mm',
    colors: ['Azul', 'Meia-noite', '(Product)RED', 'Estelar', 'Roxo', 'Amarelo (adicionado em março de 2023)'],
    highlights: [
      'Primeiro iPhone padrão desde o 3G a reaproveitar o chip do ano anterior',
      'Introduziu SOS via satélite e detecção de colisão',
    ],
    modelPath: getModelPath('iphone-14'),
    modelScale: 1,
  },
  {
    id: 'iphone-15',
    timelineHighlight: true,
    name: 'iPhone 15',
    generation: 16,
    year: 2023,
    display: '6,1" Super Retina XDR OLED',
    processor: 'Apple A16 Bionic',
    camera: '48MP principal ƒ/1.6 + 12MP ultra grande angular ƒ/2.4',
    weight: '171 g',
    thickness: '7,8 mm',
    colors: ['Azul', 'Rosa', 'Amarelo', 'Verde', 'Preto'],
    highlights: [
      'Primeiros iPhones com USB-C, substituindo o Lightning',
      'A Dynamic Island chegou ao modelo padrão',
    ],
    modelPath: getModelPath('iphone-15'),
    modelScale: 1,
  },
  {
    id: 'iphone-16',
    timelineHighlight: true,
    name: 'iPhone 16',
    generation: 17,
    year: 2024,
    display: '6,1" Super Retina XDR OLED, 2556×1179 px',
    processor: 'Apple A18',
    camera: '48MP principal ƒ/1.6 + 12MP ultra grande angular ƒ/2.2',
    weight: '170 g',
    thickness: '7,8 mm',
    colors: ['Ultramarine', 'Teal', 'Rosa', 'Branco', 'Preto'],
    highlights: [
      'Primeiro iPhone padrão com o botão Action e o novo botão Camera Control',
    ],
    modelPath: getModelPath('iphone-16'),
    modelScale: 1,
  },
  {
    id: 'iphone-17',
    timelineHighlight: true,
    name: 'iPhone 17',
    generation: 18,
    year: 2025,
    display: '6,3" Super Retina XDR OLED LTPO, 2622×1206 px, 120 Hz',
    processor: 'Apple A19',
    camera: '48MP principal ƒ/1.6 + 48MP ultra grande angular ƒ/2.2',
    weight: '177 g',
    thickness: '7,95 mm',
    colors: ['Lavanda', 'Sage', 'Azul-névoa', 'Branco', 'Preto'],
    highlights: [
      'Primeiro iPhone padrão com tela ProMotion de 120Hz',
      'Armazenamento inicial passou de 128GB para 256GB',
    ],
    modelPath: getModelPath('iphone-17'),
    modelScale: 1,
  },
  {
    id: 'iphone-18-pro',
    timelineHighlight: true,
    name: 'iPhone 18 Pro',
    generation: 19,
    year: 2026,
    display: '6,3" Super Retina XDR OLED (tela cheia)',
    processor: 'Apple A20 Pro',
    camera: 'Tripla 48MP — principal com abertura variável (ƒ/1.48–ƒ/4.0) + ultra grande angular ƒ/2.2 + teleobjetiva 4x (100mm) ƒ/2.8',
    weight: '211 g',
    thickness: '8,75 mm',
    colors: ['Preto', 'Prata', 'Glacier', 'Bordô'],
    highlights: [
      'Neste ciclo a Apple não lançou uma variante "padrão": o iPhone 18 Pro é o modelo de entrada da linha 2026, ao lado do iPhone Duo dobrável',
      'Primeira câmera principal da linha com abertura variável',
    ],
    modelPath: getModelPath('iphone-18-pro'),
    modelScale: 1,
  },
]

export const getDeviceById = (id) => devices.find((device) => device.id === id)
