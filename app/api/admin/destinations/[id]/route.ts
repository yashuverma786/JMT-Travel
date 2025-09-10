import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const destination = await db.collection("destinations").findOne({ _id: new ObjectId(id) })

    if (!destination) {
      return NextResponse.json({ success: false, message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      destination: {
        ...destination,
        _id: destination._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching destination:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_destinations"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedDestination = {
      name: updateData.name,
      country: updateData.country,
      description: updateData.description || "",
      imageUrl: updateData.imageUrl || "/placeholder.svg",
      type: updateData.type || "",
      popular: Boolean(updateData.popular),
      trending: Boolean(updateData.trending),
      updatedAt: new Date(),
    }

    const result = await db
      .collection("destinations")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedDestination })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Destination not found" }, { status: 404 })
    }

    const destination = await db.collection("destinations").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Destination updated successfully",
      destination: {
        ...destination,
        _id: destination._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating destination:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_destinations"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("destinations").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Destination deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting destination:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
