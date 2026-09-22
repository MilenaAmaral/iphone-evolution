import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './frame-sequence-hero.css'

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

function FrameSequenceHero({
  frameCount,
  framePath,
  eagerCount = 24,
  scrollHeight = '500vh',
  brand,
  navLinks = [],
  ctaLabel,
  ctaHref = '#',
  title,
  subtitle,
  steps,
  className,
}) {
  const spacerRef = useRef(null)
  const cacheRef = useRef([])
  const loadedRef = useRef(0)
  const targetFrameRef = useRef(0)
  const displayFrameRef = useRef(0)
  const lastShownRef = useRef(-1)
  const rafRef = useRef(null)
  const [loadPct, setLoadPct] = useState(0)
  const [loaderDone, setLoaderDone] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [subtitleHidden, setSubtitleHidden] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [currentSrc, setCurrentSrc] = useState(() => framePath(1))

  useEffect(() => {
    let disposed = false
    const eager = Math.min(Math.max(1, eagerCount), frameCount)

    const loadFrame = (index) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = framePath(index + 1)
      image.onload = image.onerror = () => {
        if (disposed) return
        loadedRef.current += 1
        setLoadPct(Math.round((loadedRef.current / frameCount) * 100))
        if (loadedRef.current === eager) {
          setLoaderDone(true)
          for (let next = eager; next < frameCount; next += 1) loadFrame(next)
        }
      }
      cacheRef.current[index] = image
    }

    for (let index = 0; index < eager; index += 1) loadFrame(index)
    return () => {
      disposed = true
      cacheRef.current = []
    }
  }, [eagerCount, frameCount, framePath])

  useEffect(() => {
    const showFrame = (index) => {
      if (index === lastShownRef.current) return
      setCurrentSrc(framePath(index + 1))
      lastShownRef.current = index
    }

    const tick = () => {
      const difference = targetFrameRef.current - displayFrameRef.current
      if (Math.abs(difference) < 0.08) displayFrameRef.current = targetFrameRef.current
      else displayFrameRef.current += difference * 0.28

      const index = Math.max(0, Math.min(frameCount - 1, Math.round(displayFrameRef.current)))
      showFrame(index)

      if (displayFrameRef.current !== targetFrameRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    const onScroll = () => {
      const spacer = spacerRef.current
      if (!spacer) return
      const total = spacer.offsetHeight - window.innerHeight
      const nextProgress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, total)))
      targetFrameRef.current = nextProgress * (frameCount - 1)
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)

      setProgress(nextProgress)
      setNavScrolled(window.scrollY > 4)
      setSubtitleHidden(window.scrollY > 8)

      let nextActiveIndex = -1
      let nextStepProgress = 0
      steps.forEach((step, index) => {
        if (nextActiveIndex !== -1 || nextProgress < step.from || nextProgress >= step.to) return
        nextActiveIndex = index
        nextStepProgress = (nextProgress - step.from) / (step.to - step.from)
      })
      setActiveIndex(nextActiveIndex)
      setStepProgress(Math.max(0, Math.min(1, nextStepProgress)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [frameCount, framePath, steps])

  return (
    <div className={joinClasses('frame-sequence-hero', className)}>
      <div aria-hidden className={joinClasses('frame-sequence-hero__loader', loaderDone && 'is-done')}>
        <span>{loadPct < 100 ? `Carregando · ${loadPct}%` : 'Pronto'}</span>
        <span className="frame-sequence-hero__loader-track">
          <span className="frame-sequence-hero__loader-fill" style={{ width: `${loadPct}%` }} />
        </span>
      </div>

      <nav className={joinClasses('frame-sequence-hero__nav', navScrolled && 'is-scrolled')}>
        <div className="frame-sequence-hero__brand">{brand}</div>
        {navLinks.length > 0 && (
          <div className="frame-sequence-hero__links">
            {navLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          </div>
        )}
        {ctaLabel && <a className="frame-sequence-hero__cta" href={ctaHref}>{ctaLabel}</a>}
      </nav>

      <div className="frame-sequence-hero__stage">
        <div className="frame-sequence-hero__canvas-wrap">
          <img src={currentSrc} alt="" className="frame-sequence-hero__canvas" draggable={false} />
        </div>
        <div className="frame-sequence-hero__copy">
          <h1>{title}</h1>
          {subtitle && <p className={subtitleHidden ? 'is-hidden' : ''}>{subtitle}</p>}
        </div>
        <div className="frame-sequence-hero__cards">
          {steps.map((step, index) => {
            const active = activeIndex === index
            const previous = activeIndex >= 0 && index < activeIndex
            return (
              <article
                key={`${step.num}-${step.title}`}
                className={joinClasses('frame-sequence-hero__card', active && 'is-active', previous && 'is-previous')}
                style={{ '--card-color': step.color }}
              >
                <div className="frame-sequence-hero__card-inner">
                  <div className="frame-sequence-hero__card-head">
                    <span><strong>{step.num}</strong> / {step.total}</span>
                    <span aria-hidden>{step.icon || '✦'}</span>
                  </div>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                  <div className="frame-sequence-hero__card-foot">
                    <div className="frame-sequence-hero__ticks">
                      {steps.map((_, tickIndex) => {
                        const done = tickIndex < activeIndex
                        const current = tickIndex === activeIndex
                        return <i key={tickIndex}><span style={{ transform: `scaleX(${done ? 1 : current ? stepProgress : 0})` }} /></i>
                      })}
                    </div>
                    <span>{step.label}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <div className="frame-sequence-hero__progress"><span style={{ width: `${progress * 100}%` }} /></div>
      </div>
      <div ref={spacerRef} className="frame-sequence-hero__spacer" style={{ height: scrollHeight }} />
    </div>
  )
}

FrameSequenceHero.propTypes = {
  frameCount: PropTypes.number.isRequired,
  framePath: PropTypes.func.isRequired,
  eagerCount: PropTypes.number,
  scrollHeight: PropTypes.string,
  brand: PropTypes.node,
  navLinks: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })),
  ctaLabel: PropTypes.string,
  ctaHref: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.shape({
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    num: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  className: PropTypes.string,
}

export default FrameSequenceHero