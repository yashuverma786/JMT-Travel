import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const defaultUsername = "Trip.jmt"
    const defaultPassword = "QAZqaz#JMT0202"
    const defaultEmail = "admin@jmttravel.com"

    // Check if admin user already exists
    const existingUser = await db.collection("admin_users").findOne({
      $or: [{ username: defaultUsername }, { email: defaultEmail }],
    })

    if (existingUser) {
      return NextResponse.json({
        message: "Admin user already exists",
        user: {
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
        },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    // Create the admin user
    const newUser = {
      username: defaultUsername,
      email: defaultEmail,
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "manage_users",
        "manage_destinations",
        "manage_trips",
        "manage_bookings",
        "manage_reviews",
        "manage_blogs",
        "manage_partners",
        "view_analytics",
        "approve_listings",
        "manage_payments",
      ],
      status: "active",
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await db.collection("admin_users").insertOne(newUser)

    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        id: result.insertedId,
        username: defaultUsername,
        email: defaultEmail,
        role: "super_admin",
      },
      credentials: {
        email: defaultEmail,
        password: defaultPassword,
        note: "Please change this password after first login",
      },
    })
  } catch (error) {
    console.error("Error seeding admin user:", error)
    return NextResponse.json(
      {
        message: "Error creating admin user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
