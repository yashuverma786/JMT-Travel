import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const tripTypes = await db
      .collection("tripTypes")
      .find({ status: { $ne: "inactive" } })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ tripTypes })
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json(
      {
        message: "Error fetching trip types",
        tripTypes: [],
      },
      { status: 500 },
    )
  }
}
