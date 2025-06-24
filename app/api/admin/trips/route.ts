import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const trips = await db.collection("trips").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ trips })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const tripData = await request.json()
    const { title, destinationId, tripType, durationDays, normalPrice, salePrice } = tripData // Added normalPrice, salePrice, changed destination to destinationId
    if (!title || !destinationId || !tripType || durationDays == null || normalPrice == null) {
      return NextResponse.json(
        { message: "Missing required fields: title, destinationId, tripType, durationDays, normalPrice." },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const newTrip = {
      ...tripData,
      normalPrice: Number.parseFloat(normalPrice),
      salePrice: salePrice ? Number.parseFloat(salePrice) : null,
      destinationId, // Ensure this is stored
      imageUrls: tripData.imageUrls || [],
      itinerary: tripData.itinerary || [],
      faqs: tripData.faqs || [],
      inclusions: tripData.inclusions || [],
      exclusions: tripData.exclusions || [],
      trending: tripData.trending || false,
      status: tripData.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection("trips").insertOne(newTrip)
    return NextResponse.json(
      { message: "Trip created successfully", trip: { _id: result.insertedId, ...newTrip } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
