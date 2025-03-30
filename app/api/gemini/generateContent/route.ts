import { NextResponse } from "next/server"
import { generateGeminiResponse, createUserMessage } from "@/lib/gemini-api"
import type { CourseContent, LearningPreferences } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const { subject, topic, userProfile, previousContent } = await request.json()

    // Extract learning preferences
    const preferences: LearningPreferences = userProfile?.learningPreferences || {
      difficulty: "intermediate",
      learningStyle: "text",
      language: "english",
    }

    // Create prompt for Gemini
    const prompt = `Generate educational content for a ${subject} course. 
The topic is: ${topic}.

User learning preferences:
- Difficulty level: ${preferences.difficulty}

Format the content with clear markdown. Include:
1. A clear title (use # for heading)
2. An introduction to the topic (2-3 paragraphs)
3. Main content with explanations organized with proper headings (## for section headings)
4. Multiple detailed examples that demonstrate practical applications (use code blocks with \`\`\` for code examples)
5. Real-world applications and where this knowledge is used in industry or daily life
6. A brief summary

Make the content in-depth and comprehensive. Provide multiple examples for each concept.
Keep the content educational, accurate, and engaging. Tailor it to the user's difficulty level.

${preferences.difficulty === "beginner" ? "Keep explanations simple and avoid complex terminology without explanation." : ""}
${preferences.difficulty === "intermediate" ? "Balance between fundamental concepts and more advanced topics." : ""}
${preferences.difficulty === "advanced" ? "Include in-depth explanations and advanced concepts." : ""}

Ensure the content is well-structured, easy to read, and visually appealing.
Use proper markdown formatting:
- Use # for main title
- Use ## for section headings
- Use ### for subsection headings
- Use **bold** for important terms
- Use *italic* for emphasis
- Use \`code\` for inline code
- Use \`\`\` for code blocks
- Use > for blockquotes
- Use - or * for bullet points
- Use 1. 2. 3. for numbered lists
- Use --- for horizontal rules to separate sections`

    // Generate content from Gemini
    const content = await generateGeminiResponse([createUserMessage(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 8192,
    })

    // Create course content object
    const courseContent: CourseContent = {
      id: `${subject}-${topic}-${Date.now()}`,
      title: topic,
      content,
      order: previousContent ? previousContent.order + 1 : 1,
    }

    return NextResponse.json({ courseContent })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate course content" }, { status: 500 })
  }
}

