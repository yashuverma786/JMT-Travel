import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    const { db } = await connectToDatabase()
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(id) })
    if (!trip) return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    // Ensure arrays are handled correctly
    updateData.imageUrls = updateData.imageUrls || []
    updateData.itinerary = updateData.itinerary || []
    updateData.faqs = updateData.faqs || []
    updateData.inclusions = updateData.inclusions || []
    updateData.exclusions = updateData.exclusions || []

    if (updateData.price) {
      updateData.price = Number.parseFloat(updateData.price)
    }
    if (updateData.salePrice) {
      updateData.salePrice = Number.parseFloat(updateData.salePrice)
    } else if (updateData.hasOwnProperty("salePrice") && !updateData.salePrice) {
      updateData.salePrice = null // Allow clearing sale price
    }

    const result = await db
      .collection("trips")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Trip not found" }, { status: 404 })

    const updatedTrip = await db.collection("trips").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: "Trip updated successfully", trip: updatedTrip })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const result = await db.collection("trips").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
