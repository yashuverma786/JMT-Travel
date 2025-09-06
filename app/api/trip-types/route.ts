import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const tripTypes = await db.collection("trip_types").find({}).toArray()

    return NextResponse.json(tripTypes)
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json({ error: "Failed to fetch trip types" }, { status: 500 })
  }
}
