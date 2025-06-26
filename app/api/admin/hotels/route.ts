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
    const { name, location, pricePerNight, description } = hotelData

    if (!name || !location || !pricePerNight || !description) {
      return NextResponse.json(
        { message: "Name, location, price per night, and description are required" },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const newHotel = {
      ...hotelData,
      pricePerNight: Number.parseFloat(pricePerNight),
      images: hotelData.images || [],
      amenities: hotelData.amenities || [],
      status: "pending", // Default status for new hotels
      createdBy: "admin", // TODO: Get from authenticated user
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
