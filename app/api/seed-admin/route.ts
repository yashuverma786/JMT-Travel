import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    console.log("Seed admin API called")

    const { db } = await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await db.collection("admin_users").findOne({
      email: "admin@jmttravel.com",
    })

    if (existingAdmin) {
      console.log("Admin already exists")
      return NextResponse.json({
        success: true,
        message: "Admin user already exists",
        credentials: {
          email: "admin@jmttravel.com",
          password: "QAZqaz#JMT0202",
        },
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("QAZqaz#JMT0202", 12)

    // Create admin user
    const adminUser = {
      email: "admin@jmttravel.com",
      password: hashedPassword,
      username: "Admin",
      role: "admin",
      permissions: ["all"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("admin_users").insertOne(adminUser)
    console.log("Admin user created:", result.insertedId)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        email: "admin@jmttravel.com",
        password: "QAZqaz#JMT0202",
      },
    })
  } catch (error) {
    console.error("Seed admin error:", error)
    return NextResponse.json({ success: false, message: "Failed to create admin user" }, { status: 500 })
  }
}
