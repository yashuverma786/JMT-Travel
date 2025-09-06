import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const destinations = await db.collection("destinations").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      destinations,
      count: destinations.length,
    })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json(
      {
        destinations: [],
        count: 0,
        error: "Failed to fetch destinations",
      },
      { status: 500 },
    )
  }
}
