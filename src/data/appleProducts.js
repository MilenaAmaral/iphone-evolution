const iphoneFirst = {
  name: 'iPhone',
  year: 2007,
  modelPath: '/models/iphone_1st_generation.glb',
  category: 'iPhone',
  type: '3d',
}

const iphoneLatest = {
  name: 'iPhone 18 Pro Max',
  year: 2026,
  modelPath: '/models/iphone-18-pro-max.glb',
  category: 'iPhone',
  type: '3d',
}

const unavailableProduct = (category, name, year) => ({
  name,
  year,
  category,
  type: 'pending',
  modelPath: null,
  status: 'Modelo 3D licenciado pendente',
})

export const appleProducts = [
  { category: 'iPhone', first: iphoneFirst, latest: iphoneLatest },
  {
    category: 'Apple Watch',
    first: unavailableProduct('Apple Watch', 'Apple Watch', 2015),
    latest: unavailableProduct('Apple Watch', 'Apple Watch mais recente', 2026),
  },
  {
    category: 'iPad',
    first: unavailableProduct('iPad', 'iPad', 2010),
    latest: unavailableProduct('iPad', 'iPad mais recente', 2026),
  },
  {
    category: 'MacBook',
    first: unavailableProduct('MacBook', 'MacBook', 2006),
    latest: unavailableProduct('MacBook', 'MacBook mais recente', 2026),
  },
  {
    category: 'AirPods',
    first: unavailableProduct('AirPods', 'AirPods', 2016),
    latest: unavailableProduct('AirPods', 'AirPods mais recentes', 2026),
  },
]

export const iphoneProduct = appleProducts[0]

export default appleProducts