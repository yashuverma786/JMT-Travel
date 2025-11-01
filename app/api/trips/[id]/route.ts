import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    // Try to find by ObjectId first, then by slug
    let trip = null

    if (ObjectId.isValid(params.id)) {
      trip = await db.collection("trips").findOne({ _id: new ObjectId(params.id) })
    }

    if (!trip) {
      trip = await db.collection("trips").findOne({ slug: params.id })
    }

    if (!trip) {
      return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      trip: {
        _id: trip._id.toString(),
        title: trip.title || "Untitled Trip",
        destinationName: trip.destinationName || "Unknown Destination",
        destinationCountry: trip.destinationCountry || "",
        durationDays: trip.durationDays || 1,
        durationNights: trip.durationNights || 0,
        featuredImage: trip.featuredImage || trip.imageUrls?.[0] || trip.images?.[0] || null,
        imageUrls: trip.imageUrls || trip.images || [],
        galleryImages: trip.galleryImages || trip.images || [],
        adultPrice: trip.adultPrice || trip.normalPrice || 0,
        salePrice: trip.salePrice || 0,
        normalPrice: trip.normalPrice || trip.adultPrice || 0,
        displayPrice: trip.salePrice || trip.adultPrice || trip.normalPrice || 0,
        originalPrice: trip.adultPrice || trip.normalPrice || 0,
        hasDiscount: (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0),
        discountPercentage:
          (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0)
            ? Math.round(
                (((trip.adultPrice || trip.normalPrice || 0) - (trip.salePrice || 0)) /
                  (trip.adultPrice || trip.normalPrice || 1)) *
                  100,
              )
            : 0,
        rating: trip.rating || 4.5,
        reviewCount: trip.reviewCount || 0,
        category: trip.category || trip.tripType || "leisure",
        tripType: trip.tripType || "leisure",
        overview: trip.overview || trip.description || "",
        description: trip.description || trip.overview || "",
        status: trip.status || "active",
        isTrending: Boolean(trip.isTrending),
        isPopular: Boolean(trip.isPopular),
        slug: trip.slug || trip._id.toString(),
        highlights: trip.highlights || [],
        inclusions: trip.inclusions || [],
        exclusions: trip.exclusions || [],
        itinerary: trip.itinerary || [],
        maxGroupSize: trip.maxGroupSize || 15,
        minAge: trip.minAge || 0,
        difficulty: trip.difficulty || "easy",
        bestTimeToVisit: trip.bestTimeToVisit || "",
        departureCity: trip.departureCity || "",
        returnCity: trip.returnCity || "",
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json({ success: false, message: "Error fetching trip" }, { status: 500 })
  }
}
