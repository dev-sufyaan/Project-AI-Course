"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

// Keep only Python and Web Development courses
const courses = [
  {
    id: "python",
    title: "Python Programming",
    description: "Learn Python from basics to advanced concepts with hands-on projects",
    icon: Code,
    color: "from-blue-500 to-cyan-400",
    topics: [
      "Variables & Data Types",
      "Control Flow",
      "Functions",
      "Object-Oriented Programming",
      "Libraries & Frameworks",
    ],
    level: "All Levels",
  },
  {
    id: "web_development",
    title: "Web Development",
    description: "Build responsive websites with HTML, CSS, JavaScript and modern frameworks",
    icon: Globe,
    color: "from-pink-500 to-rose-400",
    topics: ["HTML/CSS", "JavaScript", "React", "Node.js", "Responsive Design"],
    level: "Beginner to Advanced",
  },
]

export function CoursesList() {
  const router = useRouter()
  const { toast } = useToast()
  const { setCurrentSubject, enrollInCourse, enrolledCourses } = useAssessmentStore()

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId)
    setCurrentSubject(courseId)

    toast({
      title: "Enrolled successfully",
      description: `You've been enrolled in ${courses.find((c) => c.id === courseId)?.title}`,
    })

    router.push(`/learn/${courseId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {courses.map((course) => {
        const isEnrolled = enrolledCourses.includes(course.id)

        return (
          <Card
            key={course.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group"
          >
            <CardHeader className={`bg-gradient-to-r ${course.color} text-white`}>
              <div className="flex justify-between items-center">
                <course.icon className="h-8 w-8" />
                <Badge className="bg-white/20 text-white">{course.level}</Badge>
              </div>
              <CardTitle className="mt-4">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="mb-4">{course.description}</CardDescription>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Topics covered:</h4>
                <div className="flex flex-wrap gap-2">
                  {course.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="bg-muted">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={isEnrolled ? "outline" : "default"}
                className="w-full justify-between group-hover:bg-muted"
                onClick={() => handleEnroll(course.id)}
              >
                {isEnrolled ? "Continue Learning" : "Enroll Now"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

