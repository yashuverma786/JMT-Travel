import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const reviews = await db.collection("reviews").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reviewData = await request.json()
    const { customerName, customerEmail, rating, comment, tripId, status } = reviewData

    if (!customerName || !rating || !comment) {
      return NextResponse.json({ message: "Missing required review fields" }, { status: 400 })
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

    return NextResponse.json(
      {
        message: "Review created successfully",
        review: { _id: result.insertedId, ...newReview },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
