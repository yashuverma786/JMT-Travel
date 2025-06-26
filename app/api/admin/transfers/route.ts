import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const transfers = await db.collection("transfers").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ transfers })
  } catch (error) {
    console.error("Error fetching transfers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transferData = await request.json()
    const { type, price, description } = transferData

    if (!type || !price || !description) {
      return NextResponse.json({ message: "Type, price, and description are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newTransfer = {
      ...transferData,
      price: Number.parseFloat(price),
      images: transferData.images || [],
      status: "pending", // Default status for new transfers
      createdBy: "admin", // TODO: Get from authenticated user
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("transfers").insertOne(newTransfer)
    return NextResponse.json(
      { message: "Transfer created successfully", transfer: { _id: result.insertedId, ...newTransfer } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating transfer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
