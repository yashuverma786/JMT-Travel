import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Check if admin already exists
    const existingAdmin = await db.collection("admin_users").findOne({
      $or: [{ email: "admin@jmttravel.com" }, { username: "Trip.jmt" }],
    })

    if (existingAdmin) {
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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
