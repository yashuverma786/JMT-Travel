import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function checkPermissions(request: NextRequest, requiredPermissions: string[]) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const { db } = await connectToDatabase()

    const user = await db.collection("admin_users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Super admin has all permissions
    if (user.role === "super_admin") {
      return null // Allow access
    }

    // Check if user has required permissions
    const hasPermission = requiredPermissions.some((permission) => user.permissions?.includes(permission))

    if (!hasPermission) {
      return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
    }

    return null // Allow access
  } catch (error) {
    console.error("Permission check failed:", error)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }
}
