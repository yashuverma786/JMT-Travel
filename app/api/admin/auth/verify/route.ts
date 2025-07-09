import { type NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions || [],
      },
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ message: "Authentication error" }, { status: 500 })
  }
}
