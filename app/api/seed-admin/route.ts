import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@jmttravel.com" })

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = {
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "manage_users",
        "manage_destinations",
        "manage_trips",
        "manage_hotels",
        "manage_transfers",
        "manage_rentals",
        "manage_reviews",
        "manage_blogs",
        "manage_partners",
        "view_analytics",
        "approve_listings",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      userId: result.insertedId,
      credentials: {
        email: "admin@jmttravel.com",
        password: "admin123",
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ message: "Failed to create admin user", error: error.message }, { status: 500 })
  }
}
