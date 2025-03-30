"use client"

import { MainLayout } from "@/components/main-layout"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">About the Learning Platform</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>
            Welcome to our AI-powered learning platform designed to provide personalized education
            experiences for students of all levels. Our platform uses advanced AI technology to adapt
            content to your learning style and pace.
          </p>
          <h2>Our Mission</h2>
          <p>
            Our mission is to make education accessible, engaging, and effective for everyone. We believe
            that learning should be tailored to the individual, and our AI technologies help make that possible.
          </p>
          <h2>Features</h2>
          <ul>
            <li>Personalized learning paths based on your preferences and progress</li>
            <li>AI-powered assistant that can answer questions and provide additional explanations</li>
            <li>Interactive assessments to test your knowledge</li>
            <li>Progress tracking to help you stay motivated</li>
            <li>Content that adapts to your learning style</li>
          </ul>
          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you! Contact our support team at
            support@learningplatform.com.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

