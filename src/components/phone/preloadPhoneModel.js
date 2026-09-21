import { useGLTF } from '@react-three/drei'

// Pré-carregamento antecipado de um modelo (ex.: no hover de um item da
// Timeline, antes do usuário clicar). Fica em arquivo próprio — não em
// PhoneModel.jsx — para que esse arquivo só exporte o componente (fast
// refresh do Vite exige isso). `useGLTF.preload` não é hook: pode ser
// chamado fora de render.
export function preloadPhoneModel(modelPath) {
  if (modelPath) useGLTF.preload(modelPath)
}
