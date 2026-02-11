"use client"

import React from "react"
import { motion } from "framer-motion"
import ChatInterface from "@/components/chat/chat-interface"
import { useParams } from "next/navigation"

export default function ChatPage() {
    const params = useParams()
    const chatId = params?.chatId as string

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
        >
            <ChatInterface chatId={chatId} />
        </motion.div>
    )
}
