import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user already exists
    const existingUser = await db.collection("admin_users").findOne({
      email: "admin@jmttravel.com",
    })

    if (existingUser) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("QAZqaz#JMT0202", 12)

    // Create admin user
    const adminUser = {
      username: "Trip.jmt",
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "admin",
      permissions: [
        "manage_trips",
        "manage_destinations",
        "manage_users",
        "manage_reviews",
        "manage_activities",
        "manage_blogs",
        "manage_collaborators",
        "manage_leads",
        "manage_hotels",
        "manage_transfers",
        "manage_custom_requests",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("admin_users").insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ message: "Error creating admin user" }, { status: 500 })
  }
}
