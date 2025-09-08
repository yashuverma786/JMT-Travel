import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const type = searchParams.get("type")
    const country = searchParams.get("country")
    const search = searchParams.get("search")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}
    if (type && type !== "all") {
      query.type = { $regex: type, $options: "i" }
    }
    if (country && country !== "all") {
      query.country = { $regex: country, $options: "i" }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [destinations, totalCount] = await Promise.all([
      db
        .collection("destinations")
        .find(query)
        .sort({ trending: -1, popular: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("destinations").countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      destinations: destinations.map((dest) => ({
        ...dest,
        _id: dest._id.toString(),
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
    console.error("Error fetching destinations:", error)
    return NextResponse.json(
      {
        success: false,
        destinations: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false },
        error: "Failed to fetch destinations",
      },
      { status: 500 },
    )
  }
}
