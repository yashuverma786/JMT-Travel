import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const trips = await db.collection("trips").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      trips: trips.map((trip) => ({
        ...trip,
        _id: trip._id.toString(),
        imageUrl: trip.featuredImage || trip.imageUrls?.[0] || trip.images?.[0] || null,
        displayPrice: trip.salePrice || trip.adultPrice || trip.normalPrice || 0,
        originalPrice: trip.adultPrice || trip.normalPrice || 0,
        hasDiscount: (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0),
        slug: trip.slug || trip._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ success: false, message: "Error fetching trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_trips"])
  if (authCheck) return authCheck

  try {
    const tripData = await request.json()
    const { db } = await connectToDatabase()

    if (!tripData.title || !tripData.destinationId || !tripData.adultPrice) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Get destination name
    let destinationName = "Unknown"
    let destinationCountry = ""
    if (ObjectId.isValid(tripData.destinationId)) {
      const destination = await db.collection("destinations").findOne({ _id: new ObjectId(tripData.destinationId) })
      destinationName = destination?.name || "Unknown"
      destinationCountry = destination?.country || ""
    }

    // Generate slug from title
    const slug = tripData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const newTrip = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("trips").insertOne(newTrip)
    const createdTrip = await db.collection("trips").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Trip created successfully",
        trip: {
          ...createdTrip,
          _id: createdTrip._id.toString(),
          imageUrl: createdTrip.featuredImage || createdTrip.imageUrls?.[0] || createdTrip.images?.[0] || null,
          displayPrice: createdTrip.salePrice || createdTrip.adultPrice || createdTrip.normalPrice || 0,
          originalPrice: createdTrip.adultPrice || createdTrip.normalPrice || 0,
          hasDiscount:
            (createdTrip.salePrice || 0) > 0 &&
            (createdTrip.salePrice || 0) < (createdTrip.adultPrice || createdTrip.normalPrice || 0),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating trip:", error)
    return NextResponse.json({ success: false, message: "Error creating trip" }, { status: 500 })
  }
}
