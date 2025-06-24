import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple hardcoded check for testing
    if (username === "Trip.jmt" && password === "QAZqaz#JMT0202") {
      const token = jwt.sign({ username: "Trip.jmt", role: "admin" }, process.env.JWT_SECRET || "fallback-secret", {
        expiresIn: "24h",
      })

      return NextResponse.json({
        token,
        user: {
          username: "Trip.jmt",
          role: "admin",
          email: "admin@jmttravel.com",
        },
      })
    }

    // Try database authentication
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ message: "Database not configured" }, { status: 500 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("admin_users").findOne({ username })

    if (!user || user.status !== "active") {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
