import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) })

    if (!hotel) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })
    return NextResponse.json({ hotel })
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    // Ensure arrays are handled correctly if empty
    updateData.images = updateData.images || []
    updateData.amenities = updateData.amenities || []

    const result = await db
      .collection("hotels")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })

    const updatedHotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: "Hotel updated successfully", hotel: updatedHotel })
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const result = await db.collection("hotels").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })
    return NextResponse.json({ message: "Hotel deleted successfully" })
  } catch (error) {
    console.error("Error deleting hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
