import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all trip types
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const tripTypes = await db.collection("trip_types").find({}).toArray()
    return NextResponse.json({ tripTypes })
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new trip type
export async function POST(request: NextRequest) {
  try {
    const tripTypeData = await request.json()
    const { name, description, iconUrl } = tripTypeData

    if (!name) {
      return NextResponse.json({ message: "Trip type name is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("trip_types").insertOne({
      name,
      description: description || "",
      iconUrl: iconUrl || "/placeholder.svg",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Trip type created successfully",
        tripType: { _id: result.insertedId, ...tripTypeData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating trip type:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
