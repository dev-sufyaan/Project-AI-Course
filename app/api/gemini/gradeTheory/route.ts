import { NextResponse } from "next/server"
import { generateGeminiResponse, createJsonPrompt } from "@/lib/gemini-api"

export async function POST(request: Request) {
  try {
    const { questionId, question, answer, criteria, maxScore } = await request.json()

    // Create prompt for Gemini
    const prompt = `Grade the following answer to a theory question:

Question: ${question}

Answer: ${answer}

Grading criteria:
${criteria.map((c: string) => `- ${c}`).join("\n")}

Maximum score: ${maxScore}

Provide:
1. A numerical score out of ${maxScore}
2. Detailed feedback explaining the strengths and weaknesses of the answer
3. Suggestions for improvement

Format your feedback as markdown with:
- Clear headings (## for sections)
- Bullet points for strengths and weaknesses
- **Bold** for important points
- A summary of suggestions at the end

Format your response as a structured JSON object with the following format:
{
  "score": 7,
  "feedback": "Detailed markdown feedback here..."
}`

    // Generate grading from Gemini
    const response = await generateGeminiResponse([createJsonPrompt(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    // Parse the response as JSON, handling markdown code blocks if present
    let grading
    try {
      // Check if the response contains markdown code blocks
      let jsonString = response

      // Extract JSON from markdown code blocks if present
      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonString = codeBlockMatch[1]
      }

      // Try to parse the JSON
      grading = JSON.parse(jsonString)

      // Validate the required structure
      if (typeof grading.score !== "number" || typeof grading.feedback !== "string") {
        throw new Error("Invalid grading structure")
      }
    } catch (error) {
      console.error("Error parsing grading JSON:", error, "Raw response:", response)
      // Provide a fallback grading
      return NextResponse.json({
        score: 5,
        feedback: "Unable to grade your answer automatically. Here's a default score and feedback.",
      })
    }

    return NextResponse.json({
      score: grading.score,
      feedback: grading.feedback,
    })
  } catch (error) {
    console.error("Error grading theory answer:", error)
    return NextResponse.json({ error: "Failed to grade answer" }, { status: 500 })
  }
}

