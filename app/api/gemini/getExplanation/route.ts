import { NextResponse } from "next/server"
import { generateGeminiResponse, createUserMessage } from "@/lib/gemini-api"

export async function POST(request: Request) {
  try {
    const { questionId, question, selectedOption, correctOption } = await request.json()

    // Create prompt for Gemini
    const prompt = `Explain why the answer to the following question is ${correctOption}:

Question: ${question}

The user selected: ${selectedOption}
The correct answer is: ${correctOption}

Provide a clear, educational explanation of why the correct answer is right and why the user's answer (if different) is wrong. Include relevant concepts and examples to help reinforce understanding.

Format your response as markdown with:
- Clear headings (## for main sections)
- Bullet points for key concepts
- **Bold** for important terms
- Code examples in \`code blocks\` if relevant
- A summary at the end`

    // Generate explanation from Gemini
    const explanation = await generateGeminiResponse([createUserMessage(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 512,
    })

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("Error generating explanation:", error)
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}

