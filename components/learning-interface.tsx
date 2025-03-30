"use client"

import { useEffect } from "react"
import { useAssessmentStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "./chat-interface"
import { AssessmentPanel } from "./assessment/assessment-panel"
import { BookOpen, BookMarked } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface LearningInterfaceProps {
  subject: string
}

export function LearningInterface({ subject }: LearningInterfaceProps) {
  const { 
    setCurrentSubject, 
    togglePanel, 
    isPanelOpen, 
    enrollInCourse, 
    enrolledCourses, 
    resetCourseContents,
    courseContents,
    currentContentIndex
  } = useAssessmentStore()

  useEffect(() => {
    // Reset course contents when changing subjects
    resetCourseContents()

    setCurrentSubject(subject)

    // Auto-enroll if not already enrolled
    if (!enrolledCourses.includes(subject)) {
      enrollInCourse(subject)
    }
  }, [subject, setCurrentSubject, enrollInCourse, enrolledCourses, resetCourseContents])

  const subjectDisplayNames: Record<string, string> = {
    python: "Python Programming",
    arabic: "Classical Arabic Grammar",
    math: "Advanced Mathematics",
    literature: "World Literature",
    english: "English Language",
  }

  const displayName = subjectDisplayNames[subject] || subject
  
  // Determine if content should be displayed as RTL
  const isRTLContent = () => {
    if (!courseContents || courseContents.length === 0) return false;
    
    const currentContent = courseContents[currentContentIndex]?.content || '';
    // Check for Arabic language indicators
    return (
      currentContent.toLowerCase().includes('arabic') || 
      currentContent.toLowerCase().includes('عربي') || 
      currentContent.toLowerCase().includes('العربية')
    );
  };

  // Add custom CSS for consistent markdown rendering across languages
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .course-content-prose {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
      }
      .course-content-prose h1, .course-content-prose h2, .course-content-prose h3, 
      .course-content-prose h4, .course-content-prose h5, .course-content-prose h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
        line-height: 1.25;
      }
      .course-content-prose p {
        margin-top: 0.5em;
        margin-bottom: 1em;
      }
      .course-content-prose ul, .course-content-prose ol {
        margin-top: 0.5em;
        margin-bottom: 1em;
        padding-left: 1.5em;
      }
      .course-content-prose li {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
      .course-content-prose blockquote {
        border-left: 4px solid #e2e2e2;
        padding-left: 1em;
        color: #6b7280;
        margin: 1em 0;
      }
      .course-content-prose table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      .course-content-prose th, .course-content-prose td {
        border: 1px solid #e2e2e2;
        padding: 0.5em;
      }
      .course-content-prose pre {
        background-color: #1e1e1e;
        border-radius: 0.375rem;
        padding: 1rem;
        margin: 1rem 0;
        overflow-x: auto;
      }
      .course-content-prose code {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 0.25rem;
        padding: 0.2rem 0.4rem;
        font-family: monospace;
      }
      .course-content-prose pre code {
        background-color: transparent;
        padding: 0;
        color: #e2e2e2;
      }
      /* RTL support */
      [dir="rtl"].course-content-prose {
        text-align: right;
      }
      [dir="rtl"].course-content-prose blockquote {
        border-left: none;
        border-right: 4px solid #e2e2e2;
        padding-left: 0;
        padding-right: 1em;
      }
      [dir="rtl"].course-content-prose ul, [dir="rtl"].course-content-prose ol {
        padding-left: 0;
        padding-right: 1.5em;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold">{displayName}</h2>
          <p className="text-muted-foreground mt-1">Learn at your own pace with AI-powered assistance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/enrolled">
            <Button variant="outline" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              My Courses
            </Button>
          </Link>
          <Button onClick={togglePanel} className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {isPanelOpen ? "Close Assessment" : "Start Assessment"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {courseContents && courseContents.length > 0 ? (
            <div 
              className="course-content-prose prose prose-lg dark:prose-invert max-w-none" 
              dir={isRTLContent() ? 'rtl' : 'ltr'}
            >
              <ReactMarkdown>
                {courseContents[currentContentIndex]?.content || ''}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3>Welcome to {displayName}</h3>
              <p>
                This interactive learning module will guide you through the fundamentals and advanced concepts of{" "}
                {displayName.toLowerCase()}. You can ask questions using the AI chat assistant, or test your knowledge
                with the assessment panel.
              </p>

              {subject === "python" && (
                <>
                  <h4>Getting Started with Python</h4>
                  <p>
                    Python is a high-level, interpreted programming language known for its readability and versatility.
                    It's widely used in web development, data science, artificial intelligence, and more.
                  </p>
                  <pre className="bg-muted p-4 rounded-md">
                    <code>
                      {`# Your first Python program
print("Hello, World!")

# Variables and data types
name = "Python Learner"
age = 25
is_student = True

print(f"Name: {name}, Age: {age}, Student: {is_student}")`}
                    </code>
                  </pre>
                </>
              )}

              {subject === "arabic" && (
                <>
                  <h4>Introduction to Arabic Grammar</h4>
                  <p>
                    Classical Arabic grammar is the foundation of the Arabic language, with a rich history dating back
                    centuries. Understanding its structure is key to mastering the language.
                  </p>
                  <p>
                    The Arabic sentence structure typically follows either the verbal sentence (الجملة الفعلية) pattern or
                    the nominal sentence (الجملة الاسمية) pattern.
                  </p>
                </>
              )}

              {subject === "math" && (
                <>
                  <h4>Advanced Mathematics Concepts</h4>
                  <p>
                    This module covers calculus, linear algebra, and differential equations - the building blocks of
                    advanced mathematics.
                  </p>
                  <p>
                    The fundamental theorem of calculus establishes the relationship between differentiation and
                    integration, two core concepts in calculus.
                  </p>
                  <div className="text-center my-4">
                    <p className="text-lg">
                      $$\int_{a}^{b} f'(x) dx = f(b) - f(a)$$
                    </p>
                  </div>
                </>
              )}

              {subject === "literature" && (
                <>
                  <h4>Exploring World Literature</h4>
                  <p>
                    World literature encompasses literary works from cultures around the globe, offering insights into
                    diverse perspectives and human experiences.
                  </p>
                  <blockquote>
                    "A reader lives a thousand lives before he dies. The man who never reads lives only one." - George
                    R.R. Martin
                  </blockquote>
                </>
              )}

              {subject === "english" && (
                <>
                  <h4>English Language Fundamentals</h4>
                  <p>
                    English is a West Germanic language that originated from Anglo-Frisian dialects brought to Britain in
                    the mid 5th to 7th centuries AD by Anglo-Saxon migrants.
                  </p>
                  <p>
                    Today, English is the third most spoken native language in the world, after Mandarin and Spanish. It
                    has become the leading language of international discourse and the lingua franca in many regions and
                    professional contexts such as science, navigation, and law.
                  </p>
                  <h5>Basic Sentence Structure</h5>
                  <p>English follows a Subject-Verb-Object (SVO) structure:</p>
                  <ul>
                    <li>
                      <strong>Subject:</strong> The person or thing performing the action
                    </li>
                    <li>
                      <strong>Verb:</strong> The action being performed
                    </li>
                    <li>
                      <strong>Object:</strong> The recipient of the action
                    </li>
                  </ul>
                  <p>
                    Example: <em>She (subject) reads (verb) books (object).</em>
                  </p>
                </>
              )}

              <h4>How to Use This Module</h4>
              <ol>
                <li>Read through the content provided in this section</li>
                <li>Use the AI chat assistant to ask questions or get clarification</li>
                <li>Test your knowledge with the assessment panel</li>
                <li>Review explanations for any incorrect answers</li>
                <li>Try reinforcement questions to strengthen your understanding</li>
              </ol>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <ChatInterface />
        </div>
      </div>

      <AssessmentPanel />
    </div>
  )
}

