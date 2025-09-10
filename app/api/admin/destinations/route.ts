import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const destinations = await db.collection("destinations").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      destinations: destinations.map((dest) => ({
        ...dest,
        _id: dest._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching destinations",
        destinations: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_destinations"])
  if (authCheck) return authCheck

  try {
    const destinationData = await request.json()
    const { db } = await connectToDatabase()

    if (!destinationData.name || !destinationData.country) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and country are required",
        },
        { status: 400 },
      )
    }

    const newDestination = {
      name: destinationData.name,
      country: destinationData.country,
      description: destinationData.description || "",
      imageUrl: destinationData.imageUrl || "/placeholder.svg",
      type: destinationData.type || "city",
      popular: Boolean(destinationData.popular),
      trending: Boolean(destinationData.trending),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("destinations").insertOne(newDestination)
    const createdDestination = await db.collection("destinations").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Destination created successfully",
        destination: {
          ...createdDestination,
          _id: createdDestination._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating destination:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error creating destination",
      },
      { status: 500 },
    )
  }
}
