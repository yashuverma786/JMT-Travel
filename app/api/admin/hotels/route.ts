import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_hotels"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const hotels = await db.collection("hotels").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      hotels: hotels.map((hotel) => ({
        ...hotel,
        _id: hotel._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch hotels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_hotels"])
  if (authCheck) return authCheck

  try {
    const hotelData = await request.json()
    const { db } = await connectToDatabase()

    if (!hotelData.name || !hotelData.location || !hotelData.pricePerNight) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const newHotel = {
      name: hotelData.name,
      location: hotelData.location,
      description: hotelData.description || "",
      pricePerNight: Number(hotelData.pricePerNight),
      images: hotelData.images || [],
      amenities: hotelData.amenities || [],
      rating: Number(hotelData.rating) || 0,
      status: hotelData.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("hotels").insertOne(newHotel)
    const createdHotel = await db.collection("hotels").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Hotel created successfully",
        hotel: {
          ...createdHotel,
          _id: createdHotel._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ success: false, error: "Failed to create hotel" }, { status: 500 })
  }
}
