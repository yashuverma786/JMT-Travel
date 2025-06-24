// Public API for hotels - ensure it filters by status: "approved"
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    // Only fetch approved hotels for the public site
    const hotels = await db.collection("hotels").find({ status: "approved" }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Error fetching approved hotels:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
