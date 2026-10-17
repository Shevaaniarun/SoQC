import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [position, setPosition] = useState({ x: -999, y: -999 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return position
}
