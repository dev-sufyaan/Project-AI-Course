"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAssessmentStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"

export function ChatInterface() {
  const [message, setMessage] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Custom CSS for code blocks in markdown
  useEffect(() => {
    // Add custom CSS for code blocks
    const style = document.createElement('style');
    style.textContent = `
      .prose pre {
        background-color: #1e1e1e;
        border-radius: 0.375rem;
        padding: 1rem;
        margin: 1rem 0;
        overflow-x: auto;
      }
      .prose code {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 0.25rem;
        padding: 0.2rem 0.4rem;
        font-family: monospace;
      }
      .prose pre code {
        background-color: transparent;
        padding: 0;
        color: #e2e2e2;
      }
      /* Additional styles to ensure consistent rendering across languages */
      .prose {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
      }
      .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
        line-height: 1.25;
      }
      .prose p {
        margin-top: 0.5em;
        margin-bottom: 1em;
      }
      .prose ul, .prose ol {
        margin-top: 0.5em;
        margin-bottom: 1em;
        padding-left: 1.5em;
      }
      .prose li {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
      .prose blockquote {
        border-left: 4px solid #e2e2e2;
        padding-left: 1em;
        color: #6b7280;
        margin: 1em 0;
      }
      .prose table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
      }
      .prose th, .prose td {
        border: 1px solid #e2e2e2;
        padding: 0.5em;
      }
      /* Ensure consistent direction for RTL languages like Arabic */
      [dir="rtl"] .prose {
        text-align: right;
      }
      [dir="rtl"] .prose blockquote {
        border-left: none;
        border-right: 4px solid #e2e2e2;
        padding-left: 0;
        padding-right: 1em;
      }
      [dir="rtl"] .prose ul, [dir="rtl"] .prose ol {
        padding-left: 0;
        padding-right: 1.5em;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add a welcome message when the chat is empty
  useEffect(() => {
    if (chatMessages.length === 0 && currentSubject) {
      const welcomeMessage = `👋 Hi there! I'm your AI learning assistant for ${currentSubject}. I can help you understand the current topic better or modify the content to suit your needs. Feel free to ask me questions or request changes like:

- "Can you explain this concept in simpler terms?"
- "Change the language to Hindi"
- "Give me more examples"
- "Make this content more advanced"
- "Explain this like I'm a 10-year-old"

How can I help you today?`

      addChatMessage("assistant", welcomeMessage)
    }
  }, [chatMessages.length, currentSubject, addChatMessage])

  // Handle confirmation buttons
  const handleConfirmation = async (isConfirmed: boolean) => {
    if (isConfirmed && confirmationRequest) {
      setAwaitingConfirmation(false)
      setRegenerating(true)

      addChatMessage(
        "assistant",
        "Great! I'm regenerating the content based on your request. This will take just a moment..."
      )

      try {
        // Call the API to regenerate content
        const response = await fetch("/api/gemini/regenerateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: confirmationRequest.message,
            subject: confirmationRequest.subject,
            userProfile: confirmationRequest.userProfile,
            currentContent: confirmationRequest.currentContent,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to regenerate content")
        }

        const data = await response.json()

        // Update the course content
        setCourseContents([
          ...courseContents.slice(0, currentContentIndex),
          data.courseContent,
          ...courseContents.slice(currentContentIndex + 1),
        ])

        addChatMessage(
          "assistant",
          "✅ I've updated the content based on your request. The page has been refreshed with the changes you requested. Let me know if you need any further adjustments!"
        )

        toast({
          title: "Content Updated",
          description: "The course content has been updated based on your request.",
          duration: 3000,
        })

        setConfirmationRequest(null)
      } catch (error) {
        console.error("Error regenerating content:", error)
        addChatMessage(
          "assistant",
          "I'm sorry, I encountered an error while trying to update the content. Please try again or contact support if the issue persists."
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
        /(?:change|translate|convert|make|modify|simplify|explain|add more|give more|in|to) (?:language|content|examples|simple|simpler|easier|hindi|arabic|detailed|detail|explanation)/i
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
      
      // Regular chat flow for non-modification requests
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          subject: currentSubject,
          userProfile: userProfile,
          currentContent: courseContents[currentContentIndex],
          currentTopic: courseContents[currentContentIndex]?.title || 'Python basics',
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      addChatMessage("assistant", data.response)
    } catch (error) {
      console.error("Error sending message:", error)
      addChatMessage(
        "assistant",
        "I'm sorry, I encountered an error processing your request. Please try again or contact support if the issue persists."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Learning Assistant</CardTitle>
        <CardDescription>Ask questions about {currentSubject || "your subject"} and get instant help</CardDescription>
      </CardHeader>
      <CardContent ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Start a conversation by sending a message</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={msg.role === "user" ? "bg-indigo-500" : "bg-zinc-700"}>
                  <AvatarFallback>{msg.role === "user" ? "U" : "AI"}</AvatarFallback>
                </Avatar>
                <div
                  className={`${
                    msg.role === "user" ? "bg-indigo-500 text-white" : "bg-muted"
                  } p-3 rounded-lg shadow`}
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
                          Yes, update
                        </Button>
                        <Button variant="outline" onClick={() => handleConfirmation(false)} size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          No, cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="prose dark:prose-invert prose-sm max-w-none"
                      dir={
                        // Set RTL direction for languages that use RTL
                        msg.content.toLowerCase().includes('arabic') || 
                        msg.content.toLowerCase().includes('عربي') || 
                        msg.content.toLowerCase().includes('العربية') ? 
                        'rtl' : 'ltr'
                      }
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="bg-zinc-700">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg shadow flex gap-2 items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Thinking...</p>
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
                <p>Regenerating content...</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[60px] flex-grow"
            disabled={regenerating || awaitingConfirmation}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !message.trim() || regenerating || awaitingConfirmation}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}