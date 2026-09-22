import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Side-effect only: registra os plugins do GSAP e aplica a configuração
// global do ScrollTrigger antes de qualquer componente montar (ver
// gsapSetup.js pro porquê disso morar num só lugar).
import './animations/gsapSetup.js'
import App from './App.jsx'
import AppErrorBoundary from './components/layout/AppErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
