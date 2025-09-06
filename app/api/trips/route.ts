import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tripType = searchParams.get("tripType")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")
    const destinationName = searchParams.get("destinationName")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()

    // Build filter query
    const filter: any = { status: "active" }

    if (tripType) {
      filter.tripType = { $regex: new RegExp(tripType, "i") }
    }

    if (category) {
      filter.$or = [
        { tripType: { $regex: new RegExp(category, "i") } },
        { category: { $regex: new RegExp(category, "i") } },
      ]
    }

    if (destination) {
      if (ObjectId.isValid(destination)) {
        filter.destinationId = new ObjectId(destination)
      } else {
        filter.destinationName = { $regex: new RegExp(destination, "i") }
      }
    }

    if (destinationName) {
      filter.destinationName = { $regex: new RegExp(destinationName, "i") }
    }

    if (minPrice || maxPrice) {
      filter.$or = [{ salePrice: {} }, { adultPrice: {} }]

      if (minPrice) {
        filter.$or[0].salePrice.$gte = Number.parseInt(minPrice)
        filter.$or[1].adultPrice.$gte = Number.parseInt(minPrice)
      }
      if (maxPrice) {
        filter.$or[0].salePrice.$lte = Number.parseInt(maxPrice)
        filter.$or[1].adultPrice.$lte = Number.parseInt(maxPrice)
      }
    }

    // Get trips with destination information
    const trips = await db
      .collection("trips")
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "destinations",
            let: { destId: { $toObjectId: "$destinationId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$destId"] } } }],
            as: "destination",
          },
        },
        {
          $addFields: {
            destinationName: {
              $ifNull: ["$destinationName", { $arrayElemAt: ["$destination.name", 0] }],
            },
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
    return NextResponse.json(
      {
        message: "Error fetching trips",
        trips: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      },
      { status: 500 },
    )
  }
}
