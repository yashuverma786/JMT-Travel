import { ROLES_PERMISSIONS } from "@/lib/permissions"
import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection("admin_users").findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const updateData = await request.json()

    const updatePayload: any = { ...updateData, updatedAt: new Date() }

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 12)
      updatePayload.password = hashedPassword
    } else {
      delete updatePayload.password // Don't update password if not provided
    }

    if (updateData.role) {
      updatePayload.permissions = ROLES_PERMISSIONS[updateData.role] || []
    } else {
      // If role is not changing, don't change permissions unless explicitly sent
      // However, for simplicity and security, it's often better to re-derive permissions
      // if any user data is being changed, or disallow direct permission editing via this route.
      // For now, we only update permissions if role changes.
      // If you allow direct permission editing, ensure the editing user has rights to grant those permissions.
      delete updatePayload.permissions // Or handle explicit permission changes carefully
    }

    const db = await getDb()
    const result = await db.collection("admin_users").updateOne({ _id: new ObjectId(id) }, { $set: updatePayload })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("admin_users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
