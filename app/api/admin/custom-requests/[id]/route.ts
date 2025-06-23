import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { status, ...updateData } = await request.json() // Admin might update other fields too

    if (!status && Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No update data provided." }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const finalUpdateData: any = { ...updateData }
    if (status) {
      finalUpdateData.status = status
    }
    finalUpdateData.updatedAt = new Date()

    const result = await db
      .collection("custom_tour_requests")
      .updateOne({ _id: new ObjectId(id) }, { $set: finalUpdateData })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Request not found" }, { status: 404 })

    const updatedRequest = await db.collection("custom_tour_requests").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: "Request updated successfully", request: updatedRequest })
  } catch (error) {
    console.error("Error updating custom tour request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
