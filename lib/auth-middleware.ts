import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-jmt-travel-2024"

export interface AuthenticatedUser {
  _id: string
  email: string
  username: string
  role: string
  permissions: string[]
}

export async function checkPermissions(request: NextRequest, requiredPermissions: string[] = []) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    if (!token) {
      token = request.cookies.get("admin-token")?.value
    }

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
      const userPermissions = user.permissions || ["all"]
      const hasPermission =
        userPermissions.includes("all") ||
        requiredPermissions.some((permission) => userPermissions.includes(permission))

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

export async function authenticateAdmin(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    if (!token) {
      token = request.cookies.get("admin-token")?.value
    }

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { db } = await connectToDatabase()

    // Find admin user
    const admin = await db.collection("admin_users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!admin) {
      return null
    }

    return {
      _id: admin._id.toString(),
      email: admin.email,
      username: admin.username || admin.email,
      role: admin.role || "admin",
      permissions: admin.permissions || ["all"],
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    if (!token) {
      token = request.cookies.get("admin-token")?.value
    }

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

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateAdmin(request)

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(request, user)
  }
}
