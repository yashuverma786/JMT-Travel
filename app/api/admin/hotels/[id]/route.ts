import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_hotels"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) })

    if (!hotel) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      hotel: {
        ...hotel,
        _id: hotel._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_hotels"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedHotel = {
      name: updateData.name,
      location: updateData.location,
      description: updateData.description || "",
      pricePerNight: Number(updateData.pricePerNight),
      images: updateData.images || [],
      amenities: updateData.amenities || [],
      rating: Number(updateData.rating) || 0,
      status: updateData.status || "pending",
      updatedAt: new Date(),
    }

    const result = await db.collection("hotels").updateOne({ _id: new ObjectId(id) }, { $set: updatedHotel })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })

    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({
      success: true,
      message: "Hotel updated successfully",
      hotel: {
        ...hotel,
        _id: hotel._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_hotels"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const result = await db.collection("hotels").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) return NextResponse.json({ message: "Hotel not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      message: "Hotel deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
