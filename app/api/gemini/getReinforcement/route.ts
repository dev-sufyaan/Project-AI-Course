import { NextResponse } from "next/server"
import { generateGeminiResponse, createJsonPrompt } from "@/lib/gemini-api"

export async function POST(request: Request) {
  try {
    const { conceptId, question, selectedOption, correctOption, subject } = await request.json()

    // Create prompt for Gemini
    const prompt = `Generate 2 reinforcement multiple-choice questions related to the following concept that the user is struggling with:
    
    Original question: ${question}
    User's incorrect answer: ${selectedOption}
    Correct answer: ${correctOption}
    Subject: ${subject}
    
    Create questions that will help reinforce the concept and address the user's misunderstanding. Format your response as a structured JSON array with the following format:
    [
      {
        "id": "r1",
        "question": "Question text",
        "options": [
          {"id": "a", "text": "Option A", "isCorrect": false},
          {"id": "b", "text": "Option B", "isCorrect": true},
          {"id": "c", "text": "Option C", "isCorrect": false},
          {"id": "d", "text": "Option D", "isCorrect": false}
        ]
      },
      {
        "id": "r2",
        "question": "Question text",
        "options": [
          {"id": "a", "text": "Option A", "isCorrect": false},
          {"id": "b", "text": "Option B", "isCorrect": false},
          {"id": "c", "text": "Option C", "isCorrect": true},
          {"id": "d", "text": "Option D", "isCorrect": false}
        ]
      }
    ]`

    // Generate reinforcement questions from Gemini
    const response = await generateGeminiResponse([createJsonPrompt(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    // Parse the response as JSON, handling markdown code blocks if present
    let reinforcementQuestions
    try {
      // Check if the response contains markdown code blocks
      let jsonString = response

      // Extract JSON from markdown code blocks if present
      const codeBlockMatch = response.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonString = codeBlockMatch[1]
      }

      // Try to parse the JSON
      reinforcementQuestions = JSON.parse(jsonString)

      // Validate the required structure
      if (!Array.isArray(reinforcementQuestions)) {
        throw new Error("Invalid reinforcement questions structure")
      }
    } catch (error) {
      console.error("Error parsing reinforcement questions JSON:", error, "Raw response:", response)
      return NextResponse.json({ error: "Failed to parse reinforcement questions" }, { status: 500 })
    }

    return NextResponse.json({ reinforcementQuestions })
  } catch (error) {
    console.error("Error generating reinforcement questions:", error)
    return NextResponse.json({ error: "Failed to generate reinforcement questions" }, { status: 500 })
  }
}

