import { MainLayout } from "@/components/main-layout"
import { ProfileContent } from "@/components/profile/profile-content"
// Removed currentUser import
// Removed redirect import

export default async function ProfilePage() {
  try {
    // Removed Clerk's currentUser logic and redirect
    // const user = await currentUser()
    // if (!user) {
    //   redirect("/sign-in")
    // }

    // Create a placeholder/dummy user object since Clerk is removed
    const serializableUser = {
      id: "dummy-user-id", // Placeholder
      firstName: "Guest", // Placeholder
      lastName: "User", // Placeholder
      fullName: "Guest User", // Placeholder
      imageUrl: "/placeholder-user.jpg", // Placeholder image
      email: "guest@example.com", // Placeholder
    }

    return (
      <MainLayout>
        <div className="w-full">
          {/* Pass the dummy user object */}
          <ProfileContent user={serializableUser} />
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in profile page:", error)
    // Updated error handling for non-auth scenario
    return (
      <MainLayout>
        <div className="w-full py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
          <p className="mb-4">There was an error loading the profile information.</p>
          {/* Removed Sign In link as auth is removed */}
        </div>
      </MainLayout>
    )
  }
}

