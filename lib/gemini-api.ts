const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent"

export interface GeminiMessage {
  role: "user" | "model"
  parts: { text: string }[]
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
      role: string
    }
    finishReason: string
  }[]
}

export async function generateGeminiResponse(
  messages: GeminiMessage[],
  config: {
    temperature?: number
    maxOutputTokens?: number
  } = {},
): Promise<string> {
  try {
    const requestBody: GeminiRequest = {
      contents: messages,
      generationConfig: {
        temperature: config.temperature || 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: config.maxOutputTokens || 1024,
      },
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data: GeminiResponse = await response.json()

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini API")
    }

    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "I'm sorry, I encountered an error generating a response. Please try again."
  }
}

export function createUserMessage(text: string): GeminiMessage {
  return {
    role: "user",
    parts: [{ text }],
  }
}

export function createModelMessage(text: string): GeminiMessage {
  return {
    role: "model",
    parts: [{ text }],
  }
}

export function createJsonPrompt(text: string): GeminiMessage {
  return {
    role: "user",
    parts: [
      {
        text: `${text}

IMPORTANT: Your response must be valid JSON only, with no markdown formatting, no code blocks, and no explanatory text. 
Just return the raw JSON object/array.`,
      },
    ],
  }
}

