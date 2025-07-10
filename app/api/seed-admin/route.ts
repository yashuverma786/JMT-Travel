import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@jmttravel.com" })

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" })
    }

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

    await db.collection("users").insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      credentials: {
        email: "admin@jmttravel.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ message: "Error creating admin user" }, { status: 500 })
  }
}
