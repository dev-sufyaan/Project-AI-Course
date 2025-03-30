import { NextResponse } from "next/server"
import { generateGeminiResponse, createJsonPrompt } from "@/lib/gemini-api"

export async function POST(request: Request) {
  try {
    const { questionId, code, language, testCases } = await request.json()

    // Create prompt for Gemini
    const prompt = `Evaluate the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Test cases:
${testCases.map((tc: string) => `- ${tc}`).join("\n")}

Analyze the code and determine if it passes all test cases. Provide:
1. Whether the code passes all test cases (true/false)
2. Detailed feedback explaining any issues or suggesting improvements
3. If there are errors, explain how to fix them

Format your feedback as markdown with:
- Clear headings (## for sections)
- Code examples in \`\`\` blocks
- Bullet points for issues
- **Bold** for important points
- A summary of suggestions at the end

Format your response as a structured JSON object with the following format:
{
  "passed": true/false,
  "feedback": "Detailed markdown feedback here..."
}`

    // Generate code evaluation from Gemini
    const response = await generateGeminiResponse([createJsonPrompt(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    // Parse the response as JSON, handling markdown code blocks if present
    let evaluation
    try {
      // Check if the response contains markdown code blocks
      let jsonString = response

      // Extract JSON from markdown code blocks if present
      const codeBlockMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonString = codeBlockMatch[1]
      }

      // Try to parse the JSON
      evaluation = JSON.parse(jsonString)

      // Validate the required structure
      if (typeof evaluation.passed !== "boolean" || typeof evaluation.feedback !== "string") {
        throw new Error("Invalid code evaluation structure")
      }
    } catch (error) {
      console.error("Error parsing code evaluation JSON:", error, "Raw response:", response)
      // Provide a fallback evaluation
      return NextResponse.json({
        passed: false,
        feedback: "Unable to evaluate your code automatically. Please check your code for syntax errors.",
      })
    }

    return NextResponse.json({
      passed: evaluation.passed,
      feedback: evaluation.feedback,
    })
  } catch (error) {
    console.error("Error checking code:", error)
    return NextResponse.json({ error: "Failed to check code" }, { status: 500 })
  }
}

