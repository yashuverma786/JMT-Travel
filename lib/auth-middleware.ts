import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function checkPermissions(request: NextRequest, requiredPermissions: string[] = []) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    // Super admin has all permissions
    if (user.role === "super_admin") {
      return null
    }

    // Check specific permissions
    if (requiredPermissions.length > 0) {
      const userPermissions = user.permissions || []
      const hasPermission = requiredPermissions.some((permission) => userPermissions.includes(permission))

      if (!hasPermission) {
        return NextResponse.json({ message: "Insufficient permissions" }, { status: 403 })
      }
    }

    return null
  } catch (error) {
    console.error("Auth middleware error:", error)
    return NextResponse.json({ message: "Authentication error" }, { status: 500 })
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "") || request.cookies.get("admin-token")?.value

    if (!token) {
      return null
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

    return user
  } catch (error) {
    console.error("Get authenticated user error:", error)
    return null
  }
}
