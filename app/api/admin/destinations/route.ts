import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_destinations"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()

    const destinations = await db.collection("destinations").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(destinations)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ message: "Error fetching destinations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_destinations"])
  if (authCheck) return authCheck

  try {
    const destinationData = await request.json()
    const { db } = await connectToDatabase()

    const newDestination = {
      ...destinationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("destinations").insertOne(newDestination)
    const createdDestination = await db.collection("destinations").findOne({ _id: result.insertedId })

    return NextResponse.json(createdDestination, { status: 201 })
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json({ message: "Error creating destination" }, { status: 500 })
  }
}
