"use client"

import type { UIMessage } from "ai"

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 opacity-60"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="white"
        fillOpacity="0.7"
      />
    </svg>
  )
}

export default function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user"

  const text =
    message.parts
      ?.filter(
        (p): p is { type: "text"; text: string } => p.type === "text"
      )
      .map((p) => p.text)
      .join("") || ""

  if (!text) return null

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
      style={{
        animation: `float-up 0.3s ease-out forwards`,
      }}
    >
      <div className={`flex flex-col gap-1.5 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 pl-1">
            <MoonIcon />
            <span className="text-[11px] font-light text-white/30 uppercase tracking-wider">
              MOONIT
            </span>
          </div>
        )}
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "rounded-[18px_18px_4px_18px] text-white"
              : "rounded-[18px_18px_18px_4px] text-white/85"
          }`}
          style={{
            background: isUser
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(255, 255, 255, 0.03)",
            border: isUser
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.06)",
            borderLeft: !isUser
              ? "2px solid rgba(255, 255, 255, 0.15)"
              : undefined,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
