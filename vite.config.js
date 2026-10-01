import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 1400,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]react[\\/]/.test(id) ||
                /[\\/]react-dom[\\/]/.test(id) ||
                /[\\/]scheduler[\\/]/.test(id)) {
              return 'vendor-react'
            }

            if (/[\\/]zustand[\\/]/.test(id)) {
              return 'vendor-state'
            }

            if (/[\\/](three|three-stdlib|@react-three)[\\/]/.test(id)) {
              return 'vendor-three'
            }

            if (/[\\/]gsap[\\/]/.test(id)) {
              return 'vendor-gsap'
            }
          }

          return undefined
        },
      },
    },
  },
})