import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { authenticateAdmin } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const destination = await db.collection("destinations").findOne({
      _id: new ObjectId(params.id),
    })

    if (!destination) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json(destination)
  } catch (error) {
    console.error("Get destination error:", error)
    return NextResponse.json({ message: "Failed to fetch destination" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { db } = await connectToDatabase()

    const updateData = {
      ...data,
      updatedAt: new Date(),
      updatedBy: user._id,
    }

    const result = await db.collection("destinations").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Destination updated successfully",
    })
  } catch (error) {
    console.error("Update destination error:", error)
    return NextResponse.json({ message: "Failed to update destination" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("destinations").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Destination not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Destination deleted successfully",
    })
  } catch (error) {
    console.error("Delete destination error:", error)
    return NextResponse.json({ message: "Failed to delete destination" }, { status: 500 })
  }
}
