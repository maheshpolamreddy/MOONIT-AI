import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-center px-6">
      {/* Astronaut illustration - minimal white lines */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="mb-8 opacity-30"
      >
        {/* Helmet */}
        <circle cx="60" cy="45" r="22" stroke="white" strokeWidth="1.5" />
        <circle cx="60" cy="45" r="16" stroke="white" strokeWidth="0.75" opacity="0.5" />
        {/* Visor reflection */}
        <path d="M50 38 Q55 35 65 38" stroke="white" strokeWidth="0.5" opacity="0.3" />
        {/* Body */}
        <path d="M44 65 L44 90 M76 65 L76 90" stroke="white" strokeWidth="1.5" />
        <rect x="40" y="62" width="40" height="28" rx="6" stroke="white" strokeWidth="1.5" fill="none" />
        {/* Backpack */}
        <rect x="32" y="64" width="8" height="20" rx="3" stroke="white" strokeWidth="1" fill="none" />
        {/* Arms floating */}
        <path d="M40 72 Q25 65 20 78" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M80 72 Q95 65 100 78" stroke="white" strokeWidth="1.5" fill="none" />
        {/* Legs floating */}
        <path d="M48 90 Q45 102 38 108" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M72 90 Q75 102 82 108" stroke="white" strokeWidth="1.5" fill="none" />
        {/* Tether line */}
        <path d="M80 66 Q100 55 105 40 Q108 30 100 22" stroke="white" strokeWidth="0.75" opacity="0.4" strokeDasharray="3 3" fill="none" />
      </svg>

      <h1
        className="font-display text-5xl font-bold tracking-[0.15em] mb-4 text-white"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #666666 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        404
      </h1>

      <p className="text-lg font-light text-white/50 mb-2">
        Lost in space?
      </p>
      <p className="text-sm font-light text-white/30 mb-8">
        {"Let's get you home."}
      </p>

      <Link
        href="/"
        className="px-8 py-3 text-sm font-normal uppercase tracking-[0.15em] text-white/80 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-400"
      >
        Return Home
      </Link>

      {/* Some floating stars */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`star-${
            // biome-ignore lint: index key is fine for static list
            i
          }`}
          className="fixed w-px h-px bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  )
}
