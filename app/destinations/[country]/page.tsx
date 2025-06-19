"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Star, Clock, MapPin, Users, Search, Calendar, Plane, Hotel, Car } from "lucide-react"

// Mock data for country packages
const countryPackages: Record<string, any> = {
  goa: {
    name: "Goa",
    description: "Experience the perfect blend of sun, sand, and sea in India's beach paradise",
    image: "/placeholder.svg?height=400&width=800",
    totalPackages: 45,
    bestTime: "November - February",
    highlights: ["Pristine Beaches", "Water Sports", "Nightlife", "Portuguese Heritage", "Seafood Cuisine"],
    packages: [
      {
        id: 1,
        title: "Goa Beach Holiday",
        image: "/placeholder.svg?height=200&width=300",
        duration: "4 Days / 3 Nights",
        price: 12999,
        originalPrice: 15999,
        rating: 4.5,
        reviews: 245,
        discount: 19,
        category: "Beach",
        includes: ["Hotel", "Meals", "Transfers"],
        highlights: ["Baga Beach", "Water Sports", "Sunset Cruise"],
      },
      {
        id: 7,
        title: "Goa Adventure Package",
        image: "/placeholder.svg?height=200&width=300",
        duration: "5 Days / 4 Nights",
        price: 16999,
        originalPrice: 19999,
        rating: 4.3,
        reviews: 189,
        discount: 15,
        category: "Adventure",
        includes: ["Hotel", "Adventure", "Meals"],
        highlights: ["Parasailing", "Jet Skiing", "Scuba Diving"],
      },
      {
        id: 8,
        title: "Goa Heritage Tour",
        image: "/placeholder.svg?height=200&width=300",
        duration: "3 Days / 2 Nights",
        price: 9999,
        originalPrice: 11999,
        rating: 4.4,
        reviews: 156,
        discount: 17,
        category: "Heritage",
        includes: ["Hotel", "Guide", "Transfers"],
        highlights: ["Old Goa Churches", "Spice Plantation", "Local Markets"],
      },
    ],
  },
  kerala: {
    name: "Kerala",
    description: "Discover God's Own Country with serene backwaters, lush hill stations, and rich cultural heritage",
    image: "/placeholder.svg?height=400&width=800",
    totalPackages: 38,
    bestTime: "September - March",
    highlights: ["Backwaters", "Hill Stations", "Ayurveda", "Wildlife", "Tea Gardens"],
    packages: [
      {
        id: 2,
        title: "Kerala Backwaters",
        image: "/placeholder.svg?height=200&width=300",
        duration: "5 Days / 4 Nights",
        price: 18999,
        originalPrice: 22999,
        rating: 4.7,
        reviews: 189,
        discount: 17,
        category: "Nature",
        includes: ["Houseboat", "Meals", "Sightseeing"],
        highlights: ["Alleppey Backwaters", "Munnar Hills", "Thekkady Wildlife"],
      },
      {
        id: 9,
        title: "Kerala Hill Stations",
        image: "/placeholder.svg?height=200&width=300",
        duration: "6 Days / 5 Nights",
        price: 22999,
        originalPrice: 26999,
        rating: 4.6,
        reviews: 234,
        discount: 15,
        category: "Hill Station",
        includes: ["Hotel", "Meals", "Sightseeing"],
        highlights: ["Munnar Tea Gardens", "Thekkady", "Kumily"],
      },
      {
        id: 10,
        title: "Kerala Ayurveda Retreat",
        image: "/placeholder.svg?height=200&width=300",
        duration: "7 Days / 6 Nights",
        price: 28999,
        originalPrice: 34999,
        rating: 4.8,
        reviews: 167,
        discount: 17,
        category: "Wellness",
        includes: ["Resort", "Ayurveda", "Meals"],
        highlights: ["Ayurvedic Treatments", "Yoga Sessions", "Meditation"],
      },
    ],
  },
  rajasthan: {
    name: "Rajasthan",
    description: "Experience the royal heritage, magnificent palaces, and vibrant culture of the Land of Kings",
    image: "/placeholder.svg?height=400&width=800",
    totalPackages: 52,
    bestTime: "October - March",
    highlights: ["Royal Palaces", "Desert Safari", "Cultural Heritage", "Handicrafts", "Folk Music"],
    packages: [
      {
        id: 3,
        title: "Rajasthan Royal Tour",
        image: "/placeholder.svg?height=200&width=300",
        duration: "6 Days / 5 Nights",
        price: 24999,
        originalPrice: 29999,
        rating: 4.6,
        reviews: 312,
        discount: 17,
        category: "Heritage",
        includes: ["Palace Hotels", "Meals", "Guide"],
        highlights: ["Jaipur City Palace", "Udaipur Lake Palace", "Jodhpur Fort"],
      },
      {
        id: 11,
        title: "Rajasthan Desert Safari",
        image: "/placeholder.svg?height=200&width=300",
        duration: "5 Days / 4 Nights",
        price: 19999,
        originalPrice: 23999,
        rating: 4.5,
        reviews: 198,
        discount: 17,
        category: "Adventure",
        includes: ["Desert Camp", "Camel Safari", "Meals"],
        highlights: ["Thar Desert", "Camel Safari", "Folk Dance"],
      },
      {
        id: 12,
        title: "Golden Triangle with Rajasthan",
        image: "/placeholder.svg?height=200&width=300",
        duration: "8 Days / 7 Nights",
        price: 32999,
        originalPrice: 38999,
        rating: 4.7,
        reviews: 276,
        discount: 15,
        category: "Heritage",
        includes: ["Hotels", "Transport", "Guide"],
        highlights: ["Delhi", "Agra", "Jaipur", "Udaipur"],
      },
    ],
  },
  "himachal-pradesh": {
    name: "Himachal Pradesh",
    description: "Explore the scenic beauty of the Himalayas with snow-capped peaks, valleys, and adventure activities",
    image: "/placeholder.svg?height=400&width=800",
    totalPackages: 41,
    bestTime: "March - June, September - November",
    highlights: ["Snow Mountains", "Adventure Sports", "Hill Stations", "Temples", "Apple Orchards"],
    packages: [
      {
        id: 4,
        title: "Himachal Adventure",
        image: "/placeholder.svg?height=200&width=300",
        duration: "7 Days / 6 Nights",
        price: 21999,
        originalPrice: 26999,
        rating: 4.4,
        reviews: 178,
        discount: 19,
        category: "Adventure",
        includes: ["Hotel", "Adventure", "Meals"],
        highlights: ["Manali", "Solang Valley", "Rohtang Pass"],
      },
      {
        id: 13,
        title: "Shimla Manali Package",
        image: "/placeholder.svg?height=200&width=300",
        duration: "6 Days / 5 Nights",
        price: 18999,
        originalPrice: 22999,
        rating: 4.5,
        reviews: 234,
        discount: 17,
        category: "Hill Station",
        includes: ["Hotel", "Sightseeing", "Meals"],
        highlights: ["Shimla Mall Road", "Manali", "Kullu Valley"],
      },
      {
        id: 14,
        title: "Dharamshala McLeod Ganj",
        image: "/placeholder.svg?height=200&width=300",
        duration: "4 Days / 3 Nights",
        price: 14999,
        originalPrice: 17999,
        rating: 4.6,
        reviews: 145,
        discount: 17,
        category: "Spiritual",
        includes: ["Hotel", "Sightseeing", "Meals"],
        highlights: ["Dalai Lama Temple", "Bhagsu Waterfall", "Triund Trek"],
      },
    ],
  },
  ladakh: {
    name: "Ladakh",
    description: "Experience the high altitude desert with stunning landscapes, monasteries, and adventure activities",
    image: "/placeholder.svg?height=400&width=800",
    totalPackages: 28,
    bestTime: "May - September",
    highlights: [
      "High Altitude Desert",
      "Buddhist Monasteries",
      "Adventure Sports",
      "Scenic Landscapes",
      "Local Culture",
    ],
    packages: [
      {
        id: 15,
        title: "Leh Ladakh Adventure",
        image: "/placeholder.svg?height=200&width=300",
        duration: "8 Days / 7 Nights",
        price: 35999,
        originalPrice: 42999,
        rating: 4.8,
        reviews: 189,
        discount: 16,
        category: "Adventure",
        includes: ["Hotel", "Transport", "Permits"],
        highlights: ["Pangong Lake", "Nubra Valley", "Khardung La Pass"],
      },
      {
        id: 16,
        title: "Ladakh Bike Trip",
        image: "/placeholder.svg?height=200&width=300",
        duration: "10 Days / 9 Nights",
        price: 45999,
        originalPrice: 54999,
        rating: 4.7,
        reviews: 156,
        discount: 16,
        category: "Adventure",
        includes: ["Bike Rental", "Accommodation", "Support"],
        highlights: ["Manali to Leh", "Khardung La", "Pangong Lake"],
      },
      {
        id: 17,
        title: "Ladakh Cultural Tour",
        image: "/placeholder.svg?height=200&width=300",
        duration: "6 Days / 5 Nights",
        price: 28999,
        originalPrice: 33999,
        rating: 4.6,
        reviews: 123,
        discount: 15,
        category: "Cultural",
        includes: ["Hotel", "Guide", "Monasteries"],
        highlights: ["Hemis Monastery", "Thiksey Monastery", "Shey Palace"],
      },
    ],
  },
}

