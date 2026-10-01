import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import FeaturedIphoneSection from './components/sections/FeaturedIphoneSection'
import LatestLaunchSection from './components/sections/LatestLaunchSection'
import { iphoneProduct } from './data/appleProducts'
import './App.css'

function App() {
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
        <FeaturedIphoneSection
          id="evolucao"
          eyebrow="O começo / 2007"
          title="O primeiro gesto."
          description="O iPhone original condensou telefone, música e internet em uma superfície que redefiniu a relação com a tecnologia."
          product={iphoneProduct.first}
        />
        <LatestLaunchSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
