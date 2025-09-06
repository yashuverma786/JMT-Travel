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

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}
    if (category && category !== "all") {
      query.tripType = { $regex: category, $options: "i" }
    }
    if (destination) {
      query.destinationName = { $regex: destination, $options: "i" }
    }
    if (tripType && tripType !== "all") {
      query.tripType = { $regex: tripType, $options: "i" }
    }

    const skip = (page - 1) * limit

    const [trips, totalCount] = await Promise.all([
      db.collection("trips").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("trips").countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      trips,
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
        trips: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0, hasNext: false, hasPrev: false },
        error: "Failed to fetch trips",
      },
      { status: 500 },
    )
  }
}
