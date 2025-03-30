"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useAssessmentStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

export function LearningAssistant() {
  const [message, setMessage] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const assistantRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize scroll position tracking
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)

  const {
    chatMessages,
    addChatMessage,
    currentSubject,
    isLoading,
    setIsLoading,
    userProfile,
    courseContents,
    currentContentIndex,
    setCourseContents,
  } = useAssessmentStore()

  // Add these state variables for confirmation flow
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [confirmationRequest, setConfirmationRequest] = useState<{
    type: string
    message: string
    subject: string | null
    userProfile: any
    currentContent: any
  } | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  // Handle scroll events to show/hide assistant
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingDown(true)
      } else {
        // Scrolling up
        setIsScrollingDown(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Add a welcome message when the chat is empty
  useEffect(() => {
    if (chatMessages.length === 0 && currentSubject) {
      const welcomeMessage = `👋 Hi there! I'm your AI learning assistant for ${currentSubject}. I can help you understand the current topic better. Feel free to ask me questions!`
      addChatMessage("assistant", welcomeMessage)
    }
  }, [chatMessages.length, currentSubject, addChatMessage])

  const handleConfirmation = async (isConfirmed: boolean) => {
    if (!confirmationRequest) return

    if (isConfirmed) {
      // User confirmed they want to modify the content
      setAwaitingConfirmation(false)
      setRegenerating(true)

      try {
        // Regenerate content based on user request
        const response = await fetch("/api/gemini/regenerateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: confirmationRequest.subject,
            userMessage: confirmationRequest.message,
            userProfile: confirmationRequest.userProfile,
            currentContent: confirmationRequest.currentContent,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to regenerate content")
        }

        const data = await response.json()

        // Update course content
        setCourseContents(
          courseContents.map((content, index) =>
            index === currentContentIndex ? data.courseContent : content
          )
        )

        addChatMessage(
          "assistant",
          "I've updated the content based on your request. The changes should be visible now."
        )
      } catch (error) {
        console.error("Error regenerating content:", error)
        addChatMessage(
          "assistant",
          "I'm sorry, I encountered an error while trying to update the content. Please try again."
        )
      } finally {
        setRegenerating(false)
      }
    } else {
      setAwaitingConfirmation(false)
      setConfirmationRequest(null)

      addChatMessage(
        "assistant",
        "No problem! I won't make any changes to the content. Is there anything else I can help you with?"
      )
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading || regenerating || awaitingConfirmation) return

    // Add user message to chat
    addChatMessage("user", message)
    const userMsg = message
    setMessage("")
    setIsLoading(true)

    try {
      // Check if this is a special request to modify content
      const modifyContentRegex =
        /(?:change|translate|convert|make|modify|simplify|explain|add more|give more|in|to) (?:language|content|examples|simple|simpler|easier|detailed|detail|explanation)/i
      const childExplainRegex = /explain (?:like|as if) (?:I'?m|I am) (?:a )?\d+/i
      const isModifyRequest = modifyContentRegex.test(userMsg) || childExplainRegex.test(userMsg)

      if (isModifyRequest && currentSubject && courseContents[currentContentIndex]) {
        // Ask for confirmation
        const confirmationMessage = `I can modify the current topic based on your request. Would you like me to regenerate the content with these changes?`
        
        addChatMessage("assistant", confirmationMessage)
        setAwaitingConfirmation(true)
        setConfirmationRequest({
          type: "modify",
          message: userMsg,
          subject: currentSubject,
          userProfile: userProfile,
          currentContent: courseContents[currentContentIndex],
        })
        setIsLoading(false)
        return
      }

      // Regular chat message
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          subject: currentSubject,
          currentContent: courseContents[currentContentIndex],
        }),
      })

      if (!response.ok) {
        throw new Error("Chat failed")
      }

      const data = await response.json()
      addChatMessage("assistant", data.response)
    } catch (error) {
      console.error("Chat error:", error)
      addChatMessage("assistant", "Sorry, I'm having trouble responding right now. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div 
      ref={assistantRef}
      className={`fixed right-4 transition-all duration-300 z-50 shadow-lg ${
        isScrollingDown 
          ? "bottom-4" 
          : "bottom-[-500px]"
      }`}
      style={{
        width: isExpanded ? '350px' : '200px',
        height: isExpanded ? '500px' : '60px',
        borderRadius: '10px',
        overflow: 'hidden'
      }}
    >
      <Card className="w-full h-full flex flex-col border-primary/20">
        <CardHeader 
          className="p-3 bg-primary/10 cursor-pointer flex flex-row items-center justify-between"
          onClick={toggleExpanded}
        >
          <CardTitle className="text-sm">AI Learning Assistant</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}>
            {isExpanded ? "−" : "+"}
          </Button>
        </CardHeader>
        
        {isExpanded && (
          <>
            <CardContent ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className={msg.role === "user" ? "bg-indigo-500" : "bg-zinc-700"}>
                      <AvatarFallback>{msg.role === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`${
                        msg.role === "user" ? "bg-indigo-500 text-white" : "bg-muted"
                      } p-3 rounded-lg shadow text-sm`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : awaitingConfirmation && index === chatMessages.length - 1 ? (
                        <>
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" onClick={() => handleConfirmation(true)} size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Yes
                            </Button>
                            <Button variant="outline" onClick={() => handleConfirmation(false)} size="sm">
                              <XCircle className="h-4 w-4 mr-1" />
                              No
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-zinc-700">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg shadow flex gap-2 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
              {regenerating && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-zinc-700">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg shadow flex gap-2 items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Regenerating content...</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
              <Textarea
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[45px] text-sm flex-grow resize-none"
                disabled={regenerating || awaitingConfirmation}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-[45px]"
                disabled={isLoading || !message.trim() || regenerating || awaitingConfirmation}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  )
} 