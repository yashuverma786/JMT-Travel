import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const trips = await db
      .collection("trips")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("trips").countDocuments({ status: "active" })

    return NextResponse.json({
      success: true,
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
    return NextResponse.json({ success: false, error: "Failed to fetch trips" }, { status: 500 })
  }
}
