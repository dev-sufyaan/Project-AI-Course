"use client"

import { useState, useEffect } from "react"
import { useAssessmentStore, type CodingQuestion as CodingQuestionType } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), { ssr: false })

interface CodingQuestionProps {
  question: CodingQuestionType
}

export function CodingQuestion({ question }: CodingQuestionProps) {
  const [code, setCode] = useState(question.starterCode)
  const [isRunning, setIsRunning] = useState(false)
  const { setUserAnswer, userAnswers, setShowExplanationPanel, setCurrentExplanation } = useAssessmentStore()

  const savedAnswer = userAnswers[question.id]
  const isAnswered = savedAnswer?.answer !== undefined

  // Reset code to starter code when question changes
  useEffect(() => {
    setCode(question.starterCode)
  }, [question.id, question.starterCode])

  useEffect(() => {
    if (!code && question.starterCode) {
      setCode(question.starterCode)
    }
  }, [question.starterCode, code])

  const handleRunCode = async () => {
    if (!code.trim() || isRunning) return

    setIsRunning(true)

    try {
      const response = await fetch("/api/gemini/checkCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          code,
          language: question.language,
          testCases: question.testCases,
          formatAsMarkdown: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to check code")
      }

      const data = await response.json()

      setUserAnswer(question.id, {
        questionId: question.id,
        answer: code,
        isCorrect: data.passed,
        feedback: data.feedback,
      })

      // Show feedback in explanation panel
      setCurrentExplanation(`
# Code Evaluation

## Result: ${data.passed ? "✅ Passed" : "❌ Failed"}

\`\`\`${question.language.toLowerCase()}
${code}
\`\`\`

## Feedback:
${data.feedback}
      `)
      setShowExplanationPanel(true)
    } catch (error) {
      console.error("Error checking code:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleViewFeedback = () => {
    if (savedAnswer && savedAnswer.feedback) {
      setCurrentExplanation(`
# Code Evaluation

## Result: ${savedAnswer.isCorrect ? "✅ Passed" : "❌ Failed"}

\`\`\`${question.language.toLowerCase()}
${savedAnswer.answer as string}
\`\`\`

## Feedback:
${savedAnswer.feedback}
      `)
      setShowExplanationPanel(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium leading-relaxed">{question.question}</div>

      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted p-2 flex justify-between items-center">
          <Badge variant="outline">{question.language}</Badge>
          {!isAnswered && (
            <Button size="sm" onClick={handleRunCode} disabled={isRunning || !code.trim()}>
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-3 w-3" />
                  Run Code
                </>
              )}
            </Button>
          )}
        </div>

        <div className="h-[500px] w-full">
          <MonacoEditor
            height="500px"
            language={question.language.toLowerCase()}
            value={isAnswered ? (savedAnswer.answer as string) : code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 16,
              lineNumbers: "on",
              readOnly: isAnswered,
              automaticLayout: true,
              wordWrap: "on",
              padding: { top: 16 },
            }}
            theme="vs-dark"
          />
        </div>
      </div>

      {isAnswered && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Results
              <Badge className={savedAnswer.isCorrect ? "bg-green-500" : "bg-red-500"}>
                {savedAnswer.isCorrect ? "Passed" : "Failed"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {savedAnswer.isCorrect
                ? "Great job! Your code passed all test cases."
                : "Your code didn't pass all test cases. Review the feedback and try again."}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={handleViewFeedback}>
              View Detailed Feedback
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

