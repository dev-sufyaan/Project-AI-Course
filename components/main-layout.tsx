"use client"

import type React from "react"
import { ParticleBackground } from "./particle-background"
import { AuthButtons } from "./auth/auth-buttons"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Info, FileText, Users, Home } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 relative overflow-hidden">
      <ParticleBackground />
      <div className="w-full px-4 md:px-8 lg:px-12 py-8 relative z-10">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <h1 className="text-4xl md:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Right Site Learning Platform
              </h1>
              <p className="text-muted-foreground mt-2">AI powered learning with personalization</p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Courses
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </Button>
              </Link>
            </nav>
            <AuthButtons />
          </div>
        </header>
        <main className="max-w-full">{children}</main>
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} Right Site Learning Platform. All rights reserved. Created by Ken.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/documentation" className="text-muted-foreground hover:text-foreground text-sm">
                Documentation
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">
                About
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

