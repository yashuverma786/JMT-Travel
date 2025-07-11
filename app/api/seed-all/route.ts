import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing data
    await db.collection("users").deleteMany({})
    await db.collection("destinations").deleteMany({})
    await db.collection("trips").deleteMany({})

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12)
    const adminUser = {
      email: "admin@jmttravel.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: [
        "manage_trips",
        "manage_destinations",
        "manage_hotels",
        "manage_transfers",
        "manage_users",
        "manage_reviews",
        "manage_blogs",
        "manage_activities",
        "view_analytics",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const adminResult = await db.collection("users").insertOne(adminUser)

    // Create destinations
    const destinations = [
      {
        name: "Goa",
        country: "India",
        state: "Goa",
        description: "Beautiful beaches, vibrant nightlife, and Portuguese heritage",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Beach",
        highlights: ["Beaches", "Nightlife", "Water Sports", "Heritage"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kerala",
        country: "India",
        state: "Kerala",
        description: "God's Own Country with backwaters, hill stations, and spice plantations",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Nature",
        highlights: ["Backwaters", "Hill Stations", "Ayurveda", "Wildlife"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rajasthan",
        country: "India",
        state: "Rajasthan",
        description: "Land of Kings with majestic palaces, forts, and desert landscapes",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Cultural",
        highlights: ["Palaces", "Forts", "Desert Safari", "Culture"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Himachal Pradesh",
        country: "India",
        state: "Himachal Pradesh",
        description: "Mountain paradise with snow-capped peaks and adventure activities",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Adventure",
        highlights: ["Mountains", "Trekking", "Adventure Sports", "Scenic Beauty"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Uttarakhand",
        country: "India",
        state: "Uttarakhand",
        description: "Spiritual destination with holy temples and pristine nature",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Spiritual",
        highlights: ["Temples", "Yoga", "Meditation", "Pilgrimage"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jim Corbett",
        country: "India",
        state: "Uttarakhand",
        description: "Famous national park known for tigers and wildlife safari",
        image: "/placeholder.svg?height=300&width=400",
        status: "active",
        type: "Wildlife",
        highlights: ["Tiger Safari", "Wildlife", "Nature", "Photography"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const destinationResults = await db.collection("destinations").insertMany(destinations)
    const destinationIds = Object.values(destinationResults.insertedIds)

    // Create trips
    const trips = [
      // Beach trips
      {
        title: "Goa Beach Paradise - 4 Days",
        destinationId: destinationIds[0],
        destinationName: "Goa",
        tripType: "Beach",
        description: "Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife",
        highlights: ["Beach Activities", "Water Sports", "Nightlife", "Seafood"],
        inclusions: ["Accommodation", "Breakfast", "Airport Transfer", "Sightseeing"],
        exclusions: ["Lunch & Dinner", "Personal Expenses", "Travel Insurance"],
        itinerary: [
          { day: 1, title: "Arrival & Beach Time", activities: ["Airport pickup", "Check-in", "Calangute Beach"] },
          { day: 2, title: "North Goa Sightseeing", activities: ["Fort Aguada", "Anjuna Beach", "Flea Market"] },
          { day: 3, title: "South Goa Tour", activities: ["Colva Beach", "Basilica of Bom Jesus", "Spice Plantation"] },
          { day: 4, title: "Departure", activities: ["Check-out", "Airport drop"] },
        ],
        durationDays: 4,
        durationNights: 3,
        adultPrice: 18999,
        salePrice: 15999,
        childPrice: 12999,
        infantPrice: 0,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: true,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 245,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Adventure trips
      {
        title: "Himachal Adventure Trek - 6 Days",
        destinationId: destinationIds[3],
        destinationName: "Himachal Pradesh",
        tripType: "Adventure",
        description: "Thrilling trekking experience in the Himalayas with breathtaking views",
        highlights: ["Mountain Trekking", "Scenic Views", "Adventure Activities", "Local Culture"],
        inclusions: ["Accommodation", "All Meals", "Trekking Guide", "Equipment"],
        exclusions: ["Personal Expenses", "Travel Insurance", "Medical Kit"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Manali",
            activities: ["Airport pickup", "Acclimatization", "Local sightseeing"],
          },
          { day: 2, title: "Trek to Base Camp", activities: ["Morning trek", "Set up camp", "Evening activities"] },
          { day: 3, title: "Summit Day", activities: ["Early morning trek", "Reach summit", "Return to base"] },
          {
            day: 4,
            title: "Explore Local Villages",
            activities: ["Village tour", "Cultural interaction", "Local cuisine"],
          },
          { day: 5, title: "Adventure Activities", activities: ["River rafting", "Paragliding", "Rock climbing"] },
          { day: 6, title: "Departure", activities: ["Check-out", "Airport transfer"] },
        ],
        durationDays: 6,
        durationNights: 5,
        adultPrice: 28999,
        salePrice: 24999,
        childPrice: 19999,
        infantPrice: 0,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: true,
        isFeatured: false,
        rating: 4.7,
        reviewCount: 189,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Cultural trips
      {
        title: "Rajasthan Royal Heritage - 8 Days",
        destinationId: destinationIds[2],
        destinationName: "Rajasthan",
        tripType: "Cultural",
        description: "Explore the royal heritage of Rajasthan with magnificent palaces and forts",
        highlights: ["Royal Palaces", "Historic Forts", "Desert Safari", "Cultural Shows"],
        inclusions: ["Luxury Accommodation", "All Meals", "Private Guide", "Cultural Shows"],
        exclusions: ["Personal Expenses", "Shopping", "Tips"],
        itinerary: [
          { day: 1, title: "Arrival in Jaipur", activities: ["Airport pickup", "City Palace", "Hawa Mahal"] },
          { day: 2, title: "Jaipur Sightseeing", activities: ["Amber Fort", "Jantar Mantar", "Local markets"] },
          {
            day: 3,
            title: "Jaipur to Jodhpur",
            activities: ["Travel to Jodhpur", "Mehrangarh Fort", "Blue City tour"],
          },
          { day: 4, title: "Jodhpur to Jaisalmer", activities: ["Travel to Jaisalmer", "Golden Fort", "Sunset point"] },
          { day: 5, title: "Desert Safari", activities: ["Camel safari", "Desert camp", "Cultural evening"] },
          { day: 6, title: "Jaisalmer to Udaipur", activities: ["Travel to Udaipur", "City Palace", "Lake Pichola"] },
          { day: 7, title: "Udaipur Sightseeing", activities: ["Jagdish Temple", "Saheliyon ki Bari", "Boat ride"] },
          { day: 8, title: "Departure", activities: ["Check-out", "Airport transfer"] },
        ],
        durationDays: 8,
        durationNights: 7,
        adultPrice: 45999,
        salePrice: 39999,
        childPrice: 29999,
        infantPrice: 0,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: false,
        isFeatured: true,
        rating: 4.6,
        reviewCount: 312,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Spiritual trips
      {
        title: "Char Dham Yatra - 10 Days",
        destinationId: destinationIds[4],
        destinationName: "Uttarakhand",
        tripType: "Spiritual",
        description: "Sacred pilgrimage to the four holy shrines in the Himalayas",
        highlights: ["Holy Temples", "Spiritual Journey", "Mountain Views", "Sacred Rituals"],
        inclusions: ["Accommodation", "All Meals", "Temple Visits", "Spiritual Guide"],
        exclusions: ["Personal Expenses", "Donations", "Medical Kit"],
        itinerary: [
          { day: 1, title: "Arrival in Haridwar", activities: ["Airport pickup", "Ganga Aarti", "Temple visit"] },
          {
            day: 2,
            title: "Haridwar to Yamunotri",
            activities: ["Travel to Yamunotri", "Temple darshan", "Hot springs"],
          },
          { day: 3, title: "Yamunotri to Gangotri", activities: ["Travel to Gangotri", "Temple visit", "River Ganga"] },
          {
            day: 4,
            title: "Gangotri to Kedarnath",
            activities: ["Travel to Kedarnath", "Temple darshan", "Meditation"],
          },
          {
            day: 5,
            title: "Kedarnath Exploration",
            activities: ["Morning prayers", "Temple rituals", "Spiritual discourse"],
          },
          { day: 6, title: "Kedarnath to Badrinath", activities: ["Travel to Badrinath", "Temple visit", "Holy bath"] },
          {
            day: 7,
            title: "Badrinath Darshan",
            activities: ["Morning aarti", "Temple prayers", "Spiritual activities"],
          },
          {
            day: 8,
            title: "Badrinath to Rishikesh",
            activities: ["Travel to Rishikesh", "Yoga session", "Meditation"],
          },
          { day: 9, title: "Rishikesh Spiritual Tour", activities: ["Ashram visit", "Ganga aarti", "Yoga classes"] },
          { day: 10, title: "Departure", activities: ["Check-out", "Airport transfer"] },
        ],
        durationDays: 10,
        durationNights: 9,
        adultPrice: 35999,
        salePrice: 29999,
        childPrice: 24999,
        infantPrice: 0,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: false,
        isFeatured: false,
        rating: 4.8,
        reviewCount: 156,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Wildlife trips
      {
        title: "Jim Corbett Wildlife Safari - 3 Days",
        destinationId: destinationIds[5],
        destinationName: "Jim Corbett",
        tripType: "Wildlife",
        description: "Exciting wildlife safari in India's oldest national park",
        highlights: ["Tiger Safari", "Wildlife Photography", "Nature Walks", "Bird Watching"],
        inclusions: ["Resort Stay", "All Meals", "Safari Rides", "Nature Guide"],
        exclusions: ["Personal Expenses", "Camera Fees", "Tips"],
        itinerary: [
          {
            day: 1,
            title: "Arrival & Evening Safari",
            activities: ["Resort check-in", "Evening safari", "Wildlife briefing"],
          },
          { day: 2, title: "Full Day Safari", activities: ["Morning safari", "Afternoon safari", "Nature walk"] },
          { day: 3, title: "Morning Safari & Departure", activities: ["Final safari", "Check-out", "Departure"] },
        ],
        durationDays: 3,
        durationNights: 2,
        adultPrice: 22999,
        salePrice: 19999,
        childPrice: 15999,
        infantPrice: 0,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: true,
        isFeatured: false,
        rating: 4.4,
        reviewCount: 98,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Family trips
      {
        title: "Kerala Family Package - 7 Days",
        destinationId: destinationIds[1],
        destinationName: "Kerala",
        tripType: "Family",
        description: "Perfect family vacation with backwaters, hill stations, and beaches",
        highlights: ["Houseboat Stay", "Hill Station", "Beach Resort", "Cultural Shows"],
        inclusions: ["Family Accommodation", "All Meals", "Sightseeing", "Cultural Programs"],
        exclusions: ["Personal Expenses", "Adventure Activities", "Shopping"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Kochi",
            activities: ["Airport pickup", "Fort Kochi tour", "Chinese fishing nets"],
          },
          {
            day: 2,
            title: "Kochi to Munnar",
            activities: ["Travel to Munnar", "Tea plantation visit", "Hill station tour"],
          },
          { day: 3, title: "Munnar Sightseeing", activities: ["Mattupetty Dam", "Echo Point", "Tea museum"] },
          {
            day: 4,
            title: "Munnar to Alleppey",
            activities: ["Travel to Alleppey", "Houseboat check-in", "Backwater cruise"],
          },
          { day: 5, title: "Alleppey to Kovalam", activities: ["Travel to Kovalam", "Beach resort", "Ayurvedic spa"] },
          { day: 6, title: "Kovalam Beach Day", activities: ["Beach activities", "Water sports", "Lighthouse visit"] },
          { day: 7, title: "Departure", activities: ["Check-out", "Airport transfer"] },
        ],
        durationDays: 7,
        durationNights: 6,
        adultPrice: 32999,
        salePrice: 27999,
        childPrice: 19999,
        infantPrice: 5000,
        featuredImage: "/placeholder.svg?height=300&width=400",
        galleryImages: [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        status: "active",
        isTrending: false,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 203,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("trips").insertMany(trips)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        adminUserId: adminResult.insertedId,
        destinationsCount: destinations.length,
        tripsCount: trips.length,
        credentials: {
          email: "admin@jmttravel.com",
          password: "admin123",
        },
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
