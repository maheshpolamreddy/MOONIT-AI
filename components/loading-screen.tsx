"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket } from "lucide-react"

// Sound effect functions using Web Audio API
const playSound = (type: 'ambient' | 'whoosh' | 'charge' | 'launch') => {
  if (typeof window === 'undefined') return

  try {
    console.log(`🔊 Attempting to play sound: ${type}`)

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      console.log('⚠️ AudioContext suspended, attempting to resume...')
      audioContext.resume().then(() => {
        console.log('✅ AudioContext resumed')
      }).catch(err => {
        console.error('❌ Failed to resume AudioContext:', err)
      })
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case 'ambient':
        // Soft ambient hum for text appearance
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 1.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 1.5)
        break

      case 'whoosh':
        // Whoosh sound for condensing
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4)
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.4)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.4)
        break

      case 'charge':
        // Charging/powering up sound for rocket
        oscillator.type = 'triangle'
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6)
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.35, audioContext.currentTime + 0.3)
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.6)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.6)
        break

      case 'launch':
        // Powerful launch sound
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(50, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1)
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.6, audioContext.currentTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 1)
        break
    }

    console.log(`✅ Sound ${type} played successfully`)
  } catch (error) {
    console.error(`❌ Error playing sound ${type}:`, error)
  }
}

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void
}) {
  const [stage, setStage] = useState<"text" | "condense" | "rocket" | "launch">("text")
  const [isExiting, setIsExiting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const soundPlayedRef = useRef<Set<string>>(new Set())
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    setMounted(true)
    // Reset sound tracking on mount to allow sounds to play again
    soundPlayedRef.current.clear()
  }, [])

  // Initialize audio context on user interaction
  const enableAudio = () => {
    if (typeof window === 'undefined') return

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = ctx

      // Resume if suspended
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('✅ AudioContext enabled and resumed')
          setAudioEnabled(true)
        })
      } else {
        console.log('✅ AudioContext enabled')
        setAudioEnabled(true)
      }
    } catch (error) {
      console.error('❌ Failed to enable audio:', error)
    }
  }

  // Play sound effects when stage changes
  useEffect(() => {
    if (!mounted || !audioEnabled || !audioContextRef.current) return

    // Prevent playing the same sound twice in the same session
    if (soundPlayedRef.current.has(stage)) return
    soundPlayedRef.current.add(stage)

    const audioContext = audioContextRef.current

    try {
      console.log(`🔊 Playing sound: ${stage}`)

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (stage) {
        case 'text':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 1.5)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 1.5)
          break
        case 'condense':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4)
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.4)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.4)
          break
        case 'rocket':
          oscillator.type = 'triangle'
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.6)
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.35, audioContext.currentTime + 0.3)
          gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.6)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.6)
          break
        case 'launch':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(50, audioContext.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
          oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1)
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.6, audioContext.currentTime + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 1)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 1)
          break
      }

      console.log(`✅ Sound ${stage} played`)
    } catch (error) {
      console.error(`❌ Error playing sound ${stage}:`, error)
    }
  }, [stage, mounted, audioEnabled])

  useEffect(() => {
    // Stage 1: Text appears (0ms)
    // Stage 2: Condense text (1500ms)
    const timer1 = setTimeout(() => setStage("condense"), 2000)

    // Stage 3: Rocket forms (2000ms)
    const timer2 = setTimeout(() => setStage("rocket"), 2800)

    // Stage 4: Launch (3500ms)
    const timer3 = setTimeout(() => setStage("launch"), 3800)

    // Complete (4500ms)
    const timer4 = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onComplete, 800)
    }, 4800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Click to Enable Sound Overlay */}
          {!audioEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer"
              onClick={enableAudio}
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-white/90 mb-2">Enable Sound</h3>
                <p className="text-sm text-white/50">Tap anywhere to continue with audio</p>
              </motion.div>
            </motion.div>
          )}

          {/* Starfield Background */}
          {mounted && (
            <div className="absolute inset-0 perspective-[500px]">
              {/* Normal Stars */}
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5 + 0.1,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={
                    stage === "launch"
                      ? {
                        y: [null, window.innerHeight + 100],
                        opacity: [null, 1, 0],
                        scale: [null, 0.5, 2] // Warp effect
                      }
                      : {
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [0.2, 0.8, 0.2]
                      }
                  }
                  transition={
                    stage === "launch"
                      ? { duration: 0.4 + Math.random() * 0.2, repeat: Infinity, ease: "linear" }
                      : { duration: 3 + Math.random() * 5, repeat: Infinity, ease: "linear" }
                  }
                  className={`absolute rounded-full bg-white ${stage === "launch" ? "w-[2px] h-[30px]" : "w-[2px] h-[2px]"}`}
                />
              ))}
            </div>
          )}

          <div className="relative flex items-center justify-center">

            {/* STAGE 1 & 2: TEXT */}
            <AnimatePresence>
              {(stage === "text" || stage === "condense") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, letterSpacing: "1em" }}
                  animate={
                    stage === "text"
                      ? { opacity: 1, scale: 1, letterSpacing: "0.2em" }
                      : { opacity: 0, scale: 0, letterSpacing: "-0.5em", filter: "blur(20px)" }
                  }
                  transition={{ duration: stage === "text" ? 1.5 : 0.8, ease: "easeInOut" }}
                  className="absolute z-10"
                >
                  <h1 className="text-4xl md:text-6xl font-bold text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    MOONIT
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STAGE 2: ENERGY CORE */}
            <AnimatePresence>
              {stage === "condense" && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 0.1], opacity: [0, 1, 1] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute w-20 h-20 bg-white rounded-full blur-[20px] z-20"
                />
              )}
            </AnimatePresence>

            {/* STAGE 3 & 4: ROCKET */}
            <AnimatePresence>
              {(stage === "rocket" || stage === "launch") && (
                <motion.div
                  initial={{ scale: 0, y: 0, opacity: 0 }}
                  animate={
                    stage === "rocket"
                      ? { scale: 1, y: 0, opacity: 1 }
                      : { y: -window.innerHeight, scale: 0.8, transition: { duration: 1, ease: "easeIn" } }
                  }
                  className="relative z-30"
                >
                  {/* Rocket Body */}
                  <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                    <Rocket
                      className="w-full h-full text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                      style={{ transform: "rotate(-45deg)" }}
                    />

                    {/* Engine Flame */}
                    {stage === "launch" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: [20, 60, 40], opacity: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className="absolute -bottom-8 w-4 bg-gradient-to-t from-transparent via-blue-400 to-white blur-[4px] rounded-full left-1/2 -translate-x-1/2"
                      />
                    )}
                  </div>

                  {/* Shockwave circle on launch */}
                  {stage === "launch" && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className="absolute bottom-10 z-20">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === "launch" ? 0 : 0.5 }}
              className="text-[10px] text-white/50 uppercase tracking-[0.3em]"
            >
              {stage === "text" && "Initializing..."}
              {stage === "condense" && "Condensing Energy..."}
              {stage === "rocket" && "Systems Ready"}
              {stage === "launch" && "Liftoff..."}
            </motion.p>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
