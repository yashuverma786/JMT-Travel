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
    // Validate required fields
    const { title, destination, tripType, durationDays, price, salePrice } = tripData
    if (!title || !destination || !tripType || durationDays == null || price == null) {
      return NextResponse.json(
        { message: "Missing required fields: title, destination, tripType, durationDays, price." },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const newTrip = {
      ...tripData,
      price: Number.parseFloat(price), // Ensure price is a number
      salePrice: salePrice ? Number.parseFloat(salePrice) : null, // Ensure salePrice is a number or null
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
