import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single lead by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const lead = await db.collection("leads").findOne({ _id: new ObjectId(id) })

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ lead })
  } catch (error) {
    console.error("Error fetching lead:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a lead by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("leads").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 })
    }

    const updatedLead = await db.collection("leads").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Lead updated successfully", lead: updatedLead })
  } catch (error) {
    console.error("Error updating lead:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a lead by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("leads").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Lead deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
