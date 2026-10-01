/**
 * appleProducts.js
 *
 * Os dois iPhones exibidos com modelo 3D na página: o primeiro (2007) e
 * o último lançamento (iPhone Duo).
 *
 * Especificações conferidas nas fontes oficiais da Apple (páginas de
 * especificações técnicas e Newsroom), consultadas em 29/09/2026:
 * - https://www.apple.com/iphone-duo/specs/
 * - https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/
 *
 * Regra do projeto: `specs` só recebe dado oficialmente confirmado.
 * O que a Apple não divulga fica em `notDisclosed` (exibido separado na
 * interface) e nunca é preenchido com rumor ou estimativa.
 */

const phoneViewer = { targetSize: 1.15, cameraFov: 30, cameraPosition: [1.35, 0.7, 3.2] }

const iphoneFirst = {
  name: 'iPhone (1ª geração)',
  year: 2007,
  modelPath: '/models/iphone_1st_generation.glb',
  category: 'iPhone',
  type: '3d',
  viewer: phoneViewer,
  specsTitle: 'Especificações originais',
  specs: [
    { label: 'Nome', value: 'iPhone (1ª geração)' },
    { label: 'Ano', value: '2007' },
    { label: 'Tela', value: '3,5 polegadas, 320 × 480 pixels' },
    { label: 'Câmera traseira', value: '2 MP' },
    { label: 'Armazenamento', value: '4 GB e 8 GB no lançamento; posteriormente 16 GB' },
    { label: 'Processador', value: 'Samsung ARM 11, 412 MHz' },
    { label: 'Sistema operacional', value: 'iPhone OS' },
    { label: 'Conectividade', value: '2G/EDGE, Wi-Fi e Bluetooth' },
    { label: 'Conector', value: '30 pinos' },
    { label: 'Peso', value: 'Aproximadamente 135 g' },
  ],
}

const iphoneDuo = {
  name: 'iPhone Duo',
  year: 2026,
  modelPath: '/models/apple_iphone_duo.glb',
  category: 'iPhone',
  type: '3d',
  viewer: phoneViewer,
  status: 'Produto oficial da Apple',
  announced: 'Anunciado em setembro de 2026',
  availability: 'Pré-venda em 16/10/2026 e disponibilidade a partir de 23/10/2026',
  specs: [
    { label: 'Nome', value: 'iPhone Duo' },
    {
      label: 'Design',
      value: 'Dobrável em titânio, frente em Ceramic Shield 2 e verso em Ceramic Shield, IP68. Cores: Night Sky e Star White',
    },
    {
      label: 'Tela',
      value: 'Tela externa de 5,4" e interna de 7,6", ambas Super Retina XDR com ProMotion',
    },
    {
      label: 'Câmeras',
      value: 'Principal Fusion de 48 MP, Ultra-angular Fusion de 48 MP, câmera frontal Center Stage e câmera FaceTime sob a tela interna',
    },
    { label: 'Processador', value: 'A20 Pro (CPU de 6 núcleos, GPU de 7 núcleos)' },
    { label: 'Armazenamento', value: '256 GB, 512 GB, 1 TB e 2 TB' },
    {
      label: 'Bateria',
      value: 'Bateria dupla. Até 24 h de uso típico; vídeo até 44 h (tela externa) e 31 h (tela interna); 50% em cerca de 20 min com adaptador de 60 W',
    },
    { label: 'Sistema operacional', value: 'iOS 27.1' },
    {
      label: 'Recursos principais',
      value: 'Split View (duas apps lado a lado, pela primeira vez no iPhone), chip N1 com Wi-Fi 7 e Bluetooth 6, modem C2, somente eSIM, USB-C',
    },
    { label: 'Preço inicial', value: 'US$ 1.999 (256 GB)' },
  ],
  notDisclosed: ['Capacidade da bateria (mAh)', 'Memória RAM'],
}

export const iphoneProduct = { first: iphoneFirst, duo: iphoneDuo }

export default iphoneProduct
