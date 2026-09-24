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

const appleWatchFirst = {
  name: 'Apple Watch',
  year: 2015,
  modelPath: '/models/apple_watch_2015.glb',
  category: 'Apple Watch',
  type: '3d',
}

const appleWatchLatest = {
  name: 'Apple Watch mais recente',
  year: 2026,
  modelPath: '/models/app_watch_2026.glb',
  category: 'Apple Watch',
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
    first: appleWatchFirst,
    latest: appleWatchLatest,
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