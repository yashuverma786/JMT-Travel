import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const destination = searchParams.get("destination")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    const { db } = await connectToDatabase()

    // Build query for holiday packages
    const query: any = {
      status: { $ne: "inactive" },
      $or: [
        { tripType: { $in: ["leisure", "honeymoon", "family", "luxury"] } },
        { category: { $in: ["leisure", "honeymoon", "family", "luxury"] } },
        { isPopular: true },
        { isTrending: true },
      ],
    }

    if (category && category !== "all") {
      query.tripType = { $regex: category, $options: "i" }
    }
    if (destination) {
      query.$or = [
        { destinationName: { $regex: destination, $options: "i" } },
        { title: { $regex: destination, $options: "i" } },
      ]
    }
    if (minPrice) {
      const priceQuery = { $gte: Number(minPrice) }
      query.$or = [{ salePrice: priceQuery }, { adultPrice: priceQuery }, { normalPrice: priceQuery }]
    }
    if (maxPrice) {
      const priceQuery = { $lte: Number(maxPrice) }
      query.$or = [{ salePrice: priceQuery }, { adultPrice: priceQuery }, { normalPrice: priceQuery }]
    }

    const skip = (page - 1) * limit

    const [trips, totalCount] = await Promise.all([
      db
        .collection("trips")
        .find(query)
        .sort({ isPopular: -1, isTrending: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("trips").countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      holidays: trips.map((trip) => ({
        _id: trip._id.toString(),
        id: trip._id.toString(),
        title: trip.title || "Untitled Holiday",
        destination: trip.destinationName || "Unknown Destination",
        destinationName: trip.destinationName || "Unknown Destination",
        destinationCountry: trip.destinationCountry || "",
        image: trip.featuredImage || trip.imageUrls?.[0] || trip.images?.[0] || "/placeholder.svg?height=400&width=600",
        imageUrl:
          trip.featuredImage || trip.imageUrls?.[0] || trip.images?.[0] || "/placeholder.svg?height=400&width=600",
        imageUrls: trip.imageUrls || trip.images || [],
        duration: `${trip.durationDays || 1} Days / ${trip.durationNights || 0} Nights`,
        durationDays: trip.durationDays || 1,
        durationNights: trip.durationNights || 0,
        price: trip.salePrice || trip.adultPrice || trip.normalPrice || 0,
        displayPrice: trip.salePrice || trip.adultPrice || trip.normalPrice || 0,
        originalPrice: trip.adultPrice || trip.normalPrice || 0,
        adultPrice: trip.adultPrice || trip.normalPrice || 0,
        salePrice: trip.salePrice || 0,
        normalPrice: trip.normalPrice || trip.adultPrice || 0,
        hasDiscount: (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0),
        discount:
          (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0)
            ? Math.round(
                (((trip.adultPrice || trip.normalPrice || 0) - (trip.salePrice || 0)) /
                  (trip.adultPrice || trip.normalPrice || 1)) *
                  100,
              )
            : 0,
        discountPercentage:
          (trip.salePrice || 0) > 0 && (trip.salePrice || 0) < (trip.adultPrice || trip.normalPrice || 0)
            ? Math.round(
                (((trip.adultPrice || trip.normalPrice || 0) - (trip.salePrice || 0)) /
                  (trip.adultPrice || trip.normalPrice || 1)) *
                  100,
              )
            : 0,
        rating: trip.rating || 4.5,
        reviews: trip.reviewCount || 0,
        reviewCount: trip.reviewCount || 0,
        category: trip.category || trip.tripType || "Holiday",
        tripType: trip.tripType || "leisure",
        overview: trip.overview || trip.description || "",
        description: trip.description || trip.overview || "",
        isTrending: Boolean(trip.isTrending),
        isPopular: Boolean(trip.isPopular),
        slug: trip.slug || trip._id.toString(),
        highlights: trip.highlights || [],
        inclusions: trip.inclusions || [],
        exclusions: trip.exclusions || [],
        itinerary: trip.itinerary || [],
        gallery: trip.galleryImages || trip.imageUrls || trip.images || [],
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching holidays:", error)
    return NextResponse.json(
      {
        success: false,
        holidays: [],
        pagination: { page: 1, limit: 12, total: 0, pages: 0, hasNext: false, hasPrev: false },
        error: "Failed to fetch holidays",
      },
      { status: 500 },
    )
  }
}
