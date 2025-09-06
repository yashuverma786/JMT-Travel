import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const destinationName = searchParams.get("destinationName")
    const search = searchParams.get("search")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}

    if (category) {
      query.$or = [{ category: { $regex: category, $options: "i" } }, { tripType: { $regex: category, $options: "i" } }]
    }

    if (destinationName) {
      query.destinationName = { $regex: destinationName, $options: "i" }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { destinationName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const trips = await db
      .collection("trips")
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
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
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}
