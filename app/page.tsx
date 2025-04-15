"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { SubjectSelection } from "@/components/subject-selection"
import { LearningInterface } from "@/components/learning-interface"
import { useAssessmentStore, UserProfile, LearningPreferences } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function HomePage() {
  const { currentSubject, setCurrentSubject, userProfile, setUserProfile } = useAssessmentStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Provide a default guest profile matching the updated UserProfile interface
    const defaultLearningPreferences: LearningPreferences = {
      difficulty: "beginner",
      pacing: "standard",
      explanationDetail: "balanced",
      examplePreference: "moderate",
    }
    const dummyProfile: UserProfile = {
      id: "guest-user-id",
      firstName: "Guest", // Added optional field
      lastName: "User", // Added optional field
      fullName: "Guest User", // Added optional field
      imageUrl: "/placeholder-user.jpg", // Added optional field
      email: "guest@example.com", // Added optional field
      learningPreferences: defaultLearningPreferences,
    }
    // Only set profile if it doesn't exist yet to avoid overwriting
    if (!userProfile) {
      setUserProfile(dummyProfile)
    }
    setIsLoading(false)
  }, [setUserProfile, userProfile]) // Add userProfile to dependency array

  const handleSubjectSelect = (subject: string) => {
    setCurrentSubject(subject)
    // Navigation is handled within SubjectSelection now
  }

  const handleBack = () => {
    setCurrentSubject(null)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {currentSubject ? (
        <div className="flex flex-col h-full">
          <Button variant="ghost" onClick={handleBack} className="mb-4 self-start">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Subjects
          </Button>
          <LearningInterface subject={currentSubject} />
        </div>
      ) : (
        // Removed the onSelectSubject prop as it's not needed
        <SubjectSelection />
      )}
    </MainLayout>
  )
}

