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

    // Convert destinationId to ObjectId if it's a string
    if (updateData.destinationId && typeof updateData.destinationId === "string") {
      updateData.destinationId = new ObjectId(updateData.destinationId)
    }

    // Ensure numeric fields are numbers
    if (updateData.adultPrice) {
      updateData.adultPrice = Number.parseFloat(updateData.adultPrice)
    }
    if (updateData.salePrice) {
      updateData.salePrice = Number.parseFloat(updateData.salePrice)
    }
    if (updateData.childPrice) {
      updateData.childPrice = Number.parseFloat(updateData.childPrice)
    }
    if (updateData.durationDays) {
      updateData.durationDays = Number.parseInt(updateData.durationDays)
    }
    if (updateData.durationNights) {
      updateData.durationNights = Number.parseInt(updateData.durationNights)
    }
    if (updateData.minPax) {
      updateData.minPax = Number.parseInt(updateData.minPax)
    }
    if (updateData.maxPax) {
      updateData.maxPax = Number.parseInt(updateData.maxPax)
    }

    // Ensure arrays are handled correctly
    updateData.highlights = Array.isArray(updateData.highlights) ? updateData.highlights.filter((h) => h.trim()) : []
    updateData.inclusions = Array.isArray(updateData.inclusions) ? updateData.inclusions.filter((i) => i.trim()) : []
    updateData.exclusions = Array.isArray(updateData.exclusions) ? updateData.exclusions.filter((e) => e.trim()) : []
    updateData.itinerary = Array.isArray(updateData.itinerary) ? updateData.itinerary : []
    updateData.galleryImages = Array.isArray(updateData.galleryImages) ? updateData.galleryImages : []

    const result = await db
      .collection("trips")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Trip not found" }, { status: 404 })

    // Return updated trip with destination name
    const updatedTrip = await db
      .collection("trips")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "destinations",
            localField: "destinationId",
            foreignField: "_id",
            as: "destination",
          },
        },
        {
          $addFields: {
            destinationName: { $arrayElemAt: ["$destination.name", 0] },
          },
        },
        {
          $project: {
            destination: 0,
          },
        },
      ])
      .toArray()

    return NextResponse.json({ message: "Trip updated successfully", trip: updatedTrip[0] })
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
