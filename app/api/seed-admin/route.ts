import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Delete existing admin user if exists
    await db.collection("users").deleteMany({ email: "admin@jmttravel.com" })

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 12)

    // Create admin user
    const adminUser = {
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "manage_trips",
        "manage_destinations",
        "manage_hotels",
        "manage_transfers",
        "manage_users",
        "manage_reviews",
        "manage_blogs",
        "manage_activities",
        "view_analytics",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(adminUser)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: result.insertedId,
      credentials: {
        email: "admin@jmttravel.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error creating admin user",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user exists
    const adminUser = await db.collection("users").findOne({ email: "admin@jmttravel.com" })

    return NextResponse.json({
      exists: !!adminUser,
      user: adminUser ? { email: adminUser.email, role: adminUser.role } : null,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
