"use client"

import { useAssessmentStore } from "@/lib/store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, BookOpen, ArrowRight, Clock, CheckSquare2, Info, AlertTriangle, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function CourseIndex() {
  const {
    showCourseIndex,
    setShowCourseIndex,
    courseTopics,
    currentContentIndex,
    setCurrentContentIndex,
    currentSubject,
    courseProgress,
    hasPassedCurrentAssessment,
    markTopicCompleted,
  } = useAssessmentStore()

  const [animateIn, setAnimateIn] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  useEffect(() => {
    if (showCourseIndex) {
      setAnimateIn(true)
    }
  }, [showCourseIndex])

  useEffect(() => {
    // When courseProgress changes, expand the current topic
    if (courseProgress && courseTopics.length > 0) {
      const currentTopicIndex = courseProgress.currentTopic >= 0 ? 
        courseProgress.currentTopic : currentContentIndex;
      
      if (currentTopicIndex < courseTopics.length) {
        setExpandedTopic(courseTopics[currentTopicIndex].id);
      }
    }
  }, [courseProgress, courseTopics, currentContentIndex]);

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => {
      setShowCourseIndex(false)
    }, 300)
  }

  const handleSelectTopic = (index: number) => {
    setCurrentContentIndex(index)
    handleClose()
  }

  const toggleTopicDetails = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId)
  }
  
  const handleMarkComplete = (topicId: string, title: string, event: React.MouseEvent) => {
    event.stopPropagation();
    markTopicCompleted(title);
    handleClose();
  };

  // Calculate overall course progress
  const completedTopics = courseTopics.filter(topic => topic.completed).length
  const overallProgress = courseTopics.length > 0 ? (completedTopics / courseTopics.length) * 100 : 0

  if (!showCourseIndex) return null

  return (
    <Sheet open={showCourseIndex} onOpenChange={handleClose}>
      <SheetContent
        side="left"
        className={`w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto transition-transform duration-300 ${
          animateIn ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="font-heading text-xl">
            {currentSubject ? `${currentSubject} Course Index` : "Course Index"}
          </SheetTitle>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="icon" title="Home">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleClose} title="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">About This Course</h3>
            <p className="text-muted-foreground mb-4">
              This course covers all essential topics in {currentSubject}. Each topic includes comprehensive content and
              an assessment to test your understanding.
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> {courseTopics.length} Topics
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckSquare2 className="h-3 w-3" /> {completedTopics} Completed
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Info className="h-3 w-3" /> 50% Passing Score
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Course Topics</h3>
            <Accordion type="single" collapsible className="w-full">
              {courseTopics.map((topic, index) => {
                const isCurrentTopic = currentContentIndex === index;
                const isPassed = topic.completed;
                
                // Allow viewing of completed topics and current topic
                // Lock topics after current one unless they're completed
                const isAccessible = index <= currentContentIndex || isPassed;
                const isLocked = !isAccessible;
                
                // For current topic, check if assessment is passed
                const currentTopicPassed = isCurrentTopic && hasPassedCurrentAssessment();
                
                // Determine topic status for styling
                let topicStatus = "locked";
                if (isPassed) {
                  topicStatus = "completed";
                } else if (isCurrentTopic) {
                  topicStatus = "current";
                } else if (isAccessible) {
                  topicStatus = "accessible";
                }

                return (
                  <AccordionItem 
                    key={topic.id} 
                    value={topic.id}
                    className={`border rounded-lg mb-3 overflow-hidden ${
                      topicStatus === "current" ? "border-primary" : topicStatus === "completed" ? "border-green-500/30" : ""
                    }`}
                  >
                    <div className={`${isLocked ? "opacity-70" : ""}`}>
                      <div 
                        className={`flex items-start p-4 ${
                          topicStatus === "completed" ? "bg-green-500/5" : topicStatus === "current" ? "bg-blue-500/5" : ""
                        }`}
                        onClick={() => !isLocked && handleSelectTopic(index)}
                      >
                        <div className="mr-3 mt-1">
                          {topicStatus === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : topicStatus === "current" ? (
                            <Clock className="h-5 w-5 text-blue-500" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {index + 1}. {topic.title}
                            </span>
                            {topicStatus === "current" && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                Current
                              </Badge>
                            )}
                            {topicStatus === "completed" && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                Completed
                              </Badge>
                            )}
                            {topicStatus === "locked" && (
                              <Badge variant="outline" className="bg-muted text-muted-foreground">
                                Locked
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{topic.description}</p>
                        </div>
                        <AccordionTrigger onClick={(e) => {
                          e.stopPropagation();
                          toggleTopicDetails(topic.id);
                        }} className="ml-2" />
                      </div>
                    </div>
                    
                    <AccordionContent>
                      <CardContent className="pt-0 pb-4 px-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Learning Objectives</h4>
                            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                              <li>Understand core concepts of {topic.title}</li>
                              <li>Apply knowledge through practical examples</li>
                              <li>Demonstrate comprehension through assessment</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Assessment Status</h4>
                            {topicStatus === "completed" ? (
                              <div className="flex items-center text-xs text-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Passed
                              </div>
                            ) : topicStatus === "current" ? (
                              <div className="flex items-center text-xs text-amber-500">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {currentTopicPassed ? "Passed" : "Not attempted or not passed"}
                              </div>
                            ) : (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Info className="h-3 w-3 mr-1" />
                                {isLocked ? "Locked - complete previous topics first" : "Available when ready"}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {!isLocked && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleSelectTopic(index)}
                              >
                                {topicStatus === "current" ? "Continue Learning" : topicStatus === "completed" ? "Review Topic" : "Start Topic"}
                              </Button>
                            )}
                            
                            {!isLocked && topicStatus !== "completed" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 text-green-500 border-green-500/20"
                                onClick={(e) => handleMarkComplete(topic.id, topic.title, e)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                            
                            {isLocked && (
                              <p className="text-xs text-muted-foreground italic">
                                Complete previous topics to unlock this content
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {courseTopics.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No topics available yet.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

