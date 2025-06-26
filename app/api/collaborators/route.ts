import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collaborators = await db
      .collection("collaborators")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ collaborators })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
