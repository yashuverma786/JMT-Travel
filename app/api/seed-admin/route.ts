import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await db.collection("admin_users").findOne({
      email: "admin@jmttravel.com",
    })

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin user already exists",
        email: "admin@jmttravel.com",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("QAZqaz#JMT0202", 12)

    // Create admin user
    const adminUser = {
      email: "admin@jmttravel.com",
      password: hashedPassword,
      username: "JMT Admin",
      role: "super_admin",
      permissions: ["all"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("admin_users").insertOne(adminUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      email: "admin@jmttravel.com",
      password: "QAZqaz#JMT0202",
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Seed admin error:", error)
    return NextResponse.json({ message: "Failed to create admin user" }, { status: 500 })
  }
}
