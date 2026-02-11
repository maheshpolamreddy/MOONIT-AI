"use client"

import { useState, useEffect, useRef } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  shouldTwinkle: boolean
  duration: number
  delay: number
}

function NebulaDust() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Subtle nebula 1 */}
      <div
        className="absolute"
        style={{
          left: "15%",
          top: "20%",
          width: "40vw",
          height: "40vh",
          background:
            "radial-gradient(ellipse, rgba(100, 100, 140, 0.03) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Subtle nebula 2 */}
      <div
        className="absolute"
        style={{
          right: "10%",
          top: "50%",
          width: "35vw",
          height: "35vh",
          background:
            "radial-gradient(ellipse, rgba(80, 90, 120, 0.025) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </div>
  )
}

function CSSStars({ speed }: { speed: number }) {
  const [stars, setStars] = useState<Star[]>([])

  useEffect(() => {
    const result: Star[] = []
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = Math.random() < 0.1 ? 2 : Math.random() < 0.3 ? 1.5 : 1
      const opacity = 0.1 + Math.random() * 0.7
      const shouldTwinkle = Math.random() < 0.2
      const duration = 2 + Math.random() * 6
      const delay = Math.random() * 8

      result.push({
        id: i,
        x,
        y,
        size,
        opacity,
        shouldTwinkle,
        duration,
        delay,
      })
    }
    setStars(result)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full transition-all duration-[2000ms]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: speed > 1 ? `${star.size * 20}px` : `${star.size}px`, // Elongate stars
            backgroundColor: "#ffffff",
            opacity: star.opacity,
            animation: star.shouldTwinkle
              ? `twinkle ${star.duration / speed}s ease-in-out ${star.delay}s infinite`
              : undefined,
            transform: speed > 1 ? `translateY(${Math.random() * 100}px)` : "none"
          }}
        />
      ))}
    </div>
  )
}

function CanvasStars({ speed }: { speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Create particle stars
    const particles: {
      x: number
      y: number
      size: number
      opacity: number
      vx: number
      vy: number
      baseOpacity: number
    }[] = []

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.5,
        baseOpacity: 0.1 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
      })
    }

    // Shooting stars
    const shootingStars: {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      length: number
    }[] = []

    let lastShootingStar = Date.now()
    const shootingStarInterval = 15000 + Math.random() * 30000

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      for (const p of particles) {
        // Apply speed multiplier
        p.y += (p.vy + (speed > 1 ? speed * 0.5 : 0)) // Move down fast
        p.x += p.vx

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        // Draw elongated streaks if speeding
        if (speed > 1) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y - p.size * (speed * 2));
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.lineWidth = p.size;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
          ctx.fill()
        }
      }

      // Spawn shooting stars (more frequent during warp)
      const now = Date.now()
      const currentInterval = speed > 1 ? shootingStarInterval / 10 : shootingStarInterval

      if (now - lastShootingStar > currentInterval && shootingStars.length < (speed > 1 ? 20 : 2)) {
        const startX = Math.random() * canvas.width
        const startY = Math.random() * canvas.height * 0.4
        shootingStars.push({
          x: startX,
          y: startY,
          vx: (4 + Math.random() * 4) * (speed > 1 ? 0 : 1), // Straight down if fast
          vy: (2 + Math.random() * 3) * (speed > 1 ? 5 : 1),
          life: 0,
          maxLife: 40 + Math.random() * 30,
          length: 60 + Math.random() * 40,
        })
        lastShootingStar = now
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        ss.x += ss.vx
        ss.y += ss.vy
        ss.life++

        const progress = ss.life / ss.maxLife
        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7

        // Calculate tail position safely using vector normalization
        const velocity = Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy)
        const tailX = ss.x - (ss.vx / velocity) * ss.length
        const tailY = ss.y - (ss.vy / velocity) * ss.length

        const gradient = ctx.createLinearGradient(
          ss.x,
          ss.y,
          tailX,
          tailY
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [speed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}

export default function Starfield({ speed = 1 }: { speed?: number }) {
  return (
    <>
      <NebulaDust />
      <CSSStars speed={speed} />
      <CanvasStars speed={speed} />
    </>
  )
}
