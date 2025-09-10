import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_reviews"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) })

    if (!review) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      review: {
        ...review,
        _id: review._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_reviews"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedReview = {
      customerName: updateData.customerName,
      customerEmail: updateData.customerEmail || "",
      rating: Number(updateData.rating),
      comment: updateData.comment,
      tripId: updateData.tripId || "general",
      status: updateData.status || "pending",
      updatedAt: new Date(),
    }

    const result = await db.collection("reviews").updateOne({ _id: new ObjectId(id) }, { $set: updatedReview })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 })
    }

    const review = await db.collection("reviews").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      review: {
        ...review,
        _id: review._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_reviews"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
