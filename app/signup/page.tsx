"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const Starfield = dynamic(() => import("@/components/starfield/starfield"), { ssr: false })

export default function SignupPage() {
    const { signInWithGoogle } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, {
                displayName: name
            })
            router.push("/chat")
        } catch (err: any) {
            setError(err.message || "Signup failed. Please try again.")
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
            <Starfield />

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white opacity-[0.015] blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div
                    className="w-full flex flex-col items-center justify-center p-8 sm:p-10"
                    style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        backdropFilter: "blur(40px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(40px) saturate(1.2)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "32px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-display font-semibold tracking-wider mb-2">Create Account</h1>
                        <p className="text-white/40 text-sm font-light">Start chatting with MOONIT AI</p>
                    </div>

                    <form onSubmit={handleSignup} className="w-full space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white/[0.06] focus:border-white/20"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white/[0.06] focus:border-white/20"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
                            <input
                                type="password"
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white/[0.06] focus:border-white/20"
                                required
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-400 text-center px-2"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="flex items-center gap-2 px-1 py-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-white/30" />
                            <span className="text-[10px] text-white/30 font-light">I agree to the terms and protocols</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black rounded-2xl py-3.5 font-semibold text-sm transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center gap-4 my-2">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] uppercase tracking-widest text-white/20">or</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <button
                            type="button"
                            onClick={signInWithGoogle}
                            disabled={isLoading}
                            className="w-full bg-white/[0.03] border border-white/[0.08] text-white rounded-2xl py-3.5 font-medium text-sm transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-white/30 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:underline transition-all">
                            Login
                        </Link>
                        {" · "}
                        <Link href="/" className="text-white/50 hover:text-white hover:underline transition-all">
                            Back to Home
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
