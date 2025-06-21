import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const users = await db
      .collection("admin_users")
      .find(
        {},
        {
          projection: { password: 0 }, // Exclude password from response
        },
      )
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    const { username, email, password, role, permissions, status } = userData

    if (!username || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("admin_users").findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this username or email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      status: status || "active",
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await db.collection("admin_users").insertOne(newUser)

    // Return user without password
    const { password: _, ...userResponse } = newUser

    return NextResponse.json(
      {
        user: { ...userResponse, id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
