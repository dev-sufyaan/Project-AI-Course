"use client"

import { useEffect, useRef } from "react"
import { useBoundStore } from "@/lib/store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, X, BookOpen, CheckCircle2 } from "lucide-react"
import { MCQQuestion } from "./mcq-question"
import { TheoryQuestion } from "./theory-question"
import { CodingQuestion } from "./coding-question"
import { TestSummary } from "./test-summary"
import { ExplanationPanel } from "./explanation-panel"
import { useToast } from "@/components/ui/use-toast"

export function AssessmentPanel() {
  const {
    assessment,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    isPanelOpen,
    togglePanel,
    userAnswers,
    currentSubject,
    courseContents,
    currentContentIndex,
    setAssessment,
    setIsLoading,
    isLoading,
    showExplanationPanel,
    resetAssessment,
    saveTestScore,
    markAssessmentPassed,
    hasPassedCurrentAssessment,
    courseTopics,
    updateCourseTopic,
    markTopicCompleted,
    updateCourseProgress,
    courseProgress,
  } = useBoundStore()

  const prevContentIndex = useRef(currentContentIndex)
  const { toast } = useToast()

  // Handle closing the panel
  const handleClosePanel = () => {
    togglePanel()

    // If assessment was completed, check if passed
    if (assessment) {
      const answeredQuestions = Object.values(userAnswers)
      const totalQuestions = assessment.questions.length
      const correctAnswers = answeredQuestions.filter((a) => a.isCorrect === true || (a.score && a.score >= 7)).length
      const allQuestionsAnswered = answeredQuestions.length === totalQuestions
      const score = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0

      if (allQuestionsAnswered) {
        // Save the test score
        if (assessment.id) {
          saveTestScore(assessment.title, score)
        }

        // If passed (50% or higher), mark as passed
        if (score >= 50) {
          markAssessmentPassed(assessment.id)
          
          // Get the current topic
          const currentContent = courseContents[currentContentIndex];
          if (currentContent) {
            // Find the topic in the courseTopics list
            const currentTopic = courseTopics.find(topic => topic.title === currentContent.title);
            if (currentTopic && !currentTopic.completed) {
              // Mark the topic as completed in store
              markTopicCompleted(currentContent.title);
              
              // Update the course topic in the index
              updateCourseTopic(currentTopic.id, { completed: true });
              
              // Update course progress
              const completedTopics = courseProgress?.completedTopics || [];
              if (!completedTopics.includes(currentContent.title)) {
                updateCourseProgress({
                  completedTopics: [...completedTopics, currentContent.title]
                });
              }
            }
          }
          
          toast({
            title: "Assessment Passed!",
            description: `You scored ${score}%. You can now proceed to the next topic.`,
            variant: "default",
          })
        } else {
          toast({
            title: "Assessment Not Passed",
            description: `You scored ${score}%. You need at least 50% to pass.`,
            variant: "destructive",
          })
        }
      }
    }
  }

  useEffect(() => {
    // Reset assessment when content changes
    if (isPanelOpen && currentContentIndex !== prevContentIndex.current) {
      resetAssessment()
      prevContentIndex.current = currentContentIndex
    }

    // Load assessment data when panel is opened
    const loadAssessment = async () => {
      if (isPanelOpen && !assessment && !isLoading && currentSubject) {
        setIsLoading(true)

        try {
          const currentContent = courseContents[currentContentIndex]

          if (!currentContent) {
            throw new Error("No course content available")
          }

          const response = await fetch("/api/gemini/generateQuiz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: currentSubject,
              topic: currentContent.title,
              courseContent: currentContent,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to load assessment")
          }

          const data = await response.json()
          setAssessment(data.assessment)
        } catch (error) {
          console.error("Error loading assessment:", error)
          toast({
            title: "Error",
            description: "Failed to load assessment. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadAssessment()
  }, [
    isPanelOpen,
    assessment,
    isLoading,
    currentSubject,
    courseContents,
    currentContentIndex,
    setAssessment,
    setIsLoading,
    resetAssessment,
    toast,
  ])

  if (!assessment && isLoading) {
    return (
      <Sheet open={isPanelOpen} onOpenChange={handleClosePanel}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="font-heading text-xl">Generating Assessment...</SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleClosePanel}>
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Creating personalized questions based on your learning...</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (!assessment) {
    return null
  }

  const currentQuestion = assessment.questions[currentQuestionIndex]
  const progress = (currentQuestionIndex / assessment.questions.length) * 100

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "mcq":
        return <MCQQuestion question={currentQuestion} />
      case "theory":
        return <TheoryQuestion question={currentQuestion} />
      case "coding":
        return <CodingQuestion question={currentQuestion} />
      default:
        return <div>Unknown question type</div>
    }
  }

  const isAnswered = userAnswers[currentQuestion.id]?.answer !== undefined

  // Calculate test score
  const answeredQuestions = Object.values(userAnswers)
  const totalQuestions = assessment.questions.length
  const correctAnswers = answeredQuestions.filter((a) => a.isCorrect === true || (a.score && a.score >= 7)).length
  const score = answeredQuestions.length > 0 ? Math.round((correctAnswers / answeredQuestions.length) * 100) : 0

  const allQuestionsAnswered = answeredQuestions.length === totalQuestions

  // Check if user has passed the test (50% or higher)
  const hasPassed = allQuestionsAnswered && correctAnswers / totalQuestions >= 0.5

  return (
    <>
      <Sheet open={isPanelOpen} onOpenChange={handleClosePanel}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
          <SheetHeader className="flex flex-row items-center justify-between">
            <SheetTitle className="font-heading text-xl">{assessment.title}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={handleClosePanel}>
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
              <span>
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mt-6">
            {renderQuestion()}

            <div className="mt-6">
              <TestSummary
                assessment={assessment}
                userAnswers={userAnswers}
                currentIndex={currentQuestionIndex}
                onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
              />

              {allQuestionsAnswered && (
                <div
                  className={`mt-4 p-4 rounded-lg ${hasPassed ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {hasPassed ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Test Passed!</h3>
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Review Needed</h3>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {hasPassed
                      ? `Great job! You scored ${score}% on this assessment. You can now move on to the next topic.`
                      : `You scored ${score}%. You need at least 50% to pass. Review the material and try again.`}
                  </p>
                  {hasPassed ? (
                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={handleClosePanel}>
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20" 
                      onClick={() => resetAssessment()}
                    >
                      Reattempt Quiz
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === assessment.questions.length - 1 || !isAnswered}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ExplanationPanel />
    </>
  )
}

