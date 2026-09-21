import { useGLTF } from '@react-three/drei'
import { GLTFLoader } from 'three-stdlib'
import { peek, clear as clearSuspendCache } from 'suspend-react'
import { disposeObject3D } from './disposeObject3D'

/**
 * gltfCache.js
 *
 * Camada fina por cima do cache que `useGLTF`/`useLoader` (R3F) já mantém
 * internamente (via a lib `suspend-react`), pra dar a este projeto duas
 * operações que o drei não expõe prontas:
 *
 * 1) `preloadModel(path)` — já existe como `useGLTF.preload`, só
 *    reexportado aqui com a MESMA configuração de loader usada em
 *    PhoneModel.jsx (ver nota sobre Draco abaixo), pra garantir que quem
 *    pré-carrega e quem efetivamente renderiza usem o mesmo cache.
 * 2) `releaseModel(path)` — não existe em lugar nenhum do drei/fiber.
 *    `useGLTF.clear(path)` só remove a ENTRADA do cache (o mapa
 *    path → promise/resultado); ele não chama `.dispose()` em nada. Sem
 *    isso, rodar a experiência inteira (todas as 19 gerações) numa sessão
 *    só ia empilhando geometria/textura na GPU pra sempre. `releaseModel`
 *    busca o resultado cacheado com `peek` (leitura síncrona, sem
 *    suspender nada), libera seus recursos com `disposeObject3D` e só
 *    DEPOIS limpa a entrada do cache.
 *
 * `peek`/`clear` do `suspend-react` procuram a entrada por um array de
 * chaves — pra `useGLTF`, essa chave é sempre `[GLTFLoader, path]` (ver
 * `useLoader`/`Gltf.js` do drei: é exatamente isso que ele monta por
 * baixo). Replicamos a mesma chave aqui só pra conseguir "espiar" o
 * cache de fora de um componente React — não duplicamos nem reimplementamos
 * o carregamento em si.
 */

// Draco desligado de propósito: o decoder do DRACOLoader é baixado de um
// CDN externo (gstatic.com) na primeira vez que é preciso — mesma classe
// de problema que já pegamos antes com o preset de Environment (CDN
// bloqueado em ambientes com rede restrita). Os modelos desta experiência
// são pensados pra ser leves o bastante sem compressão Draco; se um dia
// for necessário para arquivos maiores, dá pra reativar com
// `useGLTF.setDecoderPath('/draco/')` apontando pra uma cópia local do
// decoder, servida junto com o próprio app.
const USE_DRACO = false

function cacheKey(path) {
  return [GLTFLoader, path]
}

export function preloadModel(path) {
  if (!path) return
  useGLTF.preload(path, USE_DRACO)
}

export function isModelCached(path) {
  return !!path && peek(cacheKey(path)) !== undefined
}

export function releaseModel(path) {
  if (!path) return

  const cached = peek(cacheKey(path))
  if (cached?.scene) {
    disposeObject3D(cached.scene)
  }

  useGLTF.clear(path)
  // `useGLTF.clear` já delega pra `useLoader.clear`, que por sua vez usa a
  // mesma chave `[GLTFLoader, path]` — chamado aqui de novo só por
  // redundância defensiva, sem depender de nenhum detalhe de
  // implementação além do que o drei documenta publicamente
  // (`useGLTF.clear`).
  clearSuspendCache(cacheKey(path))
}

export { USE_DRACO }
