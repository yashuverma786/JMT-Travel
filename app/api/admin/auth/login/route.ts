import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI environment variable is not set")
      return NextResponse.json({ message: "Database configuration error" }, { status: 500 })
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set")
      return NextResponse.json({ message: "Authentication configuration error" }, { status: 500 })
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    console.log("Attempting login for username:", username)

    const { db } = await connectToDatabase()

    // Find user in database
    const user = await db.collection("admin_users").findOne({ username })

    if (!user) {
      console.log("User not found:", username)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("User found, checking status:", user.status)

    // Check if user is active
    if (user.status !== "active") {
      return NextResponse.json({ message: "Account is inactive. Contact administrator." }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("Invalid password for user:", username)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("Password valid, generating token")

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Update last login
    await db.collection("admin_users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    console.log("Login successful for user:", username)

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        lastLogin: new Date(),
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
