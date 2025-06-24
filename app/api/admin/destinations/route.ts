import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const destinations = await db.collection("destinations").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ destinations })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const destinationData = await request.json()
    const { name, country, description, imageUrl, popular, trending, type } = destinationData // Added type

    if (!name || !country) {
      // Type is optional for now, can be made required
      return NextResponse.json({ message: "Name and country are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newDestination = {
      name,
      country,
      description: description || "",
      imageUrl: imageUrl || "/placeholder.svg",
      popular: popular || false,
      trending: trending || false,
      type: type || null, // Store type, default to null if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection("destinations").insertOne(newDestination)

    return NextResponse.json(
      {
        message: "Destination created successfully",
        destination: { _id: result.insertedId, ...newDestination },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
