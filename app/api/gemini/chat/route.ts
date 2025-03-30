import { NextResponse } from "next/server"
import { generateGeminiResponse, createUserMessage, createModelMessage, type GeminiMessage } from "@/lib/gemini-api"

export async function POST(request: Request) {
  try {
    const { message, subject, context, currentContent } = await request.json()

    // Convert context to Gemini message format
    const geminiMessages: GeminiMessage[] = []

    // Add system message with context about the current topic
    geminiMessages.push(
      createUserMessage(
        `You are an AI learning assistant specializing in ${subject}. 
        Provide helpful, accurate, and concise responses to help the user learn.
        
        CURRENT TOPIC: "${currentContent?.title || `Introduction to ${subject}`}"
        
        You have access to the current lesson content, which you can reference to provide accurate help.
        If the user asks about something in the current lesson, refer to the content to provide specific help.
        
        If the user asks you to modify the lesson content (like simplifying, adding more examples),
        ask them to confirm if they want you to regenerate the content with their requested changes.
        
        Be conversational, helpful, and adapt your explanations to match the user's needs.
        
        CURRENT LESSON CONTENT (beginning):
        ${currentContent?.content?.substring(0, 1500) || "Not available yet"}...`
      )
    )

    // Add conversation history
    if (context && context.length > 0) {
      for (const msg of context) {
        if (msg.role === "user") {
          geminiMessages.push(createUserMessage(msg.content))
        } else {
          geminiMessages.push(createModelMessage(msg.content))
        }
      }
    }

    // Add current message
    geminiMessages.push(createUserMessage(message))

    // Generate response from Gemini
    const response = await generateGeminiResponse(geminiMessages, {
      temperature: 0.7,
      maxOutputTokens: 2048,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

