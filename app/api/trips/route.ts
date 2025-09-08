import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")
    const tripType = searchParams.get("tripType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const duration = searchParams.get("duration")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { status: { $ne: "inactive" } }

    if (category && category !== "all") {
      query.tripType = { $regex: category, $options: "i" }
    }
    if (destination) {
      query.$or = [
        { destinationName: { $regex: destination, $options: "i" } },
        { title: { $regex: destination, $options: "i" } },
      ]
    }
    if (tripType && tripType !== "all") {
      query.tripType = { $regex: tripType, $options: "i" }
    }
    if (minPrice) {
      query.salePrice = { $gte: Number(minPrice) }
    }
    if (maxPrice) {
      if (query.salePrice) {
        query.salePrice.$lte = Number(maxPrice)
      } else {
        query.salePrice = { $lte: Number(maxPrice) }
      }
    }
    if (duration) {
      query.durationDays = Number(duration)
    }

    const skip = (page - 1) * limit

    const [trips, totalCount] = await Promise.all([
      db.collection("trips").find(query).sort({ isTrending: -1, createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("trips").countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      trips: trips.map((trip) => ({
        ...trip,
        _id: trip._id.toString(),
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json(
      {
        success: false,
        trips: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0, hasNext: false, hasPrev: false },
        error: "Failed to fetch trips",
      },
      { status: 500 },
    )
  }
}
