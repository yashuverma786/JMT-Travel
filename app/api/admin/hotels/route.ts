import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_hotels"])
  if (permissionError) return permissionError

  try {
    const { db } = await connectToDatabase()
    const hotels = await db.collection("hotels").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_hotels"])
  if (permissionError) return permissionError

  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    const result = await db.collection("hotels").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ _id: result.insertedId, ...body }, { status: 201 })
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}
