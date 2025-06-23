import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all trips
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const trips = await db.collection("trips").find({}).toArray()
    return NextResponse.json({ trips })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new trip
export async function POST(request: NextRequest) {
  try {
    const tripData = await request.json()
    const {
      title,
      destination,
      tripType,
      durationDays,
      durationNights,
      price,
      originalPrice,
      discount,
      rating,
      reviewsCount,
      imageUrl,
      description,
      highlights,
      inclusions,
      exclusions,
      itinerary,
      groupSize,
      status,
    } = tripData

    if (!title || !destination || !tripType || !durationDays || !price) {
      return NextResponse.json({ message: "Missing required trip fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("trips").insertOne({
      title,
      destination,
      tripType,
      durationDays: Number(durationDays),
      durationNights: Number(durationNights),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discount: discount ? Number(discount) : null,
      rating: rating ? Number(rating) : null,
      reviewsCount: reviewsCount ? Number(reviewsCount) : null,
      imageUrl: imageUrl || "/placeholder.svg",
      description: description || "",
      highlights: highlights || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      itinerary: itinerary || [],
      groupSize: groupSize ? Number(groupSize) : null,
      status: status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Trip created successfully",
        trip: { _id: result.insertedId, ...tripData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
