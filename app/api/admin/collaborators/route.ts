import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all collaborators
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collaborators = await db.collection("collaborators").find({}).toArray()
    return NextResponse.json({ collaborators })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new collaborator
export async function POST(request: NextRequest) {
  try {
    const collaboratorData = await request.json()
    const { name, email, company, role, status } = collaboratorData

    if (!name || !email || !company) {
      return NextResponse.json({ message: "Missing required collaborator fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("collaborators").insertOne({
      name,
      email,
      company,
      role: role || "Partner",
      status: status || "active", // active, inactive, pending
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Collaborator created successfully",
        collaborator: { _id: result.insertedId, ...collaboratorData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating collaborator:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
