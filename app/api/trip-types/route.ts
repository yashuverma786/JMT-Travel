import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const tripTypes = await db.collection("trip_types").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      tripTypes: tripTypes.map((type) => ({
        ...type,
        _id: type._id.toString(),
      })),
      count: tripTypes.length,
    })
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json(
      {
        success: false,
        tripTypes: [],
        count: 0,
        error: "Failed to fetch trip types",
      },
      { status: 500 },
    )
  }
}
