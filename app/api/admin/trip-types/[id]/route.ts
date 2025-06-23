import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single trip type by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const tripType = await db.collection("trip_types").findOne({ _id: new ObjectId(id) })

    if (!tripType) {
      return NextResponse.json({ message: "Trip type not found" }, { status: 404 })
    }

    return NextResponse.json({ tripType })
  } catch (error) {
    console.error("Error fetching trip type:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a trip type by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("trip_types").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Trip type not found" }, { status: 404 })
    }

    const updatedTripType = await db.collection("trip_types").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Trip type updated successfully", tripType: updatedTripType })
  } catch (error) {
    console.error("Error updating trip type:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a trip type by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("trip_types").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Trip type not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Trip type deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting trip type:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
