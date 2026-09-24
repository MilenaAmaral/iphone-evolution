import { devices } from './devices'

const deviceById = (id) => devices.find((device) => device.id === id)

const original = deviceById('iphone-original')
const iphone3g = deviceById('iphone-3g')
const iphone4 = deviceById('iphone-4')
const iphone5 = deviceById('iphone-5')
const iphone18 = deviceById('iphone-18-pro')

export const realIphones = [
  {
    id: 'iphone-original-real',
    modelPath: '/models/iphone_1st_generation.glb',
    name: 'iPhone',
    year: 2007,
    description: 'O primeiro iPhone marcou a entrada da Apple no mercado de smartphones.',
    highlights: original.highlights,
    specs: { display: original.display, camera: original.camera, processor: original.processor, weight: original.weight, dimensions: `${original.thickness} de espessura` },
  },
  {
    id: 'iphone-3g-real',
    modelPath: '/models/iphone-3G.glb',
    name: 'iPhone 3G',
    year: 2008,
    description: 'A segunda geração trouxe conectividade 3G, GPS e a chegada da App Store.',
    highlights: iphone3g.highlights,
    specs: { display: iphone3g.display, camera: iphone3g.camera, processor: iphone3g.processor, weight: iphone3g.weight, dimensions: `${iphone3g.thickness} de espessura` },
  },
  {
    id: 'iphone-4-real',
    modelPath: '/models/iphone_4.glb',
    name: 'iPhone 4',
    year: 2010,
    description: 'Vidro, aço inoxidável e a tela Retina definiram uma nova linguagem de design.',
    highlights: iphone4.highlights,
    specs: { display: iphone4.display, camera: iphone4.camera, processor: iphone4.processor, weight: iphone4.weight, dimensions: `${iphone4.thickness} de espessura` },
  },
  {
    id: 'iphone-5-real',
    modelPath: '/models/iphone_5.glb',
    name: 'iPhone 5',
    year: 2012,
    description: 'Mais fino e leve, o iPhone 5 introduziu a tela de 4 polegadas e o conector Lightning.',
    highlights: iphone5.highlights,
    specs: { display: iphone5.display, camera: iphone5.camera, processor: iphone5.processor, weight: iphone5.weight, dimensions: `${iphone5.thickness} de espessura` },
  },
  {
    id: 'iphone-18-pro-max-real',
    modelPath: '/models/iphone_18_pro_max.glb',
    name: 'iPhone 18 Pro Max',
    year: iphone18.year,
    description: 'O modelo mais recente disponível nesta coleção, com foco em câmera, tela e desempenho.',
    highlights: iphone18.highlights,
    specs: { display: iphone18.display, camera: iphone18.camera, processor: iphone18.processor, weight: iphone18.weight, dimensions: `${iphone18.thickness} de espessura` },
  },
]

export default realIphones