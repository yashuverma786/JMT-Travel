import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_activities"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const activities = await db.collection("activities").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      activities: activities.map((activity) => ({
        ...activity,
        _id: activity._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_activities"])
  if (authCheck) return authCheck

  try {
    const activityData = await request.json()
    const { name, description, imageUrl, category } = activityData

    if (!name) {
      return NextResponse.json({ success: false, message: "Activity name is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newActivity = {
      name,
      description: description || "",
      imageUrl: imageUrl || "/placeholder.svg",
      category: category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("activities").insertOne(newActivity)
    const createdActivity = await db.collection("activities").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Activity created successfully",
        activity: {
          ...createdActivity,
          _id: createdActivity._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
