import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    // Only fetch approved transfers for the public site
    const transfers = await db.collection("transfers").find({ status: "approved" }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ transfers })
  } catch (error) {
    console.error("Error fetching approved transfers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
