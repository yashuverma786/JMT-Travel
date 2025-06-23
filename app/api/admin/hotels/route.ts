import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const hotels = await db.collection("hotels").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const hotelData = await request.json()
    const { name, city, country, status } = hotelData // Add other fields as needed

    if (!name || !city || !country) {
      return NextResponse.json({ message: "Name, city, and country are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newHotel = {
      ...hotelData,
      images: hotelData.images || [],
      amenities: hotelData.amenities || [],
      status: status || "pending", // Default to pending if submitted by owner, or published if by admin
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await db.collection("hotels").insertOne(newHotel)

    return NextResponse.json(
      { message: "Hotel created successfully", hotel: { _id: result.insertedId, ...newHotel } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
