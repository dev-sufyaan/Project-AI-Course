import { MainLayout } from "@/components/main-layout"
import { EnrolledCourses } from "@/components/courses/enrolled-courses"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function EnrolledCoursesPage() {
  try {
    // Using currentUser without options to handle both older and newer Clerk versions
    const user = await currentUser()

    if (!user) {
      redirect("/sign-in")
    }

    return (
      <MainLayout>
        <div className="w-full">
          <h1 className="text-3xl font-heading font-bold mb-6">My Enrolled Courses</h1>
          <EnrolledCourses userId={user.id} />
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in enrolled courses page:", error)
    // Provide a fallback UI in case of error
    return (
      <MainLayout>
        <div className="w-full py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="mb-4">There was an error loading your enrolled courses. Please try signing in again.</p>
          <a href="/sign-in" className="text-primary hover:underline">
            Sign In
          </a>
        </div>
      </MainLayout>
    )
  }
}

