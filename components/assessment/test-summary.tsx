"use client"

import type { Assessment, UserAnswer } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, HelpCircle, Code, BookOpen, Brain } from "lucide-react"

interface TestSummaryProps {
  assessment: Assessment
  userAnswers: Record<string, UserAnswer>
  currentIndex: number
  onSelectQuestion: (index: number) => void
}

export function TestSummary({ assessment, userAnswers, currentIndex, onSelectQuestion }: TestSummaryProps) {
  const getQuestionStatus = (questionId: string, index: number) => {
    const answer = userAnswers[questionId]

    if (!answer) {
      return (
        <Button
          variant="outline"
          size="sm"
          className={`w-8 h-8 p-0 ${currentIndex === index ? "border-primary bg-primary/10" : ""}`}
          onClick={() => onSelectQuestion(index)}
        >
          {index + 1}
        </Button>
      )
    }

    if (answer.isCorrect === true || (answer.score && answer.score >= 7)) {
      return (
        <Button
          variant="outline"
          size="sm"
          className={`w-8 h-8 p-0 border-green-500 bg-green-500/10 ${currentIndex === index ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectQuestion(index)}
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </Button>
      )
    } else if (answer.isCorrect === false || (answer.score && answer.score < 7)) {
      return (
        <Button
          variant="outline"
          size="sm"
          className={`w-8 h-8 p-0 border-red-500 bg-red-500/10 ${currentIndex === index ? "ring-2 ring-primary" : ""}`}
          onClick={() => onSelectQuestion(index)}
        >
          <XCircle className="h-4 w-4 text-red-500" />
        </Button>
      )
    }

    return (
      <Button
        variant="outline"
        size="sm"
        className={`w-8 h-8 p-0 ${currentIndex === index ? "border-primary bg-primary/10" : ""}`}
        onClick={() => onSelectQuestion(index)}
      >
        {index + 1}
      </Button>
    )
  }

  const getQuestionTypeIcon = (type: string, category?: string) => {
    if (type === "mcq" && category) {
      switch (category) {
        case "theory":
          return <BookOpen className="h-4 w-4 text-blue-500" />
        case "code":
          return <Code className="h-4 w-4 text-purple-500" />
        case "problem-solving":
          return <Brain className="h-4 w-4 text-orange-500" />
        default:
          return <HelpCircle className="h-4 w-4 text-muted-foreground" />
      }
    }
    
    switch (type) {
      case "mcq":
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />
      case "theory":
        return <BookOpen className="h-4 w-4 text-muted-foreground" />
      case "coding":
        return <Code className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getQuestionTypeLabel = (type: string, category?: string) => {
    if (type === "mcq" && category) {
      switch (category) {
        case "theory":
          return "Theory MCQ";
        case "code":
          return "Code MCQ";
        case "problem-solving":
          return "Problem Solving";
        default:
          return "MCQ";
      }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3">Test Summary</h3>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Questions:</p>
          <div className="flex flex-wrap gap-2">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="flex flex-col items-center">
                {getQuestionStatus(question.id, index)}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Question Types:</p>
          <div className="space-y-2">
            {assessment.questions.map((question, index) => (
              <div
                key={question.id}
                className={`flex items-center justify-between p-2 rounded-md text-sm ${
                  currentIndex === index ? "bg-muted" : ""
                }`}
                onClick={() => onSelectQuestion(index)}
              >
                <div className="flex items-center gap-2">
                  {getQuestionTypeIcon(question.type, (question as any).category)}
                  <span>Question {index + 1}</span>
                </div>
                <span>{getQuestionTypeLabel(question.type, (question as any).category)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

