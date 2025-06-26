import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    // For now, return empty array to prevent errors
    // This will be populated when MongoDB is properly connected
    return NextResponse.json({
      collaborators: [],
      message: "No collaborators found",
    })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json(
      {
        collaborators: [],
        message: "Error fetching collaborators",
      },
      { status: 500 },
    )
  }
}
