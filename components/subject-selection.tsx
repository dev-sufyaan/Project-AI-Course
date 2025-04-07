"use client"

import { useRouter } from "next/navigation"
import { useAssessmentStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Globe, BookOpen } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const subjects = [
  {
    id: "python",
    title: "Python Programming",
    description: "Learn Python from basics to advanced concepts with hands-on projects",
    icon: Code,
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "web_development",
    title: "Web Development",
    description: "Build responsive websites with HTML, CSS, JavaScript and modern frameworks",
    icon: Globe,
    color: "from-pink-500 to-rose-400",
  },
]

export function SubjectSelection() {
  const router = useRouter()
  const { setCurrentSubject, userProfile, enrollInCourse, enrolledCourses } = useAssessmentStore()

  const handleSelectSubject = (subjectId: string) => {
    setCurrentSubject(subjectId)
    enrollInCourse(subjectId)
    router.push(`/learn/${subjectId}`)
  }

  // Get user's knowledge level for each subject
  const getKnowledgeLevel = (subjectId: string) => {
    if (!userProfile || !userProfile.learningPreferences) return "beginner"
    return userProfile.learningPreferences.difficulty || "beginner"
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">Featured Courses</h2>
        <div className="flex gap-2">
          <Link href="/courses">
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              All Courses
            </Button>
          </Link>
          <Link href="/enrolled">
            <Button variant="default" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
              <BookOpen className="h-4 w-4" />
              My Courses
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => {
          const knowledgeLevel = getKnowledgeLevel(subject.id)
          const isEnrolled = enrolledCourses.includes(subject.id)

          return (
            <Card
              key={subject.id}
              className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group ${
                isEnrolled ? 'border-2 border-indigo-500/30' : ''
              }`}
            >
              <CardHeader className={`bg-gradient-to-r ${subject.color} text-white`}>
                <div className="flex justify-between items-center">
                  <subject.icon className="h-8 w-8" />
                  {isEnrolled && (
                    <Badge className="bg-white text-indigo-600 font-medium">Enrolled</Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{subject.title}</CardTitle>
                <div className="mt-2 text-xs font-medium bg-white/20 rounded-full px-2 py-1 w-fit">
                  {knowledgeLevel.charAt(0).toUpperCase() + knowledgeLevel.slice(1)}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription>{subject.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  variant={isEnrolled ? "default" : "outline"}
                  className="w-full justify-between group-hover:bg-muted"
                  onClick={() => handleSelectSubject(subject.id)}
                >
                  {isEnrolled ? "Continue Learning" : "Start Learning"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

