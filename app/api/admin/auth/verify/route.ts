import { NextResponse, type NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const bearerToken = authHeader?.replace("Bearer ", "")
    const cookieToken = request.cookies.get("admin-token")?.value

    const token = bearerToken || cookieToken

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
    const { db } = await connectToDatabase()

    // Look in admin_users collection, not users
    const user = await db.collection("admin_users").findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        permissions: user.permissions || [],
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
