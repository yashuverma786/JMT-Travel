import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(params.id) })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Error fetching trip" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const tripData = await request.json()
    const { db } = await connectToDatabase()

    // Get destination name if destinationId is provided
    let destinationName = tripData.destinationName
    if (tripData.destinationId) {
      const destination = await db.collection("destinations").findOne({ _id: new ObjectId(tripData.destinationId) })
      destinationName = destination?.name || "Unknown"
    }

    const updateData = {
      ...tripData,
      destinationName,
      adultPrice: Number(tripData.adultPrice),
      salePrice: Number(tripData.salePrice || tripData.adultPrice),
      durationDays: Number(tripData.durationDays),
      durationNights: Number(tripData.durationNights),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    const updatedTrip = await db.collection("trips").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({ message: "Trip updated successfully", trip: updatedTrip })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ message: "Error updating trip" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("trips").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ message: "Error deleting trip" }, { status: 500 })
  }
}
