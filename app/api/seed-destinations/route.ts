import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const sampleDestinations = [
  {
    name: "Goa",
    country: "India",
    type: "national",
    description: "Beautiful beaches and Portuguese heritage",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Manali",
    country: "India",
    type: "national",
    description: "Hill station in Himachal Pradesh",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Kerala",
    country: "India",
    type: "national",
    description: "God's own country with backwaters",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rajasthan",
    country: "India",
    type: "national",
    description: "Land of kings with rich heritage",
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ladakh",
    country: "India",
    type: "national",
    description: "High altitude desert in the Himalayas",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    isPopular: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing destinations
    await db.collection("destinations").deleteMany({})

    // Insert new destinations
    const result = await db.collection("destinations").insertMany(sampleDestinations)

    return NextResponse.json({
      message: `Successfully seeded ${result.insertedCount} destinations`,
      insertedCount: result.insertedCount,
    })
  } catch (error) {
    console.error("Error seeding destinations:", error)
    return NextResponse.json(
      {
        message: "Error seeding destinations",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
