import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

// Ensure MONGODB_URI is set in your environment variables
const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("Error: MONGODB_URI environment variable is not set.")
  process.exit(1)
}

const client = new MongoClient(uri)

async function seedAdminUser() {
  try {
    await client.connect()
    console.log("Connected to MongoDB successfully!")

    const db = client.db("jmt_travel") // Use your database name
    const usersCollection = db.collection("admin_users")

    const defaultUsername = "Trip.jmt"
    const defaultPassword = "QAZqaz#JMT0202" // Using the password provided by the user
    const defaultEmail = "admin@jmttravel.com" // Default email for this user

    // Check if the default admin user already exists
    const existingUser = await usersCollection.findOne({ username: defaultUsername })

    if (existingUser) {
      console.log(`User '${defaultUsername}' already exists. Skipping seeding.`)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(defaultPassword, 10) // 10 is the salt rounds

    // Create the default admin user
    const newUser = {
      username: defaultUsername,
      email: defaultEmail,
      password: hashedPassword,
      role: "super_admin", // Assign a super_admin role
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
    console.log(`Username: ${defaultUsername}`)
    console.log(`Password: ${defaultPassword} (Please change this immediately after logging in!)`)
  } catch (error) {
    console.error("Error seeding admin user:", error)
  } finally {
    await client.close()
    console.log("MongoDB connection closed.")
  }
}

seedAdminUser()
