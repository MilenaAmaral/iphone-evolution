import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import OriginSection from './components/sections/OriginSection'
import EvolutionSection from './components/sections/EvolutionSection'
import BigChangesSection from './components/sections/BigChangesSection'
import CamerasSection from './components/sections/CamerasSection'
import PerformanceSection from './components/sections/PerformanceSection'
import DesignSection from './components/sections/DesignSection'
import CurrentSection from './components/sections/CurrentSection'
import SpecsSection from './components/sections/SpecsSection'
import './App.css'

/**
 * App: monta o layout raiz como uma sequência narrativa de 8 capítulos —
 * cada seção é um componente próprio, na ordem em que a história é
 * contada (ver o comentário de cada arquivo em src/components/sections
 * pra entender de onde vêm os dados de cada capítulo):
 *
 *   1. Hero            — abertura
 *   2. OriginSection    — ORIGEM (primeiro modelo)
 *   3. EvolutionSection — EVOLUÇÃO (scroll pinado, troca de modelo 3D)
 *   4. BigChangesSection — GRANDES MUDANÇAS (marcos de design)
 *   5. CamerasSection    — CÂMERAS
 *   6. PerformanceSection — PERFORMANCE (processadores)
 *   7. DesignSection     — DESIGN (espessura, peso, tela, materiais)
 *   8. CurrentSection    — ATUALIDADE (geração mais recente)
 *
 * `SpecsSection` continua depois, como um apêndice técnico — a ficha
 * completa do aparelho ativo em EvolutionSection, pra quem quiser
 * consultar os números sem voltar a rolar a história inteira.
 *
 * O <PhoneViewer> é um componente autocontido, dimensionado pelo próprio
 * container que o usa (ver PhoneViewer.css) — por isso cada capítulo que
 * precisa dele (Origem, Evolução, Atualidade) só o instancia dentro de si,
 * em vez de um único viewer fixo atrás da página inteira.
 */
function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="app__content">
        <Hero />
        <OriginSection />
        <EvolutionSection />
        <BigChangesSection />
        <CamerasSection />
        <PerformanceSection />
        <DesignSection />
        <CurrentSection />
        <SpecsSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
