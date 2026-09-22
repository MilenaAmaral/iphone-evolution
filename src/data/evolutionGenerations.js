import { devices } from './devices'

const byId = (id) => devices.find((device) => device.id === id)
const firstAvailable = (...ids) => ids.map(byId).find(Boolean)

function fromDevice({ year, name, sourceIds, description, innovation, storage, connectivity }) {
  const source = firstAvailable(...sourceIds)
  return {
    id: `${year}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    year,
    name,
    description,
    innovation,
    storage: storage ?? 'Não disponível no projeto',
    connectivity: connectivity ?? 'Não disponível no projeto',
    source,
    display: source?.display,
    camera: source?.camera,
    processor: source?.processor,
    weight: source?.weight,
    thickness: source?.thickness,
    highlights: source?.highlights ?? [],
  }
}

export const evolutionGenerations = [
  fromDevice({ year: 2007, name: 'iPhone', sourceIds: ['iphone-original'], description: 'The beginning of a new era.', innovation: 'Interface touchscreen com iPod, telefone e internet integrados', storage: '4 GB, 8 GB e 16 GB', connectivity: 'GSM / EDGE' }),
  fromDevice({ year: 2008, name: 'iPhone 3G', sourceIds: ['iphone-3g'], description: 'Conectividade móvel e a App Store ampliaram o alcance do iPhone.', innovation: '3G, GPS e App Store' }),
  fromDevice({ year: 2009, name: 'iPhone 3GS', sourceIds: ['iphone-3gs'], description: 'Mais velocidade e a primeira câmera do iPhone capaz de gravar vídeo.', innovation: 'Vídeo e desempenho' }),
  fromDevice({ year: 2010, name: 'iPhone 4', sourceIds: ['iphone-4'], description: 'Uma nova linguagem visual em vidro e aço chegou com a tela Retina.', innovation: 'Retina Display e FaceTime' }),
  fromDevice({ year: 2011, name: 'iPhone 4S', sourceIds: ['iphone-4s'], description: 'A evolução do iPhone 4 trouxe uma câmera melhor e uma nova forma de interagir.', innovation: 'Siri' }),
  fromDevice({ year: 2012, name: 'iPhone 5', sourceIds: ['iphone-5'], description: 'Mais fino e leve, com tela maior e uma nova conexão.', innovation: 'Lightning e LTE' }),
  fromDevice({ year: 2013, name: 'iPhone 5s', sourceIds: ['iphone-5s'], description: 'Biometria e arquitetura de 64 bits marcaram a geração.', innovation: 'Touch ID e chip de 64 bits' }),
  fromDevice({ year: 2014, name: 'iPhone 6 / 6 Plus', sourceIds: ['iphone-6'], description: 'O iPhone ganhou telas maiores e passou a participar da vida financeira diária.', innovation: 'NFC e Apple Pay' }),
  fromDevice({ year: 2015, name: 'iPhone 6s / 6s Plus', sourceIds: ['iphone-6s'], description: 'Uma geração focada em pressão, câmera e potência.', innovation: '3D Touch e vídeo 4K' }),
  fromDevice({ year: 2016, name: 'iPhone 7 / 7 Plus', sourceIds: ['iphone-7'], description: 'Resistência à água, câmeras duplas e uma mudança controversa no áudio.', innovation: 'IP67 e câmera dupla' }),
  fromDevice({ year: 2017, name: 'iPhone 8 / 8 Plus / X', sourceIds: ['iphone-x', 'iphone-8'], description: 'Vidro, carregamento sem fio e Face ID apontaram para o futuro.', innovation: 'Face ID e tela OLED' }),
  fromDevice({ year: 2018, name: 'iPhone XS / XS Max / XR', sourceIds: [], description: 'A família se expandiu com diferentes tamanhos e posicionamentos.', innovation: null }),
  fromDevice({ year: 2019, name: 'iPhone 11 / 11 Pro / 11 Pro Max', sourceIds: ['iphone-11'], description: 'A fotografia computacional se tornou protagonista.', innovation: 'Modo Noturno e ultra grande angular' }),
  fromDevice({ year: 2020, name: 'iPhone 12 / 12 mini / 12 Pro / 12 Pro Max', sourceIds: ['iphone-12'], description: 'Um novo desenho plano encontrou a velocidade das redes 5G.', innovation: '5G e MagSafe' }),
  fromDevice({ year: 2021, name: 'iPhone 13', sourceIds: ['iphone-13'], description: 'Mais autonomia e cinema no bolso.', innovation: 'Modo Cinema' }),
  fromDevice({ year: 2022, name: 'iPhone 14', sourceIds: ['iphone-14'], description: 'Recursos de segurança passaram a fazer parte da experiência.', innovation: 'SOS via satélite e detecção de colisão' }),
  fromDevice({ year: 2023, name: 'iPhone 15', sourceIds: ['iphone-15'], description: 'USB-C e Dynamic Island chegaram à linha padrão.', innovation: 'USB-C e Dynamic Island' }),
  fromDevice({ year: 2024, name: 'iPhone 16', sourceIds: ['iphone-16'], description: 'Controles dedicados aproximaram a câmera e as ações do usuário.', innovation: 'Camera Control e botão Action' }),
  fromDevice({ year: 2025, name: 'iPhone 17', sourceIds: ['iphone-17'], description: 'ProMotion e mais armazenamento elevaram a experiência padrão.', innovation: 'Tela ProMotion de 120 Hz' }),
  fromDevice({ year: 2026, name: 'iPhone 18 Pro Max', sourceIds: ['iphone-18-pro'], description: '19 years of evolution.', innovation: 'Câmera principal com abertura variável' }),
]

export default evolutionGenerations
