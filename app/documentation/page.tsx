import { MainLayout } from "@/components/main-layout"
import Link from "next/link"

export default function DocumentationPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-heading font-bold mb-6">Documentation</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Getting Started</h2>
          <p>
            Welcome to our AI-powered Learning Platform! This comprehensive documentation will help you understand how to use the
            platform effectively and get the most out of your learning experience.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>
              <strong>Personalized Learning:</strong> Our platform adapts to your learning style, knowledge level, and
              preferences to create a tailored educational experience.
              <ul>
                <li>Customizable difficulty levels (beginner, intermediate, advanced)</li>
                <li>Support for different learning styles (visual, auditory, reading, kinesthetic)</li>
                <li>Language preferences and customization options</li>
              </ul>
            </li>
            <li>
              <strong>AI Assistant:</strong> Get instant help and explanations from our AI learning assistant.
              <ul>
                <li>Contextual explanations based on your current topic</li>
                <li>Ability to simplify complex concepts on request</li>
                <li>Support for multiple languages and learning styles</li>
              </ul>
            </li>
            <li>
              <strong>Interactive Assessments:</strong> Test your knowledge with adaptive quizzes and coding challenges.
              <ul>
                <li>Multiple question types (MCQ, theory, coding challenges)</li>
                <li>Instant feedback and detailed explanations</li>
                <li>Progression tracking with minimum passing requirements</li>
                <li>Option to retake assessments if needed</li>
              </ul>
            </li>
            <li>
              <strong>Detailed Course Index:</strong> Navigate through course topics with ease.
              <ul>
                <li>Comprehensive overview of all course topics</li>
                <li>Visual indicators for completed, current, and locked topics</li>
                <li>Detailed learning objectives for each topic</li>
                <li>Quick navigation to any accessible topic</li>
              </ul>
            </li>
            <li>
              <strong>Progress Tracking:</strong> Monitor your learning journey across different subjects.
              <ul>
                <li>Visual progress indicators for each course</li>
                <li>Test score history and performance analytics</li>
                <li>Achievement badges for completed topics</li>
              </ul>
            </li>
          </ul>

          <h2>Using the AI Assistant</h2>
          <p>
            The AI assistant is one of the most powerful features of our platform. Here's how to use it effectively to enhance your learning:
          </p>

          <h3>Asking Questions</h3>
          <p>
            You can ask the AI assistant any questions related to the current topic you're learning. The assistant has
            access to the course content and can provide detailed explanations.
          </p>
          
          <h4>Best Practices for Effective Questions:</h4>
          <ul>
            <li>Be specific about what concept you need help with</li>
            <li>Mention your current understanding level to get appropriate explanations</li>
            <li>Ask for examples if theoretical explanations aren't clear</li>
            <li>Request step-by-step breakdowns for complex processes</li>
          </ul>

          <h3>Modifying Content</h3>
          <p>
            If you find the content too difficult, too easy, or want it in a different format, you can ask the AI to
            modify it. Here are some effective requests you can make:
          </p>
          <ul>
            <li>"Can you explain this in simpler terms?"</li>
            <li>"Change the language to Hindi"</li>
            <li>"Give me more practical examples of this concept"</li>
            <li>"Make this content more advanced - I already understand the basics"</li>
            <li>"Explain this like I'm 10 years old"</li>
            <li>"Can you provide more visual explanations?"</li>
            <li>"I need more details about [specific concept]"</li>
          </ul>
          <p>The AI will ask for confirmation before making significant changes to ensure it's what you want.</p>

          <h2>Course Navigation and Structure</h2>
          
          <h3>Detailed Course Index</h3>
          <p>
            Each course has a comprehensive index that provides a complete overview of all topics covered. You can access this by clicking the "Course
            Index" button at the top of any course page.
          </p>
          
          <h4>The Course Index provides:</h4>
          <ul>
            <li><strong>Topic Overview:</strong> Complete list of all topics in the course</li>
            <li><strong>Progress Tracking:</strong> Visual indicators showing completed, current, and upcoming topics</li>
            <li><strong>Learning Objectives:</strong> Detailed information about what you'll learn in each topic</li>
            <li><strong>Assessment Status:</strong> Information about which assessments you've passed or still need to complete</li>
            <li><strong>Quick Navigation:</strong> Ability to jump directly to any accessible topic</li>
            <li><strong>Access Control:</strong> Topics are locked until you've passed assessments for prerequisite topics</li>
          </ul>

          <h3>Topic Progression System</h3>
          <p>Our platform uses a structured progression system to ensure effective learning:</p>
          <ol>
            <li><strong>Study the current topic content</strong> - Read through and understand the material presented</li>
            <li><strong>Take the assessment</strong> - Complete all questions to test your understanding</li>
            <li><strong>Pass with minimum 50% score</strong> - You must achieve this minimum score to progress</li>
            <li><strong>Proceed to next topic</strong> - Once passed, you can move to the next topic</li>
          </ol>
          
          <p><strong>Important:</strong> If you don't pass an assessment, you won't be able to proceed to the next topic. The system will automatically 
          prompt you to retake the assessment when you try to move forward.</p>

          <h2>Assessment System</h2>
          <p>Our comprehensive assessment system helps you test your understanding and reinforces your learning:</p>

          <h3>Question Types</h3>
          <ul>
            <li>
              <strong>Multiple Choice Questions (MCQs):</strong> 
              <ul>
                <li>Test factual knowledge and conceptual understanding</li>
                <li>Four options per question with one correct answer</li>
                <li>Instant feedback after selection</li>
                <li>Detailed explanations for correct and incorrect answers</li>
              </ul>
            </li>
            <li>
              <strong>Theory Questions:</strong> 
              <ul>
                <li>Demonstrate your deeper understanding through written responses</li>
                <li>AI-powered grading based on specific criteria</li>
                <li>Detailed feedback on your answer's strengths and weaknesses</li>
                <li>Scored on a scale matching the question's complexity</li>
              </ul>
            </li>
            <li>
              <strong>Coding Challenges:</strong> 
              <ul>
                <li>Apply programming knowledge in a real coding environment</li>
                <li>Available only in programming-related courses</li>
                <li>Includes starter code and test cases</li>
                <li>Automatic testing against expected outputs</li>
              </ul>
            </li>
          </ul>

          <h3>Assessment Structure</h3>
          <p>The assessment structure varies based on the course type:</p>
          <ul>
            <li>
              <strong>Programming Courses:</strong> 10 questions total
              <ul>
                <li>4 Multiple choice questions</li>
                <li>3 Theory questions</li>
                <li>3 Coding challenges</li>
              </ul>
            </li>
            <li>
              <strong>General Courses:</strong> 10 questions total
              <ul>
                <li>5 Multiple choice questions</li>
                <li>5 Theory questions</li>
              </ul>
            </li>
          </ul>

          <h3>Passing Criteria and Reattempts</h3>
          <p>
            To progress to the next topic, you must achieve a minimum score of 50% on the current topic's assessment.
          </p>
          <ul>
            <li><strong>If you pass (≥50%):</strong> You can proceed to the next topic immediately</li>
            <li><strong>If you don't pass (&lt;50%):</strong>
              <ul>
                <li>You'll need to review the material</li>
                <li>Use the "Reattempt Quiz" button to take the assessment again</li>
                <li>The system will generate a new set of questions</li>
                <li>You can attempt the assessment as many times as needed</li>
              </ul>
            </li>
          </ul>

          <h3>Assessment Feedback</h3>
          <p>After completing an assessment, you'll receive:</p>
          <ul>
            <li>Overall score as a percentage</li>
            <li>Pass/fail status</li>
            <li>Question-by-question feedback</li>
            <li>Detailed explanations for each question</li>
            <li>For theory questions, specific feedback on your response</li>
          </ul>

          <h2>Technical Requirements and Troubleshooting</h2>
          <p>Our platform works best with:</p>
          <ul>
            <li><strong>Web Browsers:</strong> Chrome (v90+), Firefox (v85+), Safari (v14+), Edge (v90+)</li>
            <li><strong>Internet Connection:</strong> Minimum 1 Mbps, 5+ Mbps recommended</li>
            <li><strong>Device Requirements:</strong>
              <ul>
                <li>Desktop/Laptop: Any modern computer with 4GB+ RAM</li>
                <li>Mobile: Modern smartphone or tablet with updated browser</li>
              </ul>
            </li>
            <li><strong>Settings:</strong> JavaScript enabled, cookies enabled for session management</li>
          </ul>
          
          <h3>Common Issues and Solutions</h3>
          <ul>
            <li>
              <strong>Content not loading:</strong> Try refreshing the page or clearing your browser cache
            </li>
            <li>
              <strong>Assessment not submitting:</strong> Check your internet connection and try again
            </li>
            <li>
              <strong>AI responses slow:</strong> This can happen during high traffic periods, please be patient
            </li>
          </ul>

          <h2>Need Help?</h2>
          <p>
            If you encounter any issues or have questions about the platform, please visit our{" "}
            <Link href="/about" className="text-primary hover:underline">
              About page
            </Link>{" "}
            or contact our support team at support@learningplatform.com.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

