import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single destination by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const destination = await db.collection("destinations").findOne({ _id: new ObjectId(id) })

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ destination })
  } catch (error) {
    console.error("Error fetching destination:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a destination by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("destinations").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    const updatedDestination = await db.collection("destinations").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Destination updated successfully", destination: updatedDestination })
  } catch (error) {
    console.error("Error updating destination:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a destination by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("destinations").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Destination deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting destination:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
