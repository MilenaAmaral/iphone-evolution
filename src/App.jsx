import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import EvolutionSection from './components/sections/EvolutionSection'
import SpecsSection from './components/sections/SpecsSection'
import './App.css'

/**
 * App: monta o layout raiz. O <PhoneViewer> agora é um componente
 * autocontido, dimensionado pelo próprio container que o usa (ver
 * PhoneViewer.css) — por isso ele mora dentro de EvolutionSection, junto
 * com a Timeline e o PhoneInfo do aparelho ativo, em vez de ficar fixo
 * atrás da página inteira.
 */
function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="app__content">
        <Hero />
        <EvolutionSection />
        <SpecsSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
