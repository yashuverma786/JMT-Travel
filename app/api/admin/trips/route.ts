import { NextResponse, type NextRequest } from "next/server"
import { checkPermissions } from "@/lib/auth-middleware"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const { db } = await connectToDatabase()
    const trips = await db.collection("trips").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(trips)
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const data = await request.json()
    const { db } = await connectToDatabase()
    const result = await db.collection("trips").insertOne({
      ...data,
      normalPrice: Number.parseFloat(data.normalPrice),
      salePrice: data.salePrice ? Number.parseFloat(data.salePrice) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ _id: result.insertedId, ...data }, { status: 201 })
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ message: "Error creating trip" }, { status: 500 })
  }
}
