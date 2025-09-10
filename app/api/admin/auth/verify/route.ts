import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-jmt-travel-2024"

export async function GET(request: NextRequest) {
  try {
    console.log("Verify API called")

    // Get token from Authorization header or cookies
    const authHeader = request.headers.get("authorization")
    let token = authHeader?.replace("Bearer ", "")

    if (!token) {
      token = request.cookies.get("admin-token")?.value
    }

    console.log("Token found:", token ? "Yes" : "No")

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    console.log("Token decoded:", decoded.userId)

    const { db } = await connectToDatabase()

    // Find admin user
    const admin = await db.collection("admin_users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    console.log("Admin found in verify:", admin ? "Yes" : "No")

    if (!admin) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 })
    }

    const userData = {
      _id: admin._id.toString(),
      email: admin.email,
      username: admin.username || admin.email,
      role: admin.role || "admin",
      permissions: admin.permissions || ["all"],
    }

    console.log("Verify successful")
    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
  }
}
