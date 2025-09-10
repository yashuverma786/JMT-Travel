import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_reviews"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const reviews = await db.collection("reviews").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        ...review,
        _id: review._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_reviews"])
  if (authCheck) return authCheck

  try {
    const reviewData = await request.json()
    const { customerName, customerEmail, rating, comment, tripId, status } = reviewData

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ success: false, message: "Missing required review fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newReview = {
      tripId: tripId || "general",
      userId: "admin-created",
      customerName,
      customerEmail: customerEmail || "",
      rating: Number(rating),
      comment,
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("reviews").insertOne(newReview)
    const createdReview = await db.collection("reviews").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
        review: {
          ...createdReview,
          _id: createdReview._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
