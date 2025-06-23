import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET a single collaborator by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const collaborator = await db.collection("collaborators").findOne({ _id: new ObjectId(id) })

    if (!collaborator) {
      return NextResponse.json({ message: "Collaborator not found" }, { status: 404 })
    }

    return NextResponse.json({ collaborator })
  } catch (error) {
    console.error("Error fetching collaborator:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT (Update) a collaborator by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const result = await db.collection("collaborators").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Collaborator not found" }, { status: 404 })
    }

    const updatedCollaborator = await db.collection("collaborators").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Collaborator updated successfully", collaborator: updatedCollaborator })
  } catch (error) {
    console.error("Error updating collaborator:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE a collaborator by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("collaborators").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Collaborator not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Collaborator deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting collaborator:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
