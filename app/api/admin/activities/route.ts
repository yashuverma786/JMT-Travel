import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all activities
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const activities = await db.collection("activities").find({}).toArray()
    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new activity
export async function POST(request: NextRequest) {
  try {
    const activityData = await request.json()
    const { name, description, imageUrl, category } = activityData

    if (!name) {
      return NextResponse.json({ message: "Activity name is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("activities").insertOne({
      name,
      description: description || "",
      imageUrl: imageUrl || "/placeholder.svg",
      category: category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Activity created successfully",
        activity: { _id: result.insertedId, ...activityData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
