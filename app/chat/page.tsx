"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function ChatPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        console.log("🔍 Chat page state:", { loading, user: user?.uid, creating })

        // Wait for auth to load
        if (loading) {
            console.log("⏳ Waiting for auth to load...")
            return
        }

        // If not authenticated, useAuth will redirect to /login
        if (!user) {
            console.log("❌ No user, useAuth will redirect to login")
            return
        }

        // Prevent multiple chat creations
        if (creating) {
            console.log("⏸️ Already creating a chat, skipping...")
            return
        }

        const createNewChat = async () => {
            console.log("✨ Creating new chat for user:", user.uid)
            setCreating(true)
            try {
                // Create a new chat
                const chatRef = await addDoc(collection(db, "chats"), {
                    userId: user.uid,
                    title: "New Chat",
                    createdAt: serverTimestamp()
                })

                console.log("✅ Chat created:", chatRef.id)
                // Navigate to the new chat
                router.push(`/chat/${chatRef.id}`)
            } catch (error) {
                console.error("❌ Error creating chat:", error)
                setCreating(false)
            }
        }

        createNewChat()
    }, [user, loading, router, creating])

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-white/20 animate-pulse font-light tracking-widest text-xs uppercase">
                {loading ? "Loading..." : "Creating new chat..."}
            </div>
        </div>
    )
}
