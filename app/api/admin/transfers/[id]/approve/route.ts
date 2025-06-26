import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid transfer ID format" }, { status: 400 })
    }

    const { status } = await request.json()
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status provided. Must be 'approved' or 'rejected'." },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const result = await db
      .collection("transfers")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Transfer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: `Transfer status updated to ${status}` })
  } catch (error) {
    console.error("Error updating transfer status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
