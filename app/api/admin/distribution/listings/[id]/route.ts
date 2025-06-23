import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single distribution listing by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const listing = await db.collection("distribution_listings").findOne({ _id: new ObjectId(id) })

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a distribution listing by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    if (updateData.partnerId && !ObjectId.isValid(updateData.partnerId)) {
      return NextResponse.json({ message: "Invalid partnerId format" }, { status: 400 })
    }

    const result = await db.collection("distribution_listings").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 })
    }

    const updatedListing = await db.collection("distribution_listings").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Listing updated successfully", listing: updatedListing })
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a distribution listing by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("distribution_listings").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
