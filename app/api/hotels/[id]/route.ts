// Public API endpoint to fetch a single published hotel by ID
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid hotel ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id), status: "published" })

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found or not published" }, { status: 404 })
    }

    return NextResponse.json({ hotel })
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
