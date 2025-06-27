import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")

    const { db } = await connectToDatabase()

    // Build filter query
    const filter: any = { status: "active" }
    if (category) filter.category = category
    if (destination) filter.destinationName = new RegExp(destination, "i")

    const skip = (page - 1) * limit

    const trips = await db.collection("trips").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    const total = await db.collection("trips").countDocuments(filter)

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
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
