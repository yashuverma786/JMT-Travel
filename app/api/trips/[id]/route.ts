import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid trip ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const trip = await db
      .collection("trips")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "destinations",
            let: { destId: { $toObjectId: "$destinationId" } },
            pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$destId"] } } }],
            as: "destination",
          },
        },
        {
          $addFields: {
            destinationName: {
              $ifNull: ["$destinationName", { $arrayElemAt: ["$destination.name", 0] }],
            },
            destinationCountry: { $arrayElemAt: ["$destination.country", 0] },
          },
        },
        {
          $project: {
            destination: 0,
          },
        },
      ])
      .toArray()

    if (!trip || trip.length === 0) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({ trip: trip[0] })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ message: "Error fetching trip" }, { status: 500 })
  }
}
