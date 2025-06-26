import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const trips = await prisma.trip.findMany()
    return NextResponse.json(trips)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error fetching trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const permissionError = await checkPermissions(request, ["manage_trips"])
  if (permissionError) return permissionError

  try {
    const data = await request.json()
    const trip = await prisma.trip.create({
      data: {
        name: data.name,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: Number.parseFloat(data.price),
        description: data.description,
        imageUrl: data.imageUrl,
        userId: data.userId,
      },
    })
    return NextResponse.json(trip)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error creating trip" }, { status: 500 })
  }
}
