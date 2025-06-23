import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const { db, client } = await connectToDatabase()
    const usersCollection = db.collection("admin_users")

    const defaultUsername = "Trip.jmt"
    const defaultPassword = "QAZqaz#JMT0202"
    const defaultEmail = "travel@journeymytrip.com"

    // Check if the default admin user already exists
    const existingUser = await usersCollection.findOne({ username: defaultUsername })

    if (existingUser) {
      console.log(`User '${defaultUsername}' already exists. Skipping seeding.`)
      return NextResponse.json(
        { message: `User '${defaultUsername}' already exists. No action taken.` },
        { status: 200 },
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10) // 10 is the salt rounds

    // Create the default admin user
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

    const result = await usersCollection.insertOne(newUser)
    console.log(`Successfully seeded default admin user: ${defaultUsername} with ID: ${result.insertedId}`)

    return NextResponse.json(
      {
        message: `Successfully seeded default admin user: ${defaultUsername}`,
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error seeding admin user via API:", error)
    return NextResponse.json({ message: "Internal server error during seeding." }, { status: 500 })
  }
}
