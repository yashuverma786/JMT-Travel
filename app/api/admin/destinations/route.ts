import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all destinations
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const destinations = await db.collection("destinations").find({}).toArray()
    return NextResponse.json({ destinations })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new destination
export async function POST(request: NextRequest) {
  try {
    const destinationData = await request.json()
    const { name, country, description, imageUrl, popular, trending, type } = destinationData

    if (!name || !country || !type) {
      return NextResponse.json({ message: "Name, country, and type are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("destinations").insertOne({
      name,
      country,
      description: description || "",
      imageUrl: imageUrl || "/placeholder.svg",
      popular: popular || false,
      trending: trending || false,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Destination created successfully",
        destination: { _id: result.insertedId, ...destinationData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
