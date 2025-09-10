import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await db.collection("admin_users").findOne({ email: "admin@jmttravel.com" })

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        credentials: {
          email: "admin@jmttravel.com",
          password: "admin123",
        },
      })
    }

    const hashedPassword = await bcrypt.hash("admin123", 12)

    await db.collection("admin_users").insertOne({
      username: "admin",
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "manage_destinations",
        "manage_trips",
        "manage_hotels",
        "manage_transfers",
        "manage_users",
        "manage_reviews",
        "manage_blogs",
        "manage_activities",
      ],
      status: "active",
      createdAt: new Date(),
      lastLogin: null,
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "admin@jmttravel.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ success: false, message: "Failed to create admin user" }, { status: 500 })
  }
}
