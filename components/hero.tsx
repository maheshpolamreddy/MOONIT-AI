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
        className="group mt-10 relative px-10 py-4 md:px-9 md:py-3.5 text-base md:text-sm font-semibold md:font-medium uppercase tracking-[0.15em] md:tracking-[0.18em] rounded-full overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 1)",
          color: "#000",
          border: "1px solid rgba(255, 255, 255, 1)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition:
            "opacity 0.9s ease-out 1s, transform 0.9s ease-out 1s, background 0.4s, border-color 0.4s, box-shadow 0.4s, transform 0.2s",
          boxShadow: "0 4px 20px rgba(255, 255, 255, 0.15)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"
          e.currentTarget.style.transform = "scale(1.05)"
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(255, 255, 255, 0.25)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 1)"
          e.currentTarget.style.transform = "scale(1)"
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 255, 255, 0.15)"
        }}
        suppressHydrationWarning
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Start Conversation
        </span>
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
