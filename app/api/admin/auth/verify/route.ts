import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    console.log("Token verification request received")

    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set")
      return NextResponse.json(
        {
          message: "Server configuration error - JWT_SECRET missing",
          error: "MISSING_JWT_SECRET",
        },
        { status: 500 },
      )
    }

    const authHeader = request.headers.get("authorization")
    console.log("Auth header present:", !!authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid authorization header")
      return NextResponse.json(
        {
          message: "No token provided",
          error: "NO_TOKEN",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7)
    console.log("Token extracted, length:", token.length)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token verified successfully for user:", decoded.username)

      return NextResponse.json({
        valid: true,
        user: decoded,
        timestamp: new Date().toISOString(),
      })
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message)
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          error: "INVALID_TOKEN",
          details: jwtError.message,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json(
      {
        message: "Internal server error during token verification",
        error: "INTERNAL_ERROR",
      },
      { status: 500 },
    )
  }
}
