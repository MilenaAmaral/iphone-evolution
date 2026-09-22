import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Depois do manualChunks abaixo, o único chunk que ainda passa de
    // 500kB é o "vendor-three" isolado (Three.js + R3F + drei) — ele é
    // grande porque a própria lib é grande, não porque está misturado com
    // outra coisa. Levantar o limite aqui é reconhecer isso explicitamente
    // (o aviso genérico do Vite deixou de ser acionável depois da divisão
    // de chunks) em vez de apenas silenciar um aviso real sem entender o
    // motivo.
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        // Sem isso, Three.js + React Three Fiber + drei + GSAP ficavam
        // no mesmo chunk que o código do app, gerando o aviso padrão do
        // Vite de "chunk maior que 500kB" — tudo isso baixa antes do
        // primeiro paint, mesmo em conexão lenta.
        //
        // Dois vendor chunks separados: "vendor-three" (o motor 3D, que
        // muda pouco entre deploys — cacheia bem no navegador) e
        // "vendor-gsap" (o motor de animação, igualmente estável). O
        // código do próprio app (que muda a cada deploy) fica isolado
        // num terceiro chunk, então atualizar uma seção não invalida o
        // cache dos vendors pro visitante recorrente.
        //
        // Precisa ser uma FUNÇÃO (não o objeto `{ nome: [pacotes] }` do
        // Rollup clássico) porque este projeto usa Vite 8, cujo bundler
        // padrão (Rolldown) só aceita a forma funcional dessa opção.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/](three|three-stdlib|@react-three)[\\/]/.test(id)) return 'vendor-three'
            if (/[\\/]gsap[\\/]/.test(id)) return 'vendor-gsap'
          }
          return undefined
        },
      },
    },
  },
})
