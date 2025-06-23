import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET all reviews
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const reviews = await db.collection("reviews").find({}).toArray()
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new review
export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()
    const { tripId, userId, rating, comment, status } = reviewData

    if (!tripId || !userId || !rating || !comment) {
      return NextResponse.json({ message: "Missing required review fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("reviews").insertOne({
      tripId: new ObjectId(tripId), // Assuming tripId is an ObjectId
      userId: new ObjectId(userId), // Assuming userId is an ObjectId
      rating: Number(rating),
      comment,
      status: status || "pending", // pending, approved, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Review created successfully",
        review: { _id: result.insertedId, ...reviewData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
