import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tripType = searchParams.get("tripType")
    const destination = searchParams.get("destination")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    // Build filter query
    const filter: any = { status: "active" }

    if (tripType) {
      filter.tripType = tripType
    }

    if (destination) {
      filter.destinationId = destination
    }

    if (minPrice || maxPrice) {
      filter.salePrice = {}
      if (minPrice) filter.salePrice.$gte = Number.parseInt(minPrice)
      if (maxPrice) filter.salePrice.$lte = Number.parseInt(maxPrice)
    }

    // Get trips with destination information
    const trips = await db
      .collection("trips")
      .aggregate([
        { $match: filter },
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
            destinationCountry: { $arrayElemAt: ["$destination.country", 0] },
          },
        },
        {
          $project: {
            destination: 0,
          },
        },
        { $sort: { isTrending: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray()

    // Get total count for pagination
    const totalCount = await db.collection("trips").countDocuments(filter)

    return NextResponse.json({
      trips,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Error fetching trips", trips: [] }, { status: 500 })
  }
}
