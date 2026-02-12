"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#chat", label: "Chat" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
]

function MoonitLogo() {
  return (
    <a href="#home" className="flex items-center gap-2.5 group">
      {/* Premium Logo Mark */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        {/* Outer ring */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          className="absolute inset-0"
        >
          <circle
            cx="18"
            cy="18"
            r="16.5"
            stroke="url(#logoGradient)"
            strokeWidth="1"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="36" y2="36">
              <stop stopColor="white" stopOpacity="0.8" />
              <stop offset="1" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
        {/* Crescent moon icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="relative transition-transform duration-500 group-hover:rotate-[-15deg]"
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="url(#moonFill)"
          />
          <defs>
            <linearGradient id="moonFill" x1="6" y1="3" x2="21" y2="21">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#B8B8B8" />
            </linearGradient>
          </defs>
        </svg>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          }}
        />
      </div>
      {/* Wordmark */}
      <span
        className="font-display font-bold text-[18px] tracking-[0.25em] text-white transition-all duration-300"
        style={{
          textShadow: "0 0 20px rgba(255,255,255,0.15)",
        }}
      >
        MOONIT
      </span>
    </a>
  )
}

import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Rocket } from "lucide-react"

export default function Navbar({ onLaunch }: { onLaunch: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center transition-all duration-500"
      style={{
        background: hasScrolled
          ? "rgba(0, 0, 0, 0.6)"
          : "rgba(0, 0, 0, 0.15)",
        backdropFilter: hasScrolled ? "blur(24px)" : "blur(12px)",
        WebkitBackdropFilter: hasScrolled ? "blur(24px)" : "blur(12px)",
        borderBottom: hasScrolled
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6">
        <MoonitLogo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-normal uppercase tracking-[0.1em] text-white/50 hover:text-white transition-colors duration-300 py-1"
            >
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
          <button
            onClick={onLaunch}
            className="px-6 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white/90 rounded-full transition-all duration-400 group relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Rocket size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              Launch
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <Link
            href="/chat"
            className="px-6 py-2 text-sm font-medium uppercase tracking-[0.12em] text-black bg-white rounded-full transition-all duration-300 hover:bg-white/90 hover:scale-105"
            suppressHydrationWarning
          >
            Start Conversation
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          suppressHydrationWarning
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[68px] z-50 md:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.92)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
        >
          <div className="flex flex-col items-center gap-8 pt-16">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-light uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/chat"
              onClick={() => setIsOpen(false)}
              className="mt-8 w-[85%] max-w-sm px-8 py-4 text-base font-semibold uppercase tracking-[0.15em] text-black bg-white rounded-full transition-all duration-300 hover:bg-white/90 active:scale-95 shadow-lg flex items-center justify-center gap-3"
              style={{
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
              }}
              suppressHydrationWarning
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Conversation
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
