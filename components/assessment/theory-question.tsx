"use client"

import { useState, useEffect } from "react"
import { useAssessmentStore, type TheoryQuestion as TheoryQuestionType } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react"

interface TheoryQuestionProps {
  question: TheoryQuestionType
}

export function TheoryQuestion({ question }: TheoryQuestionProps) {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUserAnswer, userAnswers, setShowExplanationPanel, setCurrentExplanation } = useAssessmentStore()

  const savedAnswer = userAnswers[question.id]
  const isAnswered = savedAnswer?.answer !== undefined

  // Reset answer when question changes
  useEffect(() => {
    setAnswer("")
  }, [question.id])

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/gemini/gradeTheory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          answer,
          criteria: question.criteria,
          maxScore: question.maxScore,
          formatAsMarkdown: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to grade answer")
      }

      const data = await response.json()

      setUserAnswer(question.id, {
        questionId: question.id,
        answer,
        score: data.score,
        feedback: data.feedback,
        isCorrect: data.score >= question.maxScore * 0.7, // Mark as correct if score is at least 70%
      })

      // Show feedback in explanation panel
      setCurrentExplanation(`
# Evaluation Results

## Score: ${data.score}/${question.maxScore}

## Feedback:
${data.feedback}
    `)
      setShowExplanationPanel(true)
    } catch (error) {
      console.error("Error grading answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewFeedback = () => {
    if (savedAnswer && savedAnswer.feedback) {
      setCurrentExplanation(`
# Evaluation Results

## Score: ${savedAnswer.score}/${question.maxScore}

## Feedback:
${savedAnswer.feedback}
    `)
      setShowExplanationPanel(true)
    }
  }

  // Check if answer is correct (score is at least 70% of maximum)
  const isCorrect = savedAnswer && savedAnswer.score !== undefined && savedAnswer.score >= question.maxScore * 0.7

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium leading-relaxed">{question.question}</div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Grading Criteria:</div>
        <div className="flex flex-wrap gap-2">
          {question.criteria.map((criterion, index) => (
            <Badge key={index} variant="outline" className="bg-muted">
              {criterion}
            </Badge>
          ))}
        </div>
      </div>

      {!isAnswered ? (
        <div className="space-y-4">
          <Textarea
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[200px]"
          />

          <Button onClick={handleSubmit} disabled={!answer.trim() || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Answer
              </>
            )}
          </Button>
        </div>
      ) : (
        <Card className={isCorrect ? "border-green-500/30" : "border-amber-500/30"}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                )}
                Your Answer
              </div>
              <Badge className={isCorrect ? "bg-green-500" : "bg-amber-500"}>
                Score: {savedAnswer.score}/{question.maxScore}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{savedAnswer.answer as string}</div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button variant="outline" size="sm" onClick={handleViewFeedback} className="mt-2">
              View Detailed Feedback
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

