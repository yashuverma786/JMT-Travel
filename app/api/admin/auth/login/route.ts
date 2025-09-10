import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-jmt-travel-2024"

export async function POST(request: NextRequest) {
  try {
    console.log("Login API called")

    const body = await request.json()
    const { email, password } = body

    console.log("Login attempt for email:", email)

    if (!email || !password) {
      console.log("Missing email or password")
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    console.log("Connected to database")

    // Find admin user
    const admin = await db.collection("admin_users").findOne({ email })
    console.log("Admin found:", admin ? "Yes" : "No")

    if (!admin) {
      console.log("Admin not found")
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password)
    console.log("Password valid:", isValidPassword)

    if (!isValidPassword) {
      console.log("Invalid password")
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
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

    console.log("Token generated successfully")

    // Create response with user data
    const userData = {
      _id: admin._id.toString(),
      email: admin.email,
      username: admin.username || admin.email,
      role: admin.role || "admin",
      permissions: admin.permissions || ["all"],
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData,
      token: token,
    })

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("Login successful, returning response")
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
