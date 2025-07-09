import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // First get destination IDs
    const destinations = await db.collection("destinations").find({}).toArray()

    if (destinations.length === 0) {
      return NextResponse.json({ message: "No destinations found. Please seed destinations first." }, { status: 400 })
    }

    const trips = [
      {
        title: "Romantic Goa Beach Honeymoon",
        destinationId: destinations[0]._id,
        tripType: "Honeymoon",
        status: "active",
        durationDays: 5,
        durationNights: 4,
        minPax: 2,
        maxPax: 2,
        adultPrice: 25000,
        salePrice: 20000,
        childPrice: 0,
        description:
          "Perfect honeymoon package with beachside resort, candlelight dinners, and romantic experiences in beautiful Goa.",
        highlights: [
          "Beachside luxury resort stay",
          "Candlelight dinner on beach",
          "Couple spa sessions",
          "Private sunset cruise",
          "Airport transfers included",
        ],
        inclusions: [
          "4 nights accommodation in 5-star resort",
          "Daily breakfast and dinner",
          "Airport transfers",
          "Sightseeing tours",
          "Couple spa session",
        ],
        exclusions: ["Airfare", "Personal expenses", "Adventure activities", "Alcohol"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Goa",
            description:
              "Arrive at Goa airport, transfer to resort, check-in and relax. Evening at leisure on the beach.",
          },
          {
            day: 2,
            title: "North Goa Sightseeing",
            description:
              "Visit famous beaches like Baga, Calangute, and Anjuna. Explore local markets and enjoy water sports.",
          },
          {
            day: 3,
            title: "South Goa & Romantic Dinner",
            description:
              "Explore South Goa beaches, visit churches, and enjoy a romantic candlelight dinner on the beach.",
          },
          {
            day: 4,
            title: "Couple Spa & Sunset Cruise",
            description: "Relaxing couple spa session followed by a private sunset cruise with dinner.",
          },
          {
            day: 5,
            title: "Departure",
            description: "Check-out from resort and transfer to airport for departure.",
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
        ],
        isTrending: true,
        rating: 4.8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Kerala Backwater Adventure",
        destinationId: destinations[1]._id,
        tripType: "Adventure",
        status: "active",
        durationDays: 6,
        durationNights: 5,
        minPax: 2,
        maxPax: 8,
        adultPrice: 30000,
        salePrice: 24000,
        childPrice: 18000,
        description:
          "Thrilling adventure through Kerala backwaters with houseboat stays, trekking, and wildlife experiences.",
        highlights: [
          "Houseboat stay in Alleppey",
          "Munnar hill station visit",
          "Thekkady wildlife sanctuary",
          "Spice plantation tour",
          "Traditional Kerala cuisine",
        ],
        inclusions: [
          "5 nights accommodation",
          "Houseboat stay with meals",
          "All transfers",
          "Sightseeing tours",
          "Entry fees to attractions",
        ],
        exclusions: ["Airfare", "Personal expenses", "Camera fees", "Tips and gratuities"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Kochi",
            description: "Arrive in Kochi, transfer to hotel. Evening explore Fort Kochi and Chinese fishing nets.",
          },
          {
            day: 2,
            title: "Kochi to Munnar",
            description: "Drive to Munnar hill station. Visit tea gardens and enjoy the scenic beauty.",
          },
          {
            day: 3,
            title: "Munnar Sightseeing",
            description: "Visit Eravikulam National Park, Tea Museum, and enjoy trekking in the hills.",
          },
          {
            day: 4,
            title: "Munnar to Thekkady",
            description: "Drive to Thekkady. Visit spice plantations and enjoy wildlife safari in Periyar.",
          },
          {
            day: 5,
            title: "Thekkady to Alleppey",
            description: "Drive to Alleppey and board traditional houseboat for backwater cruise.",
          },
          {
            day: 6,
            title: "Departure",
            description: "Check-out from houseboat and transfer to Kochi airport for departure.",
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
        ],
        isTrending: true,
        rating: 4.6,
        difficulty: "moderate",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Rajasthan Royal Heritage Tour",
        destinationId: destinations[2]._id,
        tripType: "Cultural",
        status: "active",
        durationDays: 8,
        durationNights: 7,
        minPax: 2,
        maxPax: 12,
        adultPrice: 45000,
        salePrice: 38000,
        childPrice: 28000,
        description:
          "Explore the royal heritage of Rajasthan with magnificent palaces, forts, and cultural experiences.",
        highlights: [
          "Amber Fort and City Palace",
          "Udaipur Lake Palace",
          "Jaisalmer Desert Safari",
          "Traditional Rajasthani cuisine",
          "Folk dance performances",
        ],
        inclusions: [
          "7 nights heritage hotel stay",
          "All meals included",
          "AC transportation",
          "Professional guide",
          "All entry fees",
        ],
        exclusions: ["Airfare", "Personal expenses", "Camera fees at monuments", "Tips and gratuities"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Jaipur",
            description: "Arrive in Jaipur, check-in to heritage hotel. Evening visit to local markets.",
          },
          {
            day: 2,
            title: "Jaipur Sightseeing",
            description: "Visit Amber Fort, City Palace, Hawa Mahal, and Jantar Mantar observatory.",
          },
          {
            day: 3,
            title: "Jaipur to Jodhpur",
            description: "Drive to Jodhpur. Visit Mehrangarh Fort and explore the blue city.",
          },
          {
            day: 4,
            title: "Jodhpur to Jaisalmer",
            description: "Drive to Jaisalmer. Evening visit to Jaisalmer Fort and local markets.",
          },
          {
            day: 5,
            title: "Jaisalmer Desert Safari",
            description: "Full day desert safari with camel ride, sand dunes, and cultural evening.",
          },
          {
            day: 6,
            title: "Jaisalmer to Udaipur",
            description: "Drive to Udaipur, the city of lakes. Evening boat ride on Lake Pichola.",
          },
          {
            day: 7,
            title: "Udaipur Sightseeing",
            description: "Visit City Palace, Jagdish Temple, and Saheliyon ki Bari gardens.",
          },
          {
            day: 8,
            title: "Departure",
            description: "Transfer to Udaipur airport for departure.",
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop",
        ],
        isTrending: false,
        rating: 4.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Himachal Family Adventure",
        destinationId: destinations[3]._id,
        tripType: "Family",
        status: "active",
        durationDays: 7,
        durationNights: 6,
        minPax: 4,
        maxPax: 10,
        adultPrice: 28000,
        salePrice: 22000,
        childPrice: 16000,
        description: "Perfect family vacation in the mountains with adventure activities and scenic beauty.",
        highlights: [
          "Shimla toy train ride",
          "Manali adventure activities",
          "Rohtang Pass visit",
          "Apple orchards visit",
          "Family-friendly activities",
        ],
        inclusions: [
          "6 nights hotel accommodation",
          "Daily breakfast and dinner",
          "All transfers and sightseeing",
          "Toy train tickets",
          "Adventure activity vouchers",
        ],
        exclusions: ["Airfare", "Lunch meals", "Personal expenses", "Adventure activities (optional)"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Shimla",
            description: "Arrive in Shimla, check-in to hotel. Evening walk on Mall Road and Ridge.",
          },
          {
            day: 2,
            title: "Shimla Local Sightseeing",
            description: "Visit Kufri, Jakhoo Temple, and enjoy toy train ride. Evening at leisure.",
          },
          {
            day: 3,
            title: "Shimla to Manali",
            description: "Drive to Manali via scenic route. Check-in to hotel and rest.",
          },
          {
            day: 4,
            title: "Manali Local Sightseeing",
            description: "Visit Hadimba Temple, Vashisht hot springs, and Old Manali market.",
          },
          {
            day: 5,
            title: "Rohtang Pass Excursion",
            description: "Full day excursion to Rohtang Pass (subject to weather). Snow activities and scenic views.",
          },
          {
            day: 6,
            title: "Solang Valley Adventure",
            description: "Visit Solang Valley for adventure activities like paragliding, zorbing, and ropeway.",
          },
          {
            day: 7,
            title: "Departure",
            description: "Check-out and transfer to airport/railway station for departure.",
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
        ],
        isTrending: true,
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Maldives Luxury Beach Resort",
        destinationId: destinations[4]._id,
        tripType: "Luxury",
        status: "active",
        durationDays: 5,
        durationNights: 4,
        minPax: 2,
        maxPax: 4,
        adultPrice: 150000,
        salePrice: 120000,
        childPrice: 0,
        description:
          "Ultimate luxury experience in Maldives with overwater villas, world-class spa, and pristine beaches.",
        highlights: [
          "Overwater villa accommodation",
          "Private beach access",
          "World-class spa treatments",
          "Fine dining restaurants",
          "Water sports activities",
        ],
        inclusions: [
          "4 nights overwater villa",
          "All meals and beverages",
          "Seaplane transfers",
          "Spa treatments",
          "Water sports equipment",
        ],
        exclusions: [
          "International airfare",
          "Personal expenses",
          "Excursions (optional)",
          "Alcoholic beverages (premium)",
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Maldives",
            description: "Arrive at Male airport, seaplane transfer to resort. Check-in to overwater villa and relax.",
          },
          {
            day: 2,
            title: "Beach & Water Activities",
            description: "Enjoy snorkeling, diving, and various water sports. Sunset dolphin cruise.",
          },
          {
            day: 3,
            title: "Spa & Relaxation",
            description: "Full day spa treatments and relaxation. Private beach dining experience.",
          },
          {
            day: 4,
            title: "Island Exploration",
            description: "Visit local islands, cultural experiences, and shopping for souvenirs.",
          },
          {
            day: 5,
            title: "Departure",
            description: "Check-out and seaplane transfer to Male airport for departure.",
          },
        ],
        featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        galleryImages: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        ],
        isTrending: true,
        rating: 4.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Clear existing trips
    await db.collection("trips").deleteMany({})

    // Insert new trips
    const result = await db.collection("trips").insertMany(trips)

    return NextResponse.json({
      message: `Successfully seeded ${result.insertedCount} trips`,
      insertedIds: result.insertedIds,
    })
  } catch (error) {
    console.error("Error seeding trips:", error)
    return NextResponse.json({ message: "Failed to seed trips", error: error.message }, { status: 500 })
  }
}
