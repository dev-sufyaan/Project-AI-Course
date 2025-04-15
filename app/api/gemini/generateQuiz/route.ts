import { NextResponse } from "next/server"
import { generateGeminiResponse, createJsonPrompt } from "@/lib/gemini-api"
import type { Assessment } from "@/lib/store"

// Define an interface for quiz questions
interface QuizQuestion {
  type: string;
  category?: string;
  question: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  explanation?: string;
}

export async function POST(request: Request) {
  try {
    const { subject, topic, courseContent } = await request.json()

    // Determine if this is a programming course
    const isProgrammingCourse = ["python", "web_development", "data_science", "javascript", "java", "c++"].includes(
      subject.toLowerCase(),
    )

    // Create prompt for Gemini based on course type
    const prompt = `Generate an assessment quiz for a ${subject} course based on the following content:
    
    ${courseContent.content}
    
    Create a quiz with 10 multiple-choice questions (MCQs) with the following distribution:
    1. 4 theory/concept-related MCQs that test understanding of basic concepts and terminology
    2. 4 code/syntax-related MCQs that test understanding of programming syntax and structure
    3. 2 problem-solving and practical usage MCQs that test application of concepts
    
    Each MCQ should have 4 options with exactly one correct answer.
    
    Format your response as a structured JSON object with the following format:
    {
      "title": "Quiz title",
      "questions": [
        {
          "type": "mcq",
          "category": "theory", // one of: "theory", "code", "problem-solving"
          "question": "Question text",
          "options": [
            {"id": "a", "text": "Option A", "isCorrect": false},
            {"id": "b", "text": "Option B", "isCorrect": true},
            {"id": "c", "text": "Option C", "isCorrect": false},
            {"id": "d", "text": "Option D", "isCorrect": false}
          ],
          "explanation": "Explanation of the correct answer"
        }
      ]
    }
    
    Make sure the questions are directly related to the content provided.
    The passing score for this assessment is 50%.
    IMPORTANT: Return ONLY the JSON object with no additional text, markdown formatting, or code blocks.`

    // Generate quiz from Gemini
    const response = await generateGeminiResponse([createJsonPrompt(prompt)], {
      temperature: 0.7,
      maxOutputTokens: 2048,
    })

    // Parse the response as JSON, handling markdown code blocks if present
    let quizData
    try {
      // Check if the response contains markdown code blocks and extract the JSON
      let jsonString = response.trim()

      // More comprehensive regex to handle code blocks with or without language specification
      // This will match code blocks like ```json, ``` or just the content if it looks like JSON
      const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g
      const match = codeBlockRegex.exec(jsonString)

      if (match && match[1]) {
        jsonString = match[1].trim()
      } else {
        // If no code block found, try to clean up the string
        // Remove any leading/trailing backticks or json tags
        jsonString = jsonString
          .replace(/^```(?:json)?\s*/m, "")
          .replace(/\s*```$/m, "")
          .trim()
          
        // If the string starts with a { and ends with a }, it's likely JSON already
        if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) {
          // Try to extract just the JSON part
          const jsonObjectMatch = jsonString.match(/(\{[\s\S]*\})/);
          if (jsonObjectMatch && jsonObjectMatch[1]) {
            jsonString = jsonObjectMatch[1].trim();
          }
        }
      }

      try {
        // Try to parse the JSON
        quizData = JSON.parse(jsonString)
      } catch (parseError) {
        // If parsing fails, attempt to fix incomplete JSON
        console.log("Initial parsing failed, attempting to fix JSON:", (parseError as Error).message)
        
        // Look for truncated strings in MCQ questions
        const fixedJson = jsonString.replace(
          /(\"question\"\s*:\s*\"[^\"]*)(,|\}|\])/g, 
          '$1"$2'
        ).replace(
          /(\"text\"\s*:\s*\"[^\"]*)(,|\}|\])/g,
          '$1"$2'
        ).replace(
          /(\"explanation\"\s*:\s*\"[^\"]*)(,|\}|\])/g,
          '$1"$2'
        );
        
        // Try again with the fixed JSON
        quizData = JSON.parse(fixedJson)
      }

      // Validate the required structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid quiz data structure")
      }
    } catch (error) {
      console.error("Error parsing quiz JSON:", error, "Raw response:", response)

      // Attempt a more aggressive cleanup and parsing
      try {
        // Find anything that looks like a JSON object
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        let extractedJson = ""
        
        if (jsonMatch) {
          extractedJson = jsonMatch[0]
          
          // Fix potential unterminated strings - add missing quotes to any property
          // that appears to have an unterminated string
          extractedJson = extractedJson.replace(/("(?:[^"\\]|\\.)*?)(?=,|]|})/g, '$1"')
          
          // Create a minimal valid JSON if everything else fails
          try {
            quizData = JSON.parse(extractedJson)
          } catch (finalError) {
            console.error("Cannot parse JSON even after fixes:", finalError)
            
            // Create a fallback quiz if everything fails - all MCQs
            quizData = {
              title: `Assessment for ${subject} - ${topic}`,
              questions: [
                {
                  type: "mcq",
                  category: "theory",
                  question: "What is the main topic of this course?",
                  options: [
                    {id: "a", text: "Option A", isCorrect: false},
                    {id: "b", text: `${topic}`, isCorrect: true},
                    {id: "c", text: "Option C", isCorrect: false},
                    {id: "d", text: "Option D", isCorrect: false}
                  ],
                  explanation: "This is the main topic of the course."
                },
                {
                  type: "mcq",
                  category: "code",
                  question: "Which of the following code examples is correct?",
                  options: [
                    {id: "a", text: "Option A", isCorrect: false},
                    {id: "b", text: "Option B", isCorrect: true},
                    {id: "c", text: "Option C", isCorrect: false},
                    {id: "d", text: "Option D", isCorrect: false}
                  ],
                  explanation: "Option B follows the correct syntax."
                }
              ]
            }
          }
          
          if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error("Invalid quiz data structure after cleanup")
          }
        } else {
          throw new Error("Could not find valid JSON in response")
        }
      } catch (secondError) {
        console.error("Second attempt at parsing failed:", secondError)
        
        // Create a fallback quiz with MCQs if everything fails
        quizData = {
          title: `Assessment for ${subject} - ${topic}`,
          questions: [
            {
              type: "mcq",
              category: "theory",
              question: "What is the main topic of this course?",
              options: [
                {id: "a", text: "Option A", isCorrect: false},
                {id: "b", text: `${topic}`, isCorrect: true},
                {id: "c", text: "Option C", isCorrect: false},
                {id: "d", text: "Option D", isCorrect: false}
              ],
              explanation: "This is the main topic of the course."
            },
            {
              type: "mcq",
              category: "code",
              question: "Which of the following code examples is correct?",
              options: [
                {id: "a", text: "Option A", isCorrect: false},
                {id: "b", text: "Option B", isCorrect: true},
                {id: "c", text: "Option C", isCorrect: false},
                {id: "d", text: "Option D", isCorrect: false}
              ],
              explanation: "Option B follows the correct syntax."
            }
          ]
        }
      }
    }

    // Verify we have the right distribution of question types
    // If we need to ensure exactly 10 questions with the right distribution
    const verifyQuestionDistribution = (questions: QuizQuestion[]) => {
      // Filter questions by category
      const theoryQuestions = questions.filter(q => q.category === "theory");
      const codeQuestions = questions.filter(q => q.category === "code");
      const problemSolvingQuestions = questions.filter(q => q.category === "problem-solving");
      
      // Check if we have the expected distribution (4-4-2)
      if (theoryQuestions.length < 4 || codeQuestions.length < 4 || problemSolvingQuestions.length < 2) {
        // If not, categorize uncategorized questions or adjust as needed
        questions.forEach(q => {
          if (!q.category) {
            // Assign default category if missing
            if (theoryQuestions.length < 4) {
              q.category = "theory";
            } else if (codeQuestions.length < 4) {
              q.category = "code";
            } else {
              q.category = "problem-solving";
            }
          }
        });
      }
      
      // Ensure all questions are MCQs
      questions.forEach(q => {
        q.type = "mcq";
        
        // Ensure options are valid
        if (!q.options || !Array.isArray(q.options) || q.options.length < 4) {
          q.options = [
            {id: "a", text: "Option A", isCorrect: false},
            {id: "b", text: "Option B", isCorrect: true},
            {id: "c", text: "Option C", isCorrect: false},
            {id: "d", text: "Option D", isCorrect: false}
          ];
        }
      });
      
      return questions;
    };
    
    // Verify and fix question distribution
    quizData.questions = verifyQuestionDistribution(quizData.questions as QuizQuestion[]);
    
    // Limit to 10 questions if we have more
    if (quizData.questions.length > 10) {
      // Keep the right distribution of question types
      const theoryQuestions = quizData.questions.filter((q: any) => q.category === "theory").slice(0, 4);
      const codeQuestions = quizData.questions.filter((q: any) => q.category === "code").slice(0, 4);
      const problemSolvingQuestions = quizData.questions.filter((q: any) => q.category === "problem-solving").slice(0, 2);
      
      quizData.questions = [...theoryQuestions, ...codeQuestions, ...problemSolvingQuestions];
    }

    // Create assessment object
    const assessment: Assessment = {
      id: `${subject}-${topic}-${Date.now()}`,
      title: quizData.title || `${topic} Assessment`,
      subject,
      questions: quizData.questions.map((q: any, index: number) => ({
        ...q,
        id: `${subject}-${topic}-q${index + 1}-${Date.now()}`,
      })),
    }

    return NextResponse.json({ assessment })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}

