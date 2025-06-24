import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
// import { getCurrentUserAndPermissions } from "@/lib/auth-utils"; // You'd need a utility for this
// import { PERMISSIONS } from "@/lib/permissions";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // const { user, error: authError } = await getCurrentUserAndPermissions(request);
    // if (authError || !user || !user.permissions.includes(PERMISSIONS.APPROVE_LISTINGS)) {
    //   return NextResponse.json({ message: authError || "Unauthorized" }, { status: 403 });
    // }

    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid hotel ID format" }, { status: 400 })
    }

    const { status } = await request.json()
    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status provided. Must be 'approved' or 'rejected'." },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const result = await db
      .collection("hotels")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: status, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 })
    }
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      return NextResponse.json({ message: `Hotel status is already ${status}` })
    }

    return NextResponse.json({ message: `Hotel status updated to ${status}` })
  } catch (error) {
    console.error("Error updating hotel status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
