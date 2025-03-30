"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen, Trash2, ChevronsRight, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/lib/store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnrolledCoursesProps {
  userId: string
}

export function EnrolledCourses({ userId }: EnrolledCoursesProps) {
  const router = useRouter()
  const { enrolledCourses, courseProgress, setCurrentSubject, unenrollFromCourse } = useAssessmentStore()
  const [courseDetails, setCourseDetails] = useState<any[]>([])

  useEffect(() => {
    // Get course details for enrolled courses
    const fetchCourseDetails = async () => {
      // These are only the available courses in the system
      const allCourses = [
        {
          id: "python",
          title: "Python Programming",
          description: "Learn Python from basics to advanced concepts with hands-on projects",
          color: "from-blue-500 to-cyan-400",
          totalTopics: 100,  // Updated to match the full Python curriculum
          topics: [
            "Introduction to Python", 
            "Variables & Data Types", 
            "Control Flow", 
            "Functions", 
            "Object-Oriented Programming",
            "Modules & Packages",
            "Data Structures",
            "File Handling",
            "Error Handling",
            "Advanced Concepts"
          ]
        },
        {
          id: "web_development",
          title: "Web Development",
          description: "Build responsive websites with HTML, CSS, JavaScript and modern frameworks",
          color: "from-pink-500 to-rose-400",
          totalTopics: 190,  // Updated to match the full Web Dev curriculum
          topics: [
            "Introduction to Web Development", 
            "HTML Basics", 
            "CSS Fundamentals", 
            "JavaScript Essentials", 
            "Responsive Design",
            "DOM Manipulation",
            "CSS Layout Techniques",
            "JavaScript in the Browser",
            "Working with APIs",
            "Modern Web Development"
          ]
        }
      ]

      const details = enrolledCourses
        .map((courseId) => {
          const course = allCourses.find((c) => c.id === courseId)
          if (!course) return null

          // Get course progress info
          const progress = courseProgress && courseProgress.subject === courseId
            ? Math.round(((courseProgress.completedTopics?.length || 0) / course.totalTopics) * 100)
            : 0
          
          // Get current topic info
          const currentTopicIndex = courseProgress && courseProgress.subject === courseId
            ? courseProgress.currentTopic || 0
            : 0
          
          const currentTopic = course.topics[currentTopicIndex] || course.topics[0]
          const passedAssessmentsCount = courseProgress && courseProgress.subject === courseId
            ? (courseProgress.passedAssessments?.length || 0)
            : 0
          
          const hasProgress = courseProgress && courseProgress.subject === courseId && currentTopicIndex > 0

          return {
            ...course,
            progress,
            lastTopic: currentTopicIndex,
            currentTopic,
            passedAssessmentsCount,
            hasProgress
          }
        })
        .filter(Boolean)

      setCourseDetails(details)
    }

    fetchCourseDetails()
  }, [enrolledCourses, courseProgress])

  const handleContinue = (courseId: string) => {
    setCurrentSubject(courseId)
    router.push(`/learn/${courseId}`)
  }

  const handleUnenroll = (courseId: string) => {
    if (confirm("Are you sure you want to unenroll from this course? Your progress will be lost.")) {
      unenrollFromCourse(courseId)
    }
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium mb-2">No enrolled courses yet</h2>
        <p className="text-muted-foreground mb-6">Browse our course catalog to find something you'd like to learn</p>
        <Button onClick={() => router.push("/courses")}>Browse Courses</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courseDetails.map((course) => (
        <Card
          key={course.id}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <CardHeader className={`bg-gradient-to-r ${course.color} text-white`}>
            <div className="flex justify-between items-center">
              <BookOpen className="h-8 w-8" />
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white">{course.progress}% Complete</Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnenroll(course.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unenroll from course</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardTitle className="mt-4">{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CardDescription className="mb-4">{course.description}</CardDescription>

            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              
              {course.hasProgress && (
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                    <span>Current topic:</span>
                  </div>
                  <div className="font-medium mt-1 flex items-center gap-1">
                    <span>{course.currentTopic}</span>
                    <ChevronsRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Topic {course.lastTopic + 1} of {course.totalTopics}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {course.passedAssessmentsCount} {course.passedAssessmentsCount === 1 ? "assessment" : "assessments"} passed
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full justify-between" onClick={() => handleContinue(course.id)}>
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

