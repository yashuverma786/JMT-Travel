import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const destinations = await db
      .collection("destinations")
      .find({ status: { $ne: "inactive" } })
      .sort({ popular: -1, trending: -1, name: 1 })
      .toArray()

    return NextResponse.json({ destinations })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json(
      {
        message: "Error fetching destinations",
        destinations: [],
      },
      { status: 500 },
    )
  }
}
