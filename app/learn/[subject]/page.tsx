"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useBoundStore } from "@/lib/store"
import { MainLayout } from "@/components/main-layout"
import { CourseContent } from "@/components/course/course-content"
import { useToast } from "@/components/ui/use-toast"

interface SubjectPageProps {
  params: {
    subject: string
  }
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)
  const { 
    setCurrentSubject, 
    resetChat, 
    loadSavedProgress, 
    courseContents 
  } = useBoundStore()
  
  const subjectValue = params.subject

  // Set current subject, reset chat, and load saved progress when component mounts
  useEffect(() => {
    if (!subjectValue) return;
    
    // Use a function inside useEffect to avoid dependency issues
    const initializeSubject = async () => {
      setCurrentSubject(subjectValue)
      resetChat()
    }
    
    initializeSubject()
  }, [subjectValue, setCurrentSubject, resetChat])

  // Load saved progress in a separate effect, only after courseContents are available
  useEffect(() => {
    if (!subjectValue || !courseContents.length || isLoaded) return;
    
    // Try to load saved progress once we have course contents
    const progressLoaded = loadSavedProgress(subjectValue);
    
    if (progressLoaded) {
      toast({
        title: "Progress Restored",
        description: `Your previous progress for ${subjectValue} has been restored.`,
        duration: 3000,
      });
    }
    
    setIsLoaded(true);
  }, [subjectValue, courseContents, loadSavedProgress, toast, isLoaded]);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {subjectValue && <CourseContent subject={subjectValue} />}
      </div>
    </MainLayout>
  )
}

