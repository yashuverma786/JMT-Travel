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

    return NextResponse.json(
      trips.map((trip) => ({
        ...trip,
        _id: trip._id.toString(),
      })),
    )
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

    if (!tripData.title || !tripData.destinationId || !tripData.adultPrice) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get destination name
    let destinationName = "Unknown"
    if (ObjectId.isValid(tripData.destinationId)) {
      const destination = await db.collection("destinations").findOne({ _id: new ObjectId(tripData.destinationId) })
      destinationName = destination?.name || "Unknown"
    }

    const newTrip = {
      title: tripData.title,
      description: tripData.description || "",
      destinationId: tripData.destinationId,
      destinationName,
      tripType: tripData.tripType || "leisure",
      durationDays: Number(tripData.durationDays) || 1,
      durationNights: Number(tripData.durationNights) || 0,
      adultPrice: Number(tripData.adultPrice),
      salePrice: Number(tripData.salePrice || tripData.adultPrice),
      childPrice: Number(tripData.childPrice || 0),
      infantPrice: Number(tripData.infantPrice || 0),
      images: tripData.images || [],
      inclusions: tripData.inclusions || [],
      exclusions: tripData.exclusions || [],
      itinerary: tripData.itinerary || [],
      status: tripData.status || "active",
      isTrending: Boolean(tripData.isTrending),
      isPopular: Boolean(tripData.isPopular),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").insertOne(newTrip)
    const createdTrip = await db.collection("trips").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        ...createdTrip,
        _id: createdTrip._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Error creating trip" }, { status: 500 })
  }
}
