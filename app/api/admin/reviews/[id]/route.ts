import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single review by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) })

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a review by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    if (updateData.rating !== undefined) {
      updateData.rating = Number(updateData.rating)
    }
    if (updateData.tripId && !ObjectId.isValid(updateData.tripId)) {
      return NextResponse.json({ message: "Invalid tripId format" }, { status: 400 })
    }
    if (updateData.userId && !ObjectId.isValid(updateData.userId)) {
      return NextResponse.json({ message: "Invalid userId format" }, { status: 400 })
    }

    const result = await db.collection("reviews").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    const updatedReview = await db.collection("reviews").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Review updated successfully", review: updatedReview })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a review by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
