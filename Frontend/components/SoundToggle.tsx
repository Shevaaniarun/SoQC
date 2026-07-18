import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem('soqc-sound-enabled')
    if (stored === 'true') {
      setEnabled(true)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('soqc-sound-enabled', String(enabled))

    if (!enabled) {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch {
          // ignore
        }
      })
      oscillatorsRef.current = []
      audioContextRef.current?.close()
      audioContextRef.current = null
      masterGainRef.current = null
      return
    }

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    const context = new AudioCtx()
    const masterGain = context.createGain()
    masterGain.gain.value = 0.03
    masterGain.connect(context.destination)

    const createOsc = (freq: number, type: OscillatorType) => {
      const osc = context.createOscillator()
      osc.type = type
      osc.frequency.setValueAtTime(freq, context.currentTime)
      const gain = context.createGain()
      gain.gain.value = 0.0005
      osc.connect(gain)
      gain.connect(masterGain)
      osc.start()
      return { osc, gain }
    }

    const base = createOsc(174, 'sine')
    const shimmer = createOsc(220, 'triangle')
    const sub = createOsc(87, 'sawtooth')

    const lfo = context.createOscillator()
    const lfoGain = context.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.08
    lfoGain.gain.value = 15
    lfo.connect(lfoGain)
    lfoGain.connect(base.osc.frequency)
    lfoGain.connect(shimmer.osc.frequency)
    lfo.start()

    oscillatorsRef.current = [base.osc, shimmer.osc, sub.osc, lfo]
    audioContextRef.current = context
    masterGainRef.current = masterGain

    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch {
          // ignore
        }
      })
      oscillatorsRef.current = []
      context.close()
      audioContextRef.current = null
      masterGainRef.current = null
    }
  }, [enabled])

  const toggle = async () => {
    if (!enabled) {
      await audioContextRef.current?.resume()
    }
    setEnabled((prev) => !prev)
  }

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        border: '1px solid rgba(196,181,253,0.2)',
        background: enabled ? 'rgba(124,58,237,0.2)' : 'rgba(7,7,26,0.4)',
        color: enabled ? '#f5ebff' : 'rgba(248,248,255,0.75)',
        borderRadius: 999,
        padding: '8px 12px',
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        backdropFilter: 'blur(16px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
      aria-label={enabled ? 'Disable ambient sound' : 'Enable ambient sound'}
    >
      <span>{enabled ? '♪' : '♩'}</span>
      <span>{enabled ? 'Sound on' : 'Sound off'}</span>
    </motion.button>
  )
}
