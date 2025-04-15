"use client"

import { useAssessmentStore } from "@/lib/store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

export function ExplanationPanel() {
  const { showExplanationPanel, setShowExplanationPanel, currentExplanation } = useAssessmentStore()
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    if (showExplanationPanel) {
      setAnimateIn(true)
    }
  }, [showExplanationPanel])

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => {
      setShowExplanationPanel(false)
    }, 300)
  }

  if (!showExplanationPanel) return null

  // Clean HTML tags from explanation if present
  const cleanExplanation = currentExplanation ? currentExplanation.replace(/<[^>]*>/g, "") : ""

  return (
    <Sheet open={showExplanationPanel} onOpenChange={handleClose}>
      <SheetContent
        side="left"
        className={`w-full sm:max-w-md md:max-w-lg overflow-y-auto transition-transform duration-300 ${
          animateIn ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="font-heading text-xl">Explanation</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="mt-6 prose prose-sm dark:prose-invert max-w-none">
          {cleanExplanation ? (
            <ReactMarkdown>{cleanExplanation}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">No explanation available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

