import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const requests = await db.collection("custom_tour_requests").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error fetching custom tour requests:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST route for users to submit custom tour requests (from the frontend form)
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    // Basic validation
    if (!requestData.fullName || !requestData.email || !requestData.destination || !requestData.tripType) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newRequest = {
      ...requestData,
      status: "pending", // Initial status
      createdAt: new Date(),
    }
    const result = await db.collection("custom_tour_requests").insertOne(newRequest)
    return NextResponse.json(
      { message: "Custom tour request submitted successfully.", requestId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error submitting custom tour request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
