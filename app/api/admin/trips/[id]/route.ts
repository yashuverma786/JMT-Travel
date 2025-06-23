import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single trip by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(id) })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a trip by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    // Convert numeric fields to numbers
    const numericFields = [
      "durationDays",
      "durationNights",
      "price",
      "originalPrice",
      "discount",
      "rating",
      "reviewsCount",
      "groupSize",
    ]
    for (const field of numericFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        updateData[field] = Number(updateData[field])
      }
    }

    const result = await db.collection("trips").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    const updatedTrip = await db.collection("trips").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Trip updated successfully", trip: updatedTrip })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a trip by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("trips").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Trip deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
