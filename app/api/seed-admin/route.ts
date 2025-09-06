import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin user already exists
    const existingAdmin = await db.collection("admin_users").findOne({
      $or: [{ email: "admin@jmttravel.com" }, { username: "Trip.jmt" }],
    })

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        credentials: {
          email: "admin@jmttravel.com",
          password: "QAZqaz#JMT0202",
        },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("QAZqaz#JMT0202", 12)

    // Create admin user
    const adminUser = {
      username: "Trip.jmt",
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "super_admin",
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
        "manage_rentals",
        "manage_custom_requests",
      ],
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await db.collection("admin_users").insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      userId: result.insertedId,
      credentials: {
        email: "admin@jmttravel.com",
        password: "QAZqaz#JMT0202",
      },
    })
  } catch (error) {
    console.error("Seed admin error:", error)
    return NextResponse.json({ message: "Failed to create admin user" }, { status: 500 })
  }
}
