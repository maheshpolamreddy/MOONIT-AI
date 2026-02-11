"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'

type AuthContextType = {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
    signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    signInWithGoogle: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)

            // Client-side Redirection Logic (Replaces middleware)
            const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
            const isDashboardPage = pathname.startsWith('/chat')
            const isLandingPage = pathname === '/'

            if (user) {
                // After login/signup, redirect to chat
                if (isAuthPage) {
                    router.push('/chat')
                }
                // Allow authenticated users on landing page (no redirect)
            } else {
                // Protect chat routes - redirect to login
                if (isDashboardPage) {
                    router.push('/login')
                }
                // Allow unauthenticated users on landing page
            }
        })

        return () => unsubscribe()
    }, [router, pathname])

    const signOut = async () => {
        await firebaseSignOut(auth)
        router.push('/login')
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            router.push('/chat')
        } catch (error) {
            console.error("Google Auth Error:", error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
