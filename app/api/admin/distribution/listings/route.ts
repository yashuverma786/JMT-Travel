import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const listings = await db.collection("distribution_listings").find({}).toArray()

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json()

    const { db } = await connectToDatabase()

    const newListing = {
      ...listingData,
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    }

    const result = await db.collection("distribution_listings").insertOne(newListing)

    return NextResponse.json(
      {
        listing: { ...newListing, id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
