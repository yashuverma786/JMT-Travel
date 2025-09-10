import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_transfers"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const transfers = await db.collection("transfers").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      transfers: transfers.map((transfer) => ({
        ...transfer,
        _id: transfer._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching transfers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transfers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_transfers"])
  if (authCheck) return authCheck

  try {
    const transferData = await request.json()
    const { db } = await connectToDatabase()

    if (!transferData.name || !transferData.from || !transferData.to || !transferData.price) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const newTransfer = {
      name: transferData.name,
      from: transferData.from,
      to: transferData.to,
      description: transferData.description || "",
      price: Number(transferData.price),
      vehicleType: transferData.vehicleType || "car",
      capacity: Number(transferData.capacity) || 4,
      images: transferData.images || [],
      status: transferData.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("transfers").insertOne(newTransfer)
    const createdTransfer = await db.collection("transfers").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Transfer created successfully",
        transfer: {
          ...createdTransfer,
          _id: createdTransfer._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating transfer:", error)
    return NextResponse.json({ success: false, error: "Failed to create transfer" }, { status: 500 })
  }
}
