"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MessageSquare, LogOut, User, Search, Trash2, Home, MessageCircle, Sparkles, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore"

export default function Sidebar() {
    const { user, signOut } = useAuth()
    const [chats, setChats] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()
    const params = useParams()
    const currentChatId = params?.chatId as string

    useEffect(() => {
        if (!user) return

        const q = query(
            collection(db, "chats"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setChats(chatList)
        })

        return () => unsubscribe()
    }, [user])

    const handleSignOut = async () => {
        await signOut()
        router.push("/login")
    }

    const handleNewChat = async () => {
        if (!user) return
        const chatRef = await addDoc(collection(db, "chats"), {
            userId: user.uid,
            title: "New Chat",
            createdAt: serverTimestamp()
        })
        // Navigate to the new chat
        router.push(`/chat/${chatRef.id}`)
    }

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm("Delete this chat permanently?")) {
            if (currentChatId === chatId) {
                router.push("/chat")
            }
            await deleteDoc(doc(db, "chats", chatId))
        }
    }

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-72 border-r border-white/5 flex flex-col h-full bg-black/40 backdrop-blur-xl z-20"
        >
            {/* Header / Navigation */}
            <div className="p-4 space-y-3">
                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.03] border border-white/[0.08] text-white rounded-xl font-medium text-sm transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-95 group"
                >
                    <Home size={16} className="transition-transform group-hover:-translate-x-1 opacity-70 group-hover:opacity-100" />
                    <span>Go to Home</span>
                </Link>

                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-between py-3 px-4 bg-white text-black rounded-xl font-semibold text-sm transition-all hover:bg-white/90 active:scale-95 group shadow-lg shadow-white/5"
                >
                    <div className="flex items-center gap-2">
                        <Plus size={18} className="transition-transform group-hover:rotate-90" />
                        <span>New Chat</span>
                    </div>
                    <Sparkles size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                </button>
            </div>

            {/* Search */}
            <div className="px-4 mb-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-white/60 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl py-2.5 pl-9 pr-4 text-xs outline-none focus:bg-white/[0.06] focus:border-white/10 transition-all placeholder:text-white/20"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                <div className="px-4 mb-2 mt-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Conversations</span>
                </div>

                <AnimatePresence initial={false}>
                    {filteredChats.map((chat) => {
                        const isActive = currentChatId === chat.id
                        return (
                            <motion.div
                                key={chat.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Link
                                    href={`/chat/${chat.id}`}
                                    className={`relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all group ${isActive
                                            ? "bg-white/[0.08] text-white"
                                            : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 w-1 h-full bg-white rounded-r-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        />
                                    )}

                                    <MessageSquare size={16} className={`shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`} />

                                    <span className="truncate flex-1 font-light">{chat.title}</span>

                                    <button
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-red-400"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </Link>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {filteredChats.length === 0 && (
                    <div className="px-4 py-8 text-center">
                        <p className="text-white/20 text-xs">No chats found</p>
                    </div>
                )}
            </div>

            {/* User / Footer */}
            <div className="p-3 mt-auto border-t border-white/5 space-y-1 bg-black/20">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <User size={14} className="text-white/70" />
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                        <span className="truncate w-full font-medium text-white/90 text-xs">
                            {user?.displayName || "User"}
                        </span>
                        <span className="truncate w-full text-[10px] text-white/30">
                            {user?.email || ""}
                        </span>
                    </div>
                </button>

                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all group justify-center mt-2 group-hover:bg-red-900/10"
                >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                </button>
            </div>
        </motion.aside>
    )
}
