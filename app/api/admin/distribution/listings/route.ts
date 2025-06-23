import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET all distribution listings
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const listings = await db.collection("distribution_listings").find({}).toArray()
    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Error fetching distribution listings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new distribution listing (e.g., from a partner)
export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json()
    const { title, partnerId, type, description, imageUrl, status } = listingData

    if (!title || !partnerId || !type) {
      return NextResponse.json({ message: "Missing required listing fields" }, { status: 400 })
    }
    if (!ObjectId.isValid(partnerId)) {
      return NextResponse.json({ message: "Invalid partnerId format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("distribution_listings").insertOne({
      title,
      partnerId: new ObjectId(partnerId),
      type, // e.g., "hotel", "tour", "activity", "restaurant"
      description: description || "",
      imageUrl: imageUrl || "/placeholder.svg",
      status: status || "pending", // pending, approved, rejected
      submittedAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Listing submitted successfully",
        listing: { _id: result.insertedId, ...listingData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating distribution listing:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
