export const realDeviceAssets = [
  { id: 'iphone-original', modelPath: '/models/iphone-original.glb', image: '/images/iphone-original.webp' },
  { id: 'iphone-3g', modelPath: '/models/iphone-3g.glb', image: '/images/iphone-3g.webp' },
  { id: 'iphone-3gs', modelPath: '/models/iphone-3gs.glb', image: '/images/iphone-3gs.webp' },
  { id: 'iphone-4', modelPath: '/models/iphone-4.glb', image: '/images/iphone-4.webp' },
  { id: 'iphone-4s', modelPath: '/models/iphone-4s.glb', image: '/images/iphone-4s.webp' },
  { id: 'iphone-5', modelPath: '/models/iphone-5.glb', image: '/images/iphone-5.webp' },
  { id: 'iphone-5s', modelPath: '/models/iphone-5s.glb', image: '/images/iphone-5s.webp' },
  { id: 'iphone-6', modelPath: '/models/iphone-6.glb', image: '/images/iphone-6.webp' },
  { id: 'iphone-6s', modelPath: '/models/iphone-6s.glb', image: '/images/iphone-6s.webp' },
  { id: 'iphone-7', modelPath: '/models/iphone-7.glb', image: '/images/iphone-7.webp' },
  { id: 'iphone-8', modelPath: '/models/iphone-8.glb', image: '/images/iphone-8.webp' },
  { id: 'iphone-x', modelPath: '/models/iphone-x.glb', image: '/images/iphone-x.webp' },
  { id: 'iphone-11', modelPath: '/models/iphone-11.glb', image: '/images/iphone-11.webp' },
  { id: 'iphone-12', modelPath: '/models/iphone-12.glb', image: '/images/iphone-12.webp' },
  { id: 'iphone-13', modelPath: '/models/iphone-13.glb', image: '/images/iphone-13.webp' },
  { id: 'iphone-14', modelPath: '/models/iphone-14.glb', image: '/images/iphone-14.webp' },
  { id: 'iphone-15', modelPath: '/models/iphone-15.glb', image: '/images/iphone-15.webp' },
  { id: 'iphone-16', modelPath: '/models/iphone-16.glb', image: '/images/iphone-16.webp' },
  { id: 'iphone-17', modelPath: '/models/iphone-17.glb', image: '/images/iphone-17.webp' },
  { id: 'iphone-18-pro', modelPath: '/models/iphone-18-pro.glb', image: '/images/iphone-18-pro.webp' },
]

export function resolveDeviceAsset(deviceId) {
  return realDeviceAssets.find((asset) => asset.id === deviceId) ?? null
}
