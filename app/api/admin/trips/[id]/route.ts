import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const trip = await db.collection("trips").findOne({ _id: new ObjectId(params.id) })

    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      trip: {
        ...trip,
        _id: trip._id.toString(),
        imageUrl: trip.featuredImage || trip.imageUrls?.[0] || trip.images?.[0] || null,
        displayPrice: trip.salePrice || trip.adultPrice || trip.normalPrice || 0,
        originalPrice: trip.adultPrice || trip.normalPrice || 0,
        hasDiscount: (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0),
      },
    })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ success: false, message: "Error fetching trip" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const tripData = await request.json()
    const { db } = await connectToDatabase()

    // Get destination name if destinationId is provided
    let destinationName = tripData.destinationName
    let destinationCountry = tripData.destinationCountry || ""
    if (tripData.destinationId && ObjectId.isValid(tripData.destinationId)) {
      const destination = await db.collection("destinations").findOne({ _id: new ObjectId(tripData.destinationId) })
      destinationName = destination?.name || "Unknown"
      destinationCountry = destination?.country || ""
    }

    // Generate slug from title if title changed
    const slug = tripData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const updateData = {
      title: tripData.title,
      description: tripData.description || "",
      overview: tripData.overview || tripData.description || "",
      destinationId: tripData.destinationId,
      destinationName,
      destinationCountry,
      tripType: tripData.tripType || "leisure",
      category: tripData.tripType || "leisure",
      durationDays: Number(tripData.durationDays) || 1,
      durationNights: Number(tripData.durationNights) || 0,
      adultPrice: Number(tripData.adultPrice),
      normalPrice: Number(tripData.adultPrice),
      salePrice: Number(tripData.salePrice || 0),
      childPrice: Number(tripData.childPrice || 0),
      infantPrice: Number(tripData.infantPrice || 0),
      images: tripData.images || [],
      imageUrls: tripData.images || [],
      featuredImage: tripData.images?.[0] || null,
      galleryImages: tripData.images || [],
      inclusions: tripData.inclusions || [],
      exclusions: tripData.exclusions || [],
      highlights: tripData.highlights || [],
      itinerary: tripData.itinerary || [],
      status: tripData.status || "active",
      isTrending: Boolean(tripData.isTrending),
      isPopular: Boolean(tripData.isPopular),
      rating: Number(tripData.rating || 4.5),
      reviewCount: Number(tripData.reviewCount || 0),
      maxGroupSize: Number(tripData.maxGroupSize || 15),
      minAge: Number(tripData.minAge || 0),
      difficulty: tripData.difficulty || "easy",
      bestTimeToVisit: tripData.bestTimeToVisit || "",
      departureCity: tripData.departureCity || "",
      returnCity: tripData.returnCity || "",
      slug: slug,
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 })
    }

    const updatedTrip = await db.collection("trips").findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json({
      success: true,
      message: "Trip updated successfully",
      trip: {
        ...updatedTrip,
        _id: updatedTrip._id.toString(),
        imageUrl: updatedTrip.featuredImage || updatedTrip.imageUrls?.[0] || updatedTrip.images?.[0] || null,
        displayPrice: updatedTrip.salePrice || updatedTrip.adultPrice || updatedTrip.normalPrice || 0,
        originalPrice: updatedTrip.adultPrice || updatedTrip.normalPrice || 0,
        hasDiscount:
          (updatedTrip.salePrice || 0) > 0 &&
          (updatedTrip.salePrice || 0) < (updatedTrip.adultPrice || updatedTrip.normalPrice || 0),
      },
    })
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json({ success: false, message: "Error updating trip" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("trips").deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Trip deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json({ success: false, message: "Error deleting trip" }, { status: 500 })
  }
}
