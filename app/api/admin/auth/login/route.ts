import { NextResponse, type NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt for:", email)

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find user in the admin_users collection
    const user = await db.collection("admin_users").findOne({
      $or: [
        { email: email },
        { username: email }, // Allow login with username as well
      ],
    })

    console.log("User found:", user ? "Yes" : "No")

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log("Password valid:", isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    // Update last login
    await db.collection("admin_users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    // Create response with token
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions: user.permissions || [],
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("admin-token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
