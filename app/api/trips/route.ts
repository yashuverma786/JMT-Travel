import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")
    const tripType = searchParams.get("tripType")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { status: { $ne: "inactive" } }

    if (category && category !== "all") {
      query.$or = [
        { category: { $regex: new RegExp(category, "i") } },
        { tripType: { $regex: new RegExp(category, "i") } },
      ]
    }

    if (tripType && tripType !== "all") {
      query.tripType = { $regex: new RegExp(tripType, "i") }
    }

    if (destination) {
      query.$or = [
        { destinationName: { $regex: new RegExp(destination, "i") } },
        { title: { $regex: new RegExp(destination, "i") } },
      ]
    }

    const skip = (page - 1) * limit

    const trips = await db
      .collection("trips")
      .find(query)
      .sort({ featured: -1, isTrending: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("trips").countDocuments(query)

    return NextResponse.json({
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json(
      {
        message: "Error fetching trips",
        trips: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      },
      { status: 500 },
    )
  }
}
