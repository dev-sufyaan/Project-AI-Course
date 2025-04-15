import { MainLayout } from "@/components/main-layout"
import { EnrolledCourses } from "@/components/courses/enrolled-courses"
// Removed currentUser import
// Removed redirect import

export default async function EnrolledCoursesPage() {
  try {
    // Removed Clerk's currentUser logic and redirect
    // const user = await currentUser()
    // if (!user) {
    //   redirect("/sign-in")
    // }

    // Provide a placeholder user ID since Clerk is removed
    const userId = "dummy-user-id" // Placeholder

    return (
      <MainLayout>
        <div className="w-full">
          <h1 className="text-3xl font-heading font-bold mb-6">My Enrolled Courses</h1>
          {/* Pass the dummy user ID */}
          <EnrolledCourses userId={userId} />
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in enrolled courses page:", error)
    // Updated error handling for non-auth scenario
    return (
      <MainLayout>
        <div className="w-full py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Courses</h2>
          <p className="mb-4">There was an error loading your enrolled courses.</p>
          {/* Removed Sign In link as auth is removed */}
        </div>
      </MainLayout>
    )
  }
}

