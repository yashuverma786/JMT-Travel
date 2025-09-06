import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function checkPermissions(request: NextRequest, requiredPermissions: string[] = []) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { db } = await connectToDatabase()

    // Get user from database
    const user = await db.collection("admin_users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    // Check permissions
    if (requiredPermissions.length > 0) {
      const userPermissions = user.permissions || []
      const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission))

      if (!hasPermission) {
        return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
      }
    }
    // Add user to request for use in the handler
    ;(request as any).user = user

    return null // No error, proceed
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const { db } = await connectToDatabase()
    const user = await db.collection("admin_users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    return user
  } catch (error) {
    console.error("Get authenticated user error:", error)
    return null
  }
}
