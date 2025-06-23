import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all leads
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const leads = await db.collection("leads").find({}).toArray()
    return NextResponse.json({ leads })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new lead (e.g., from custom tour request form)
export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    const {
      name,
      email,
      phone,
      preferredDestination,
      tripType,
      travelDates,
      groupSize,
      budget,
      activities,
      specialRequests,
    } = leadData

    if (!name || !email || !phone) {
      return NextResponse.json({ message: "Missing required lead fields (name, email, phone)" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("leads").insertOne({
      name,
      email,
      phone,
      preferredDestination: preferredDestination || null,
      tripType: tripType || null,
      travelDates: travelDates || null,
      groupSize: groupSize || null,
      budget: budget || null,
      activities: activities || [],
      specialRequests: specialRequests || "",
      status: "new", // new, contacted, converted, rejected
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Lead created successfully",
        lead: { _id: result.insertedId, ...leadData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
