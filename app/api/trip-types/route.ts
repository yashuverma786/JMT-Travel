import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try both collection names for compatibility
    let tripTypes = await db.collection("trip_types").find({}).sort({ name: 1 }).toArray()

    if (tripTypes.length === 0) {
      tripTypes = await db.collection("tripTypes").find({}).sort({ name: 1 }).toArray()
    }

    return NextResponse.json({ tripTypes })
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json(
      {
        message: "Error fetching trip types",
        tripTypes: [],
      },
      { status: 500 },
    )
  }
}
