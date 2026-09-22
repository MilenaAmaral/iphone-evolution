import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import RealIphonesSection from './components/sections/RealIphonesSection'
import CompareSection from './components/sections/CompareSection'
import './App.css'

/**
 * A experiência principal tem três movimentos: abertura, timeline com
 * um único viewer 3D sob demanda e comparação final entre os extremos.
 * As gerações intermediárias alteram dados e narrativa, não carregam GLBs.
 */
function App() {
  // Recalcula todos os ScrollTriggers uma vez, depois que o layout inicial
  // termina de se estabilizar (fontes prontas + um frame de folga pro
  // React/CSS aplicarem tudo). Sem isso, posições de início/fim de
  // trigger calculadas cedo demais podem ficar erradas caso algo mude o
  // layout depois (hoje o risco é pequeno, já que a tipografia usa fontes
  // do sistema sem carregamento assíncrono — mas vira relevante assim que
  // os modelos 3D reais entrarem, cujo carregamento não afeta o fluxo do
  // documento mas pode disparar um reflow em navegadores mais lentos).
  useEffect(() => {
    let cancelled = false

    document.fonts?.ready
      ?.then(() => {
        if (cancelled) return
        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="app">
      <Navigation />
      <main className="app__content">
        <Hero />
        <RealIphonesSection />
        <CompareSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
