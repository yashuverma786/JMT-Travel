import { ROLES_PERMISSIONS } from "@/lib/permissions"
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_users"])
  if (authCheck) return authCheck

  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("admin_users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_users"])
  if (authCheck) return authCheck

  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatePayload: any = {
      username: updateData.username,
      email: updateData.email,
      role: updateData.role,
      status: updateData.status,
      updatedAt: new Date(),
    }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 12)
      updatePayload.password = hashedPassword
    }

    if (updateData.role) {
      updatePayload.permissions = ROLES_PERMISSIONS[updateData.role] || []
    }

    const result = await db.collection("admin_users").updateOne({ _id: new ObjectId(id) }, { $set: updatePayload })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const updatedUser = await db
      .collection("admin_users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        ...updatedUser,
        _id: updatedUser._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_users"])
  if (authCheck) return authCheck

  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("admin_users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
