"use client"

import React from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Sidebar from "../../components/dashboard/sidebar"

const Starfield = dynamic(() => import("@/components/starfield/starfield"), { ssr: false })

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative h-screen bg-black text-white flex overflow-hidden">
            <Starfield />

            {/* Dynamic Sidebar */}
            <Sidebar />

            <main className="flex-1 relative flex flex-col h-full overflow-hidden">
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-white opacity-[0.02] blur-[150px] rounded-full" />
                </div>

                {children}
            </main>
        </div>
    )
}
