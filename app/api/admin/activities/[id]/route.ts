import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_activities"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const activity = await db.collection("activities").findOne({ _id: new ObjectId(id) })

    if (!activity) {
      return NextResponse.json({ success: false, message: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      activity: {
        ...activity,
        _id: activity._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_activities"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedActivity = {
      name: updateData.name,
      description: updateData.description || "",
      imageUrl: updateData.imageUrl || "/placeholder.svg",
      category: updateData.category || "General",
      updatedAt: new Date(),
    }

    const result = await db.collection("activities").updateOne({ _id: new ObjectId(id) }, { $set: updatedActivity })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Activity not found" }, { status: 404 })
    }

    const activity = await db.collection("activities").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Activity updated successfully",
      activity: {
        ...activity,
        _id: activity._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating activity:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_activities"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("activities").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Activity deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting activity:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