export default function CountryPackagesPage({ params }: { params: { country: string } }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [filterCategory, setFilterCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const countryData = countryPackages[params.country.toLowerCase()]

  if (!countryData) {
    notFound()
  }

  // Filter and sort packages
  let filteredPackages = countryData.packages.filter((pkg: any) =>
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (filterCategory !== "all") {
    filteredPackages = filteredPackages.filter(
      (pkg: any) => pkg.category.toLowerCase() === filterCategory.toLowerCase(),
    )
  }

  if (priceRange !== "all") {
    filteredPackages = filteredPackages.filter((pkg: any) => {
      switch (priceRange) {
        case "budget":
          return pkg.price < 15000
        case "mid":
          return pkg.price >= 15000 && pkg.price < 25000
        case "luxury":
          return pkg.price >= 25000
        default:
          return true
      }
    })
  }

  // Sort packages
  filteredPackages.sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return b.reviews - a.reviews
    }
  })

  const categories = ["all", ...Array.from(new Set(countryData.packages.map((pkg: any) => pkg.category.toLowerCase())))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image src={countryData.image || "/placeholder.svg"} alt={countryData.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{countryData.name}</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl">{countryData.description}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Best Time: {countryData.bestTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{countryData.totalPackages} Packages Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Visit {countryData.name}?</h2>
          <div className="flex flex-wrap gap-2">
            {countryData.highlights.map((highlight: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under ₹15,000</SelectItem>
                <SelectItem value="mid">₹15,000 - ₹25,000</SelectItem>
                <SelectItem value="luxury">Above ₹25,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPackages.length} of {countryData.packages.length} packages
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg: any) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {pkg.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">{pkg.discount}% OFF</Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white">{pkg.category}</Badge>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{pkg.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-gray-500">({pkg.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500">Group Tour</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pkg.includes.map((item: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight: string, index: number) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">₹{pkg.price.toLocaleString()}</span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">per person</span>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href={`/holidays/${pkg.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No packages found matching your criteria</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("all")
                setPriceRange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Plane className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Flight Bookings</h3>
              <p className="text-sm text-gray-600">We can arrange flights to {countryData.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Hotel className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Accommodation</h3>
              <p className="text-sm text-gray-600">From budget to luxury hotels</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transportation</h3>
              <p className="text-sm text-gray-600">Private cabs and transfers included</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
