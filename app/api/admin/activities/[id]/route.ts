import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single activity by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const activity = await db.collection("activities").findOne({ _id: new ObjectId(id) })

    if (!activity) {
      return NextResponse.json({ message: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) an activity by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("activities").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Activity not found" }, { status: 404 })
    }

    const updatedActivity = await db.collection("activities").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Activity updated successfully", activity: updatedActivity })
  } catch (error) {
    console.error("Error updating activity:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE an activity by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("activities").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Activity deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting activity:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
