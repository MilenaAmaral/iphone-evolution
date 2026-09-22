import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useDragSlider — estado + handlers de um slider horizontal "de arrastar",
 * expresso como uma porcentagem (0–100) da largura de um elemento de
 * referência (`trackRef`). Não sabe nada sobre o que a porcentagem
 * significa visualmente (isso é responsabilidade de quem usa o hook, ex.:
 * CompareSection) — só resolve a parte genérica de "converter posição do
 * ponteiro em valor" de forma reutilizável.
 *
 * Usa Pointer Events (não mouse/touch separados): um único conjunto de
 * handlers cobre mouse, caneta e toque, e `setPointerCapture` garante que
 * o arrasto continue sendo recebido mesmo se o ponteiro sair da área do
 * elemento no meio do gesto (arrastar rápido demais, por exemplo) — sem
 * isso, o slider "perderia" o drag ao passar o cursor por cima de outro
 * elemento.
 *
 * As atualizações de valor são "throttladas" por `requestAnimationFrame`:
 * um evento `pointermove` pode disparar dezenas de vezes por segundo (bem
 * mais rápido que a tela consegue redesenhar), e cada valor novo aqui
 * dispara um resize de dois <Canvas> R3F em CompareSection — sem o
 * throttle, um mouse de alta taxa de amostragem geraria muito mais
 * atualizações de estado (e redimensionamentos de canvas) por segundo do
 * que qualquer tela consegue mostrar, trabalho puro desperdiçado. Guardar
 * só a ÚLTIMA posição pendente e aplicá-la uma vez por frame resolve isso
 * sem perder suavidade percebida.
 *
 * Suporte a teclado incluso (`handleKeyDown`): setas movem o valor,
 * Shift+seta move mais rápido, Home/End vão para os extremos — essencial
 * pra quem usa o slider sem mouse/toque (ver o `role="slider"` no
 * elemento que consome `handleKeyDown`).
 */
export function useDragSlider({ initial = 50, min = 0, max = 100 } = {}) {
  const [value, setValue] = useState(initial)
  const trackRef = useRef(null)
  const draggingRef = useRef(false)
  const rafRef = useRef(null)
  const pendingClientXRef = useRef(null)

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

  const applyPendingValue = useCallback(() => {
    rafRef.current = null
    const track = trackRef.current
    const clientX = pendingClientXRef.current
    if (!track || clientX === null) return

    const rect = track.getBoundingClientRect()
    const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width
    const next = Math.min(max, Math.max(min, min + ratio * (max - min)))
    setValue(next)
  }, [min, max])

  const scheduleUpdate = useCallback(
    (clientX) => {
      pendingClientXRef.current = clientX
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(applyPendingValue)
      }
    },
    [applyPendingValue]
  )

  const handlePointerDown = useCallback(
    (event) => {
      draggingRef.current = true
      event.currentTarget.setPointerCapture?.(event.pointerId)
      scheduleUpdate(event.clientX)
    },
    [scheduleUpdate]
  )

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return
      scheduleUpdate(event.clientX)
    },
    [scheduleUpdate]
  )

  const handlePointerUp = useCallback((event) => {
    draggingRef.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      const step = event.shiftKey ? 10 : 4
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault()
        setValue((current) => Math.max(min, current - step))
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault()
        setValue((current) => Math.min(max, current + step))
      } else if (event.key === 'Home') {
        event.preventDefault()
        setValue(min)
      } else if (event.key === 'End') {
        event.preventDefault()
        setValue(max)
      }
    },
    [min, max]
  )

  return {
    value,
    setValue,
    trackRef,
    trackHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    handleKeyDown,
  }
}

export default useDragSlider
