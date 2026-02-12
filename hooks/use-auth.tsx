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
            console.log('🔐 Attempting Google sign-in...')
            const result = await signInWithPopup(auth, googleProvider)
            console.log('✅ Google sign-in successful:', result.user.email)
            router.push('/chat')
        } catch (error: any) {
            console.error('❌ Google Auth Error:', error)
            console.error('Error code:', error.code)
            console.error('Error message:', error.message)

            // Handle specific error cases
            if (error.code === 'auth/popup-blocked') {
                console.error('Popup was blocked by browser')
                alert('Popup was blocked. Please allow popups for this site and try again.')
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log('User closed the popup - no action needed')
                // User intentionally closed popup, don't show error
            } else if (error.code === 'auth/unauthorized-domain') {
                console.error('Domain not authorized in Firebase Console')
                console.error('Current domain:', window.location.hostname)
                alert('Authentication error: This domain is not authorized. Please contact support.')
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log('Popup request cancelled - user likely clicked button multiple times')
                // Don't show error for this
            } else if (error.code === 'auth/network-request-failed') {
                console.error('Network request failed')
                alert('Network error. Please check your internet connection and try again.')
            } else {
                console.error('Unexpected auth error')
                alert('Failed to sign in with Google. Please try again or use email/password.')
            }

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
