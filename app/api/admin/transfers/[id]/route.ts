import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_transfers"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const transfer = await db.collection("transfers").findOne({ _id: new ObjectId(id) })

    if (!transfer) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      transfer: {
        ...transfer,
        _id: transfer._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching transfer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_transfers"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedTransfer = {
      name: updateData.name,
      from: updateData.from,
      to: updateData.to,
      description: updateData.description || "",
      price: Number(updateData.price),
      vehicleType: updateData.vehicleType || "car",
      capacity: Number(updateData.capacity) || 4,
      images: updateData.images || [],
      status: updateData.status || "pending",
      updatedAt: new Date(),
    }

    const result = await db.collection("transfers").updateOne({ _id: new ObjectId(id) }, { $set: updatedTransfer })

    if (result.matchedCount === 0) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })

    const transfer = await db.collection("transfers").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({
      success: true,
      message: "Transfer updated successfully",
      transfer: {
        ...transfer,
        _id: transfer._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating transfer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_transfers"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 })

    const { db } = await connectToDatabase()
    const result = await db.collection("transfers").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) return NextResponse.json({ message: "Transfer not found" }, { status: 404 })

    return NextResponse.json({
      success: true,
      message: "Transfer deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting transfer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
