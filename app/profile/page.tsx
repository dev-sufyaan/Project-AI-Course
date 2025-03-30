import { MainLayout } from "@/components/main-layout"
import { ProfileContent } from "@/components/profile/profile-content"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  try {
    // Using currentUser without options to handle both older and newer Clerk versions
    const user = await currentUser()

    if (!user) {
      redirect("/sign-in")
    }

    // Create a serializable user object
    const serializableUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "User",
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress || "",
    }

    return (
      <MainLayout>
        <div className="w-full">
          <ProfileContent user={serializableUser} />
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error("Error in profile page:", error)
    // Provide a fallback UI in case of error
    return (
      <MainLayout>
        <div className="w-full py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="mb-4">There was an error loading your profile. Please try signing in again.</p>
          <a href="/sign-in" className="text-primary hover:underline">
            Sign In
          </a>
        </div>
      </MainLayout>
    )
  }
}

