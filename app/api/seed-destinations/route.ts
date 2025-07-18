import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

const destinations = [
  {
    name: "Goa",
    country: "India",
    description: "Beautiful beaches and vibrant nightlife",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Kerala",
    country: "India",
    description: "Gods own country with backwaters and hill stations",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rajasthan",
    country: "India",
    description: "Land of kings with magnificent palaces and forts",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Himachal Pradesh",
    country: "India",
    description: "Mountain paradise with snow-capped peaks",
    type: "national",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maldives",
    country: "Maldives",
    description: "Tropical paradise with crystal clear waters",
    type: "international",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dubai",
    country: "UAE",
    description: "Modern city with luxury shopping and architecture",
    type: "international",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=300&fit=crop",
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
    const result = await db.collection("destinations").insertMany(destinations)

    return NextResponse.json({
      message: `Successfully seeded ${result.insertedCount} destinations`,
      insertedIds: result.insertedIds,
    })
  } catch (error) {
    console.error("Error seeding destinations:", error)
    return NextResponse.json({ message: "Failed to seed destinations", error: error.message }, { status: 500 })
  }
}
