import { type NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ message: "Authentication failed" }, { status: 401 })
  }
}
