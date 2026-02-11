"use client"

import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93" />
        <path d="M8.56 13.44A7.97 7.97 0 0 0 4 20h16a7.97 7.97 0 0 0-4.56-6.56" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <path d="M12 2v1" />
        <path d="M12 13v9" />
        <path d="m8 6 1.5 1" />
        <path d="m16 6-1.5 1" />
      </svg>
    ),
    title: "Advanced Reasoning",
    description:
      "Multi-layered cognitive architecture that deconstructs complex problems and synthesizes precise answers.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Rapid Intelligence",
    description:
      "Millisecond inference across billions of parameters. Thoughts processed at the speed of light.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "Deep Perception",
    description:
      "Contextual awareness that reads between the lines -- understanding intent, tone, and nuance effortlessly.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
      </svg>
    ),
    title: "Limitless Knowledge",
    description:
      "Trained on vast datasets spanning every discipline. From quantum physics to creative writing -- mastered.",
  },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleCards((prev) => new Set([...prev, index]))
          }
        }
      },
      { threshold: 0.15 }
    )

    const cards = sectionRef.current?.querySelectorAll("[data-index]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative z-10 px-6 py-28 max-w-6xl mx-auto"
    >
      <div className="text-center mb-20">
        <p
          className="text-xs uppercase tracking-[0.3em] text-white/30 mb-4 font-medium"
          style={{ letterSpacing: "0.3em" }}
        >
          Capabilities
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight text-balance leading-tight"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 20%, #666666 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Intelligence Without
          <br />
          Boundaries
        </h2>
        <p className="text-sm sm:text-base text-white/35 mt-5 max-w-md mx-auto font-light leading-relaxed">
          Next-generation AI that thinks deeper, responds faster, and
          understands more than ever before.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature, i) => {
          const isVisible = visibleCards.has(i)
          const isHovered = hoveredCard === i

          return (
            <div
              key={feature.title}
              data-index={i}
              className="group relative p-7 rounded-2xl cursor-default overflow-hidden"
              style={{
                background: isHovered
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(255, 255, 255, 0.015)",
                border: isHovered
                  ? "1px solid rgba(255, 255, 255, 0.12)"
                  : "1px solid rgba(255, 255, 255, 0.04)",
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? isHovered
                    ? "translateY(-6px)"
                    : "translateY(0)"
                  : "translateY(40px)",
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.12}s, background 0.4s, border-color 0.4s, box-shadow 0.4s`,
                boxShadow: isHovered
                  ? "0 12px 50px rgba(255, 255, 255, 0.04)"
                  : "none",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)",
                  opacity: isHovered ? 1 : 0,
                }}
              />

              <div className="relative z-10">
                <div
                  className="text-white/60 mb-5 transition-all duration-400"
                  style={{
                    color: isHovered
                      ? "rgba(255, 255, 255, 0.9)"
                      : "rgba(255, 255, 255, 0.4)",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                    transformOrigin: "left center",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-base font-semibold text-white mb-3 tracking-wide transition-colors duration-300"
                  style={{
                    color: isHovered
                      ? "rgba(255, 255, 255, 1)"
                      : "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  {feature.title}
                </h3>
                <p className="text-[13px] font-light text-white/40 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
