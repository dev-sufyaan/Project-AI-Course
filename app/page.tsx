"use client"

import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { SubjectSelection } from "@/components/subject-selection"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useAuth()

  // Show welcome page for all users
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
              Learn Anything with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience personalized learning powered by artificial intelligence. Our platform adapts to your learning
              style, knowledge level, and preferences to create a truly customized educational journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isSignedIn ? (
                <>
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/courses">
                  <Button size="lg">
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-8 rounded-xl border border-indigo-500/20">
            <h2 className="text-2xl font-heading font-bold mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-indigo-500" /> AI-Powered Features
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-indigo-500 font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Personalized Learning Path</h3>
                  <p className="text-muted-foreground">
                    Curriculum tailored to your knowledge level and learning style
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-purple-500 font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Intelligent Tutoring</h3>
                  <p className="text-muted-foreground">Get instant help and explanations from our AI assistant</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-pink-500/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-pink-500 font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Adaptive Content</h3>
                  <p className="text-muted-foreground">
                    Request content modifications in real-time to match your needs
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-500 font-medium">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Smart Assessments</h3>
                  <p className="text-muted-foreground">
                    Tests that adapt to your performance and provide targeted feedback
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-heading font-bold mb-8">Featured Courses</h2>
        <SubjectSelection />
      </div>
    </MainLayout>
  )
}

