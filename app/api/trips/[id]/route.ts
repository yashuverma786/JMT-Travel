import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid trip ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const trip = await db.collection("trips").findOne({
      _id: new ObjectId(id),
      status: "active", // Only show active trips to public
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
