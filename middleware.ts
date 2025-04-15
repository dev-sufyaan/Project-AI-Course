import { NextRequest, NextResponse } from 'next/server'

// Clerk middleware removed. You may want to delete this file or add new middleware logic if needed.

// Minimal middleware function to satisfy Next.js requirement
export default function middleware(req: NextRequest) {
  // You can add middleware logic here if needed in the future.
  // For now, it just proceeds to the next handler.
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    // Include root path
    "/",
  ],
};

