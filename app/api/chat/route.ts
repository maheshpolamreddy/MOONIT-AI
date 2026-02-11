import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages }: { messages: any[] } = await req.json()
    console.log("📨 Received messages:", JSON.stringify(messages, null, 2))

    const systemPrompt = `You are MOONIT, a helpful and friendly AI assistant. 
Your goal is to provide accurate, clear answers to any question.
Be conversational and warm, but stay focused on being helpful.
Keep your responses concise and easy to understand.`

    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content || m.text || ""
      }))
    ].filter(m => m.content !== "")

    console.log("🔄 Formatted messages:", JSON.stringify(formattedMessages, null, 2))
    console.log("🤖 Calling AI model...")

    const result = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      messages: formattedMessages,
    })

    console.log("✅ AI response generated:", result.text.substring(0, 100) + "...")

    return Response.json({
      message: {
        role: "assistant",
        content: result.text
      }
    })
  } catch (error: unknown) {
    console.error("❌ Chat API Error:", error)
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    )
  }
}
