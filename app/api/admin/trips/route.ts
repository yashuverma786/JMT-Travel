import { NextResponse, type NextRequest } from "next/server"
import { checkPermissions } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const { db } = await connectToDatabase()

    // Get trips with destination names
    const trips = await db
      .collection("trips")
      .aggregate([
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
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json(trips)
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const data = await request.json()
    const { db } = await connectToDatabase()

    // Convert destinationId to ObjectId if it's a string
    const { ObjectId } = require("mongodb")
    if (data.destinationId && typeof data.destinationId === "string") {
      data.destinationId = new ObjectId(data.destinationId)
    }

    const tripData = {
      ...data,
      adultPrice: Number.parseFloat(data.adultPrice) || 0,
      salePrice: Number.parseFloat(data.salePrice) || 0,
      childPrice: Number.parseFloat(data.childPrice) || 0,
      durationDays: Number.parseInt(data.durationDays) || 0,
      durationNights: Number.parseInt(data.durationNights) || 0,
      minPax: Number.parseInt(data.minPax) || 1,
      maxPax: Number.parseInt(data.maxPax) || 10,
      highlights: Array.isArray(data.highlights) ? data.highlights.filter((h) => h.trim()) : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions.filter((i) => i.trim()) : [],
      exclusions: Array.isArray(data.exclusions) ? data.exclusions.filter((e) => e.trim()) : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").insertOne(tripData)

    // Return the created trip with destination name
    const createdTrip = await db
      .collection("trips")
      .aggregate([
        { $match: { _id: result.insertedId } },
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

    return NextResponse.json(createdTrip[0], { status: 201 })
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Error creating trip" }, { status: 500 })
  }
}
