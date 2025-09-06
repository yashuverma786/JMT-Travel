import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = { status: "active" }

    if (category && category !== "all") {
      query.tripType = { $regex: category, $options: "i" }
    }

    if (destination) {
      query.$or = [
        { destinationName: { $regex: destination, $options: "i" } },
        { title: { $regex: destination, $options: "i" } },
      ]
    }

    const skip = (page - 1) * limit

    const [trips, total] = await Promise.all([
      db.collection("trips").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("trips").countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 })
  }
}
