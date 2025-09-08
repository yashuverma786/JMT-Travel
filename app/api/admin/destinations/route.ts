import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { authenticateAdmin } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const destinations = await db.collection("destinations").find({}).toArray()

    return NextResponse.json(destinations)
  } catch (error) {
    console.error("Get destinations error:", error)
    return NextResponse.json({ message: "Failed to fetch destinations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { db } = await connectToDatabase()

    const destination = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user._id,
    }

    const result = await db.collection("destinations").insertOne(destination)

    return NextResponse.json({
      message: "Destination created successfully",
      id: result.insertedId,
    })
  } catch (error) {
    console.error("Create destination error:", error)
    return NextResponse.json({ message: "Failed to create destination" }, { status: 500 })
  }
}
