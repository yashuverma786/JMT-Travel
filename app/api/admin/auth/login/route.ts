import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-jmt-travel-2024"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find admin user
    const admin = await db.collection("admin_users").findOne({ email })

    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: admin._id.toString(),
        email: admin.email,
        role: admin.role || "admin",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: admin._id.toString(),
        email: admin.email,
        username: admin.username || admin.email,
        role: admin.role || "admin",
        permissions: admin.permissions || ["all"],
      },
    })

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
