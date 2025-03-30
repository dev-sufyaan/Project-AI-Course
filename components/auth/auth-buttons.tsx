"use client"

import { useRouter } from "next/navigation"
import { SignInButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"

export function AuthButtons() {
  const { isSignedIn } = useAuth()
  const router = useRouter()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/profile")}
          className="text-muted-foreground hover:text-foreground"
        >
          My Profile
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  )
}

