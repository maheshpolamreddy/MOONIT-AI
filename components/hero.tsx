"use client"

import React, { useEffect, useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      setMousePos({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden"
    >
      {/* Subtle radial glow behind heading - parallax to mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Overline */}
      <p
        className="text-[11px] uppercase tracking-[0.4em] text-white/25 font-medium mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(15px)",
          transition: "opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s",
        }}
      >
        Artificial Intelligence
      </p>

      {/* Main heading */}
      <h1
        className="font-display font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[100px] tracking-[0.08em] text-balance"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #777777 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(30px) scale(0.97)",
          transition:
            "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
        }}
      >
        MOONIT
      </h1>

      {/* Subtitle */}
      <p
        className="mt-5 text-base sm:text-lg md:text-xl font-light text-white/40 max-w-md leading-relaxed"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.9s ease-out 0.7s, transform 0.9s ease-out 0.7s",
        }}
      >
        Your intelligent AI assistant. Ask anything, get instant answers, and explore ideas together.
      </p>

      {/* CTA Button */}
      <Link
        href="/chat"
        className="group mt-10 relative px-9 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-white rounded-full overflow-hidden transition-all duration-500"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.9s ease-out 1s, transform 0.9s ease-out 1s, background 0.4s, border-color 0.4s, box-shadow 0.4s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 1)"
          e.currentTarget.style.color = "#000"
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 1)"
          e.currentTarget.style.boxShadow =
            "0 0 40px rgba(255, 255, 255, 0.15)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
          e.currentTarget.style.color = "#fff"
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"
          e.currentTarget.style.boxShadow = "none"
        }}
        suppressHydrationWarning
      >
        Start Conversation
      </Link>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{
          opacity: isVisible ? 0.25 : 0,
          transition: "opacity 1.2s ease-out 1.5s",
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
          Scroll
        </span>
        <ChevronDown
          size={18}
          className="text-white animate-bounce"
          style={{ animationDuration: "2.5s" }}
        />
      </div>
    </section>
  )
}
