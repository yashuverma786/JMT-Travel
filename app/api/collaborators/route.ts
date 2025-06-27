import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const collaborators = await db
      .collection("collaborators")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      collaborators,
    })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch collaborators" }, { status: 500 })
  }
}
