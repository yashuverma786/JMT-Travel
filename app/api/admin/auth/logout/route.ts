import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("Logout API called")

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear the HTTP-only cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    console.log("Logout successful")
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 })
  }
}
