// Public API endpoint to fetch published hotels for the frontend
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    // Only fetch hotels that are 'published'
    const hotels = await db.collection("hotels").find({ status: "published" }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Error fetching published hotels:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
