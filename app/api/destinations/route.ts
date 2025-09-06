import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const destinations = await db
      .collection("destinations")
      .find({ $or: [{ popular: true }, { trending: true }] })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json(destinations)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ message: "Error fetching destinations" }, { status: 500 })
  }
}
