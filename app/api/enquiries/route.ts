import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const enquiryData = await request.json()
    const {
      name,
      email,
      phone,
      packageName,
      adults,
      children,
      infants,
      preferredDestination,
      tripId,
      groupSize,
      specialRequests,
    } = enquiryData

    if (!name || !email || !phone) {
      return NextResponse.json({ message: "Missing required fields (name, email, phone)" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Insert into leads collection
    const result = await db.collection("leads").insertOne({
      name,
      email,
      phone,
      packageName: packageName || preferredDestination,
      tripId: tripId || null,
      adults: adults || 1,
      children: children || 0,
      infants: infants || 0,
      groupSize: groupSize || (adults || 1) + (children || 0) + (infants || 0),
      specialRequests: specialRequests || "",
      status: "new",
      source: "enquiry_form",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("[v0] New enquiry created:", {
      id: result.insertedId,
      name,
      email,
      phone,
      package: packageName || preferredDestination,
    })

    return NextResponse.json(
      {
        message: "Enquiry submitted successfully",
        enquiryId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating enquiry:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const enquiries = await db.collection("leads").find({ source: "enquiry_form" }).toArray()

    return NextResponse.json({
      success: true,
      enquiries: enquiries.map((e) => ({
        ...e,
        _id: e._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
