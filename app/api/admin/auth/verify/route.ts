import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    const { db } = await connectToDatabase()

    // Find admin user
    const admin = await db.collection("admin_users").findOne({
      _id: new ObjectId(decoded.userId),
    })

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role || "admin",
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }
}
