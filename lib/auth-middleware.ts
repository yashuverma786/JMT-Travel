import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function checkPermissions(request: NextRequest, requiredPermissions: string[] = []) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get("authorization")
    const bearerToken = authHeader?.replace("Bearer ", "")
    const cookieToken = request.cookies.get("admin-token")?.value

    const token = bearerToken || cookieToken

    if (!token) {
      console.log("No token found in request")
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    } catch (jwtError) {
      console.log("JWT verification failed:", jwtError)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      console.log("User not found for token")
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    // Super admin has all permissions
    if (user.role === "super_admin") {
      return null
    }

    // Check specific permissions for regular admin
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
    const bearerToken = authHeader?.replace("Bearer ", "")
    const cookieToken = request.cookies.get("admin-token")?.value

    const token = bearerToken || cookieToken

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
