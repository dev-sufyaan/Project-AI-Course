// Re-implementing Clerk authentication
import { authMiddleware } from "@clerk/nextjs"

// This function uses Clerk auth middleware with proper configuration
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/(.*)", "/about", "/documentation", "/team", "/_not-found"],

  // Routes that can always be accessed, and have no authentication information
  ignoredRoutes: ["/api/gemini/(.*)", "/_next/(.*)", "/favicon.ico", "/ai-assistant.png"],
})

// Update the matcher configuration to properly exclude problematic routes
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    // Include root path
    "/",
  ],
}

