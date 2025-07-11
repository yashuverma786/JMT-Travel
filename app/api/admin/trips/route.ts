import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()

    const trips = await db.collection("trips").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(trips)
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const tripData = await request.json()
    const { db } = await connectToDatabase()

    // Validate required fields
    if (!tripData.title || !tripData.destinationId || !tripData.adultPrice) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get destination name
    const destination = await db.collection("destinations").findOne({ _id: new ObjectId(tripData.destinationId) })

    const newTrip = {
      ...tripData,
      destinationName: destination?.name || "Unknown",
      adultPrice: Number(tripData.adultPrice),
      salePrice: Number(tripData.salePrice || tripData.adultPrice),
      durationDays: Number(tripData.durationDays),
      durationNights: Number(tripData.durationNights),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").insertOne(newTrip)
    const createdTrip = await db.collection("trips").findOne({ _id: result.insertedId })

    return NextResponse.json(createdTrip, { status: 201 })
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Error creating trip" }, { status: 500 })
  }
}
