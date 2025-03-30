"use client"

import { useState, useEffect } from "react"
import { useAssessmentStore, type MCQQuestion as MCQQuestionType, type MCQOption } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, HelpCircle, RefreshCw, ArrowRight } from "lucide-react"

interface MCQQuestionProps {
  question: MCQQuestionType
}

export function MCQQuestion({ question }: MCQQuestionProps) {
  // Initialize selectedOption as null and don't use savedAnswer as default
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reinforcementQuestions, setReinforcementQuestions] = useState<any[]>([])
  const [showReinforcement, setShowReinforcement] = useState(false)
  const [currentReinforcementIndex, setCurrentReinforcementIndex] = useState(0)
  const [reinforcementAnswers, setReinforcementAnswers] = useState<Record<string, string>>({})

  const {
    setUserAnswer,
    userAnswers,
    currentSubject,
    setShowExplanationPanel,
    setCurrentExplanation,
    currentQuestionIndex,
  } = useAssessmentStore()

  // Get the saved answer for this specific question
  const savedAnswer = userAnswers[question.id]?.answer as string | undefined

  // Reset selectedOption when question changes
  useEffect(() => {
    setSelectedOption(null)
  }, [question.id, currentQuestionIndex])

  // Check if this question has been answered
  const isAnswered = savedAnswer !== undefined

  // If there's a saved answer, use it for display purposes only
  useEffect(() => {
    if (isAnswered && savedAnswer) {
      setSelectedOption(savedAnswer)
    }
  }, [isAnswered, savedAnswer])

  const handleOptionSelect = (optionId: string) => {
    if (isAnswered) return

    setSelectedOption(optionId)
    const selectedOption = question.options.find((opt) => opt.id === optionId)
    const isCorrect = selectedOption?.isCorrect || false

    setUserAnswer(question.id, {
      questionId: question.id,
      answer: optionId,
      isCorrect,
    })
  }

  const getExplanation = async () => {
    setIsLoading(true)
    try {
      const correctOption = question.options.find((opt) => opt.isCorrect)?.text
      const selectedOptionText = question.options.find((opt) => opt.id === (selectedOption || savedAnswer))?.text

      const response = await fetch("/api/gemini/getExplanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: question.id,
          question: question.question,
          selectedOption: selectedOptionText,
          correctOption,
          formatAsMarkdown: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get explanation")
      }

      const data = await response.json()
      setCurrentExplanation(data.explanation)
      setShowExplanationPanel(true)
    } catch (error) {
      console.error("Error getting explanation:", error)
      setCurrentExplanation("Sorry, I couldn't generate an explanation at this time.")
      setShowExplanationPanel(true)
    } finally {
      setIsLoading(false)
    }
  }

  const getReinforcement = async () => {
    setIsLoading(true)
    try {
      const correctOption = question.options.find((opt) => opt.isCorrect)?.text
      const selectedOptionText = question.options.find((opt) => opt.id === (selectedOption || savedAnswer))?.text

      const response = await fetch("/api/gemini/getReinforcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conceptId: question.id,
          question: question.question,
          selectedOption: selectedOptionText,
          correctOption,
          subject: currentSubject,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get reinforcement questions")
      }

      const data = await response.json()
      setReinforcementQuestions(data.reinforcementQuestions)
      setShowReinforcement(true)
      setCurrentReinforcementIndex(0)
      setReinforcementAnswers({})
    } catch (error) {
      console.error("Error getting reinforcement questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReinforcementAnswer = (questionId: string, optionId: string) => {
    setReinforcementAnswers({
      ...reinforcementAnswers,
      [questionId]: optionId,
    })
  }

  const handleNextReinforcement = () => {
    if (currentReinforcementIndex < reinforcementQuestions.length - 1) {
      setCurrentReinforcementIndex(currentReinforcementIndex + 1)
    } else {
      setShowReinforcement(false)
    }
  }

  const getOptionStatus = (option: MCQOption) => {
    if (!isAnswered) return null

    const isSelected = option.id === savedAnswer

    if (option.isCorrect) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    }

    if (isSelected && !option.isCorrect) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }

    return null
  }

  if (showReinforcement && reinforcementQuestions.length > 0) {
    const currentQuestion = reinforcementQuestions[currentReinforcementIndex]
    const currentAnswer = reinforcementAnswers[currentQuestion.id]
    const isAnswered = currentAnswer !== undefined

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Reinforcement Question {currentReinforcementIndex + 1}/{reinforcementQuestions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-lg font-medium">{currentQuestion.question}</div>

            <RadioGroup
              value={currentAnswer}
              onValueChange={(value) => handleReinforcementAnswer(currentQuestion.id, value)}
              className="space-y-3"
              disabled={isAnswered}
            >
              {currentQuestion.options.map((option: any) => {
                const isCorrect = option.isCorrect
                const isSelected = currentAnswer === option.id

                return (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                      isAnswered
                        ? isCorrect
                          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                          : isSelected
                            ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                            : "border-muted bg-background"
                        : "border-muted bg-background hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`reinforcement-${currentQuestion.id}-${option.id}`}
                      disabled={isAnswered}
                      className="border-primary"
                    />
                    <Label
                      htmlFor={`reinforcement-${currentQuestion.id}-${option.id}`}
                      className="flex-grow cursor-pointer font-medium"
                    >
                      {option.text}
                    </Label>
                    {isAnswered &&
                      (isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        isSelected && <XCircle className="h-5 w-5 text-red-500" />
                      ))}
                  </div>
                )
              })}
            </RadioGroup>

            <div className="flex justify-end mt-4">
              <Button onClick={handleNextReinforcement} disabled={!isAnswered}>
                {currentReinforcementIndex === reinforcementQuestions.length - 1 ? "Finish" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-medium leading-relaxed">{question.question}</div>

      <RadioGroup
        value={isAnswered ? savedAnswer : selectedOption}
        onValueChange={handleOptionSelect}
        className="space-y-3"
      >
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
              isAnswered
                ? option.isCorrect
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                  : option.id === savedAnswer
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20"
                    : "border-muted bg-background"
                : "border-muted bg-background hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} disabled={isAnswered} className="border-primary" />
            <Label htmlFor={option.id} className="flex-grow cursor-pointer font-medium">
              {option.text}
            </Label>
            {getOptionStatus(option)}
          </div>
        ))}
      </RadioGroup>

      {isAnswered && !userAnswers[question.id].isCorrect && (
        <div className="mt-6 space-y-4">
          <Alert className="bg-muted">
            <AlertDescription>
              <div className="flex flex-col space-y-4">
                <p>Would you like to understand why your answer was incorrect?</p>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={getExplanation} disabled={isLoading} className="flex items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Get Explanation"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={getReinforcement}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : "Try Reinforcement"}
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

