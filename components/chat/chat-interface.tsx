"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Moon, Sparkles } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore"
import { motion, AnimatePresence } from "framer-motion"

interface ChatInterfaceProps {
  chatId?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  parts: Array<{ type: "text"; text: string }>
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  console.log("💫 ChatInterface mounted with chatId:", chatId)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Load messages from Firestore on mount and keep in sync
  useEffect(() => {
    if (!chatId) return

    console.log("📡 Loading messages from Firestore for chat:", chatId)
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        role: doc.data().role as "user" | "assistant",
        parts: [{ type: "text" as const, text: doc.data().content }]
      }))
      console.log("📥 Loaded", msgs.length, "messages from Firestore")
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [chatId])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 handleSubmit called!")
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    console.log("📤 User message:", userMessage)

    // Add user message to UI
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text: userMessage }]
    }
    setMessages(prev => [...prev, userMsg])

    try {
      // Save user message to Firestore (non-blocking - don't wait)
      if (chatId) {
        console.log("💾 Saving to Firestore (background)...")
        addDoc(collection(db, "chats", chatId, "messages"), {
          role: "user",
          content: userMessage,
          createdAt: serverTimestamp()
        }).then(() => {
          console.log("✅ Firestore save complete")
        }).catch(err => {
          console.error("❌ Firestore save failed:", err)
        })
      }

      // Call AI API with timeout
      console.log("🔄 Calling AI API...")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.concat([userMsg]).map(m => ({
            role: m.role,
            content: m.parts[0]?.text || ""
          }))
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const aiText = data.message?.content || data.content || ""

      if (!aiText) {
        throw new Error("No AI response content")
      }

      console.log("✅ AI response received:", aiText.substring(0, 50) + "...")

      // Add AI message to UI
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: aiText }]
      }
      setMessages(prev => [...prev, aiMsg])

      // Save AI message to Firestore (non-blocking)
      if (chatId) {
        addDoc(collection(db, "chats", chatId, "messages"), {
          role: "assistant",
          content: aiText,
          createdAt: serverTimestamp()
        }).then(() => {
          console.log("✅ AI response saved to Firestore")
        }).catch(err => {
          console.error("❌ AI Firestore save failed:", err)
        })

        // Auto-title on first message
        if (messages.length === 0) {
          const title = userMessage.split(' ').slice(0, 5).join(' ')
          updateDoc(doc(db, "chats", chatId), {
            title: title.length > 30 ? title.substring(0, 30) + "..." : title
          }).catch(err => {
            console.error("❌ Title update failed:", err)
          })
        }
      }

    } catch (error) {
      console.error("❌ Error:", error)
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        parts: [{ type: "text", text: "Sorry, I encountered an error. Please try again." }]
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <h2 className="text-sm font-medium tracking-widest uppercase text-white/80">MOONIT AI</h2>
              <p className="text-[10px] text-white/30 font-light">Always here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - Absolute Scrollable Container */}
      <div className="flex-1 overflow-y-auto w-full scroll-smooth scrollbar-hide">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 min-h-full flex flex-col justify-end">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]">
                  <Moon className="w-8 h-8 text-white/40" />
                </div>
                <h3 className="text-xl font-light text-white/90 mb-2">Welcome to MOONIT</h3>
                <p className="text-white/30 text-sm font-light max-w-sm">
                  Start a conversation to explore the universe of possibilities.
                </p>
              </motion.div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user"
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col gap-2 max-w-[80%] md:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                      {!isUser && (
                        <div className="flex items-center gap-2 pl-1 select-none">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-white/70" />
                          </div>
                          <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">AI Assistant</span>
                        </div>
                      )}

                      <div
                        className={`px-5 py-3.5 text-[15px] leading-7 shadow-lg backdrop-blur-sm ${isUser
                          ? "rounded-[24px_24px_4px_24px] text-white bg-white/10 border border-white/10"
                          : "rounded-[24px_24px_24px_4px] text-white/90 bg-white/5 border border-white/5"
                          }`}
                        style={{
                          boxShadow: isUser
                            ? "0 4px 20px -2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)"
                            : "0 4px 20px -2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)"
                        }}
                      >
                        <div className="whitespace-pre-wrap">
                          {msg.parts.filter(p => p.type === 'text').map(p => p.text).join('')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start pl-2"
            >
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-[20px] bg-white/[0.02] border border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1.4s_infinite_0ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1.4s_infinite_200ms]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-[bounce_1.4s_infinite_400ms]" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl p-4 md:p-6 pb-8 z-20">
        <div className="max-w-4xl mx-auto relative">
          <motion.form
            onSubmit={handleSubmit}
            animate={{
              boxShadow: isFocused ? "0 0 0 2px rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.05)" : "none"
            }}
            className={`flex gap-3 bg-white/[0.03] border transition-all duration-300 rounded-2xl p-2 ${isFocused ? "border-white/20 bg-white/[0.05]" : "border-white/10"
              }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Message Moonit..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 text-[15px]"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:text-white/50 rounded-xl px-4 py-2 transition-all flex items-center justify-center shadow-lg shadow-white/5"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </motion.form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-white/20 font-light">MOONIT AI can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
