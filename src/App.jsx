import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import EvolutionSection from './components/sections/EvolutionSection'
import SpecsSection from './components/sections/SpecsSection'
import PhoneViewer from './components/phone/PhoneViewer'
import './App.css'

/**
 * App: monta o layout raiz. O <PhoneViewer> (Canvas 3D) é renderizado uma
 * única vez aqui e fica fixo atrás de todo o conteúdo — as seções DOM
 * (Hero, EvolutionSection, SpecsSection) rolam por cima dele. Isso é o
 * padrão "canvas persistente atrás do scroll" descrito no doc de
 * arquitetura, e é por isso que PhoneViewer não vive dentro de nenhuma
 * seção específica.
 */
function App() {
  return (
    <div className="app">
      <PhoneViewer />
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
