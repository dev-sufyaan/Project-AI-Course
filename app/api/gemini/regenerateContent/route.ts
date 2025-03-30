import { NextResponse } from "next/server"
import { generateGeminiResponse, createUserMessage } from "@/lib/gemini-api"
import type { CourseContent, LearningPreferences } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const { subject, userMessage, userProfile, currentContent } = await request.json()

    // Extract learning preferences
    const preferences: LearningPreferences = userProfile?.learningPreferences || {
      difficulty: "intermediate",
      pacing: "standard",
      explanationDetail: "balanced",
      examplePreference: "moderate",
    }

    // Analyze user request to understand what they want to modify
    const simplifyRequest = /simpl(e|ify|er)|easier|basic/i.test(userMessage)
    const advancedRequest = /advanc(e|ed)|complex|more detailed|in-?depth/i.test(userMessage)
    const moreExamplesRequest = /more examples|example/i.test(userMessage)
    const explainRequest = /explain|clarify|elaborate/i.test(userMessage)
    const childExplainRequest = /explain (?:like|as if) (?:I'?m|I am) (?:a )?\d+/i.test(userMessage)

    // Create prompt for Gemini
    const prompt = `Regenerate educational content for a ${subject} course. The current topic is "${currentContent.title}".

The user has requested: "${userMessage}"

Based on their request, I need you to:
${simplifyRequest ? "- Simplify the content, use more accessible language and explanations" : ""}
${advancedRequest ? "- Make the content more advanced, go into deeper technical details" : ""}
${moreExamplesRequest ? "- Include more examples to illustrate the concepts" : ""}
${explainRequest ? "- Provide more thorough explanations of concepts" : ""}
${childExplainRequest ? "- Explain concepts in very simple terms, as if to a young learner" : ""}

User learning preferences:
- Difficulty level: ${preferences.difficulty}
- Pacing: ${preferences.pacing}
- Explanation detail: ${preferences.explanationDetail}
- Example preference: ${preferences.examplePreference}
${preferences.customPreferences ? `- Custom preferences: ${preferences.customPreferences}` : ""}

Format the content with clear markdown. Include:
1. A clear title (use # for heading)
2. An introduction to the topic (2-3 paragraphs)
3. Main content with explanations organized with proper headings (## for section headings)
4. ${preferences.examplePreference === "extensive" ? "Numerous" : preferences.examplePreference === "minimal" ? "A few key" : "Multiple"} examples that demonstrate practical applications (use code blocks with \`\`\` for code examples)
5. Real-world applications and where this knowledge is used in industry or daily life
6. A brief summary

Make the content ${preferences.explanationDetail === "detailed" ? "comprehensive with thorough explanations" : preferences.explanationDetail === "concise" ? "clear and to-the-point" : "balanced between detail and brevity"}.
The pace should be ${preferences.pacing === "accelerated" ? "faster with quick progression between concepts" : preferences.pacing === "slow" ? "gradual with careful explanation of each step" : "standard with moderate progression"}.

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
- Use --- for horizontal rules to separate sections

Current content to regenerate:
${currentContent.content}

Please maintain the same topic and learning objectives, but adapt the content according to the user's request and preferences.`

    // Generate content from Gemini
    const content = await generateGeminiResponse([createUserMessage(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 8192, // Increased token limit for more comprehensive content
    })

    // Create course content object
    const courseContent: CourseContent = {
      id: `${subject}-${currentContent.title}-${Date.now()}`,
      title: currentContent.title,
      content,
      order: currentContent.order,
    }

    return NextResponse.json({ courseContent })
  } catch (error) {
    console.error("Error regenerating content:", error)
    return NextResponse.json({ error: "Failed to regenerate course content" }, { status: 500 })
  }
}

// Helper function to analyze markdown structure
function analyzeMarkdownStructure(markdown: string) {
  const result = {
    headingLevels: [] as string[],
    codeBlocks: 0,
    bulletLists: 0,
    numberLists: 0,
    blockquotes: 0,
  };

  // Detect headings and their levels
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(markdown)) !== null) {
    result.headingLevels.push(headingMatch[1]);
  }

  // Count code blocks
  const codeBlockMatches = markdown.match(/```[\s\S]*?```/g);
  result.codeBlocks = codeBlockMatches ? codeBlockMatches.length : 0;

  // Count bullet lists
  const bulletListMatches = markdown.match(/^(\s*[-*+]\s+.+)$/gm);
  result.bulletLists = bulletListMatches ? bulletListMatches.length : 0;

  // Count numbered lists
  const numberListMatches = markdown.match(/^(\s*\d+\.\s+.+)$/gm);
  result.numberLists = numberListMatches ? numberListMatches.length : 0;

  // Count blockquotes
  const blockquoteMatches = markdown.match(/^>\s+.+/gm);
  result.blockquotes = blockquoteMatches ? blockquoteMatches.length : 0;

  return result;
}

