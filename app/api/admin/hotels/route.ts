import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_hotels"])
  if (permissionError) return permissionError

  try {
    const hotels = await prisma.hotel.findMany()
    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_hotels"])
  if (permissionError) return permissionError

  try {
    const json = await request.json()
    const hotel = await prisma.hotel.create({
      data: json,
    })
    return NextResponse.json(hotel)
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}
