"use client"

import dynamic from "next/dynamic"
import { useState, useCallback } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Footer from "@/components/footer"
import LoadingScreen from "@/components/loading-screen"

const MoonScene = dynamic(() => import("@/components/moon/moon-scene"), {
  ssr: false,
})

const Starfield = dynamic(() => import("@/components/starfield/starfield"), {
  ssr: false,
})

export default function Page() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleLaunch = useCallback(() => {
    setIsLaunching(true)
    // Reset after animation
    setTimeout(() => setIsLaunching(false), 8000)
  }, [])

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1s ease-out",
        }}
      >
        {/* Background layers */}
        <Starfield speed={isLaunching ? 20 : 1} />
        <MoonScene isLaunching={isLaunching} />

        {/* Content */}
        <Navbar onLaunch={handleLaunch} />
        <main>
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </>
  )
}
