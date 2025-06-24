import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Helper to get current user from session (adapt to your auth setup)
async function getCurrentUser(request: NextRequest) {
  // This is a placeholder. Replace with your actual session/token validation logic.
  // For example, if using JWT in headers:
  // const token = request.headers.get('Authorization')?.split(' ')[1];
  // if (!token) return null;
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   return decoded; // Should contain user id, role, permissions
  // } catch (err) {
  //   return null;
  // }

  // If using next-auth getSession, it's more complex in route handlers.
  // For simplicity, we'll assume user info might be passed or handled by middleware.
  // In a real app, secure this properly.
  // For now, let's assume a middleware adds `request.user`
  // return (request as any).user;
  return null // Placeholder
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")

    let query = {}
    if (ownerId && ObjectId.isValid(ownerId)) {
      query = { ownerId: new ObjectId(ownerId) }
    }
    // Non-hotel_listers see all, hotel_listers see only their own (if ownerId provided)

    const hotels = await db.collection("hotels").find(query).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ hotels })
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // const currentUser = await getCurrentUser(request); // Get current user
    // if (!currentUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const hotelData = await request.json()
    const { name, city, country } = hotelData // Basic validation

    if (!name || !city || !country) {
      return NextResponse.json({ message: "Name, city, and country are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    let status: "pending_approval" | "approved" = "approved" // Default for admin/super_admin
    const ownerIdToSet = hotelData.ownerId

    // If the request is from a hotel_lister (this logic needs to be based on authenticated user)
    // For now, we assume if ownerId is passed and status is not, it's a hotel_lister submission
    // This needs to be more robust based on actual user role from session/token
    if (hotelData.ownerId && !hotelData.status /* && currentUser.role === 'hotel_lister' */) {
      status = "pending_approval"
    } else if (hotelData.status) {
      status = hotelData.status // Allow admin to set status directly
    }

    const newHotel = {
      ...hotelData,
      ownerId: ownerIdToSet ? new ObjectId(ownerIdToSet) : null, // Store ownerId if provided
      status: status,
      images: hotelData.images || [],
      amenities: hotelData.amenities || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("hotels").insertOne(newHotel)
    return NextResponse.json(
      { message: "Hotel created successfully", hotel: { _id: result.insertedId, ...newHotel } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
