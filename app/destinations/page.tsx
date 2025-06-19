"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Calendar,
  Users,
  Star,
  TrendingUp,
  Plane,
  Camera,
  Mountain,
  Waves,
  TreePine,
  Building,
} from "lucide-react"

const destinations = [
  {
    id: "goa",
    name: "Goa",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 45,
    startingPrice: 9999,
    rating: 4.5,
    reviews: 1250,
    category: "Beach",
    bestTime: "November - February",
    description: "Sun, sand, and sea with vibrant nightlife",
    highlights: ["Pristine Beaches", "Water Sports", "Nightlife", "Portuguese Heritage"],
    trending: true,
    icon: <Waves className="h-5 w-5" />,
  },
  {
    id: "kerala",
    name: "Kerala",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 38,
    startingPrice: 14999,
    rating: 4.7,
    reviews: 980,
    category: "Nature",
    bestTime: "September - March",
    description: "God's Own Country with backwaters and hills",
    highlights: ["Backwaters", "Hill Stations", "Ayurveda", "Wildlife"],
    trending: true,
    icon: <TreePine className="h-5 w-5" />,
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 52,
    startingPrice: 19999,
    rating: 4.6,
    reviews: 1450,
    category: "Heritage",
    bestTime: "October - March",
    description: "Land of Kings with royal palaces and deserts",
    highlights: ["Royal Palaces", "Desert Safari", "Cultural Heritage", "Handicrafts"],
    trending: false,
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 41,
    startingPrice: 16999,
    rating: 4.4,
    reviews: 890,
    category: "Hill Station",
    bestTime: "March - June, September - November",
    description: "Scenic Himalayan beauty with adventure activities",
    highlights: ["Snow Mountains", "Adventure Sports", "Hill Stations", "Temples"],
    trending: true,
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    id: "ladakh",
    name: "Ladakh",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 28,
    startingPrice: 28999,
    rating: 4.8,
    reviews: 567,
    category: "Adventure",
    bestTime: "May - September",
    description: "High altitude desert with stunning landscapes",
    highlights: ["High Altitude Desert", "Buddhist Monasteries", "Adventure Sports", "Scenic Landscapes"],
    trending: true,
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    id: "kashmir",
    name: "Kashmir",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 33,
    startingPrice: 22999,
    rating: 4.8,
    reviews: 756,
    category: "Hill Station",
    bestTime: "March - October",
    description: "Paradise on Earth with beautiful valleys",
    highlights: ["Dal Lake", "Houseboats", "Saffron Fields", "Snow-capped Mountains"],
    trending: false,
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    id: "andaman",
    name: "Andaman Islands",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 25,
    startingPrice: 18999,
    rating: 4.6,
    reviews: 634,
    category: "Beach",
    bestTime: "October - May",
    description: "Pristine beaches and crystal clear waters",
    highlights: ["Pristine Beaches", "Scuba Diving", "Marine Life", "Water Sports"],
    trending: true,
    icon: <Waves className="h-5 w-5" />,
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 36,
    startingPrice: 15999,
    rating: 4.5,
    reviews: 723,
    category: "Spiritual",
    bestTime: "March - June, September - November",
    description: "Land of Gods with spiritual and adventure experiences",
    highlights: ["Char Dham", "Rishikesh", "Jim Corbett", "Valley of Flowers"],
    trending: false,
    icon: <Mountain className="h-5 w-5" />,
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 29,
    startingPrice: 13999,
    rating: 4.4,
    reviews: 567,
    category: "Heritage",
    bestTime: "November - March",
    description: "Rich cultural heritage with ancient temples",
    highlights: ["Ancient Temples", "Classical Dance", "Hill Stations", "Beaches"],
    trending: false,
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: "karnataka",
    name: "Karnataka",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 31,
    startingPrice: 12999,
    rating: 4.3,
    reviews: 489,
    category: "Nature",
    bestTime: "October - March",
    description: "Diverse landscapes from beaches to hills",
    highlights: ["Coorg Coffee Plantations", "Hampi Ruins", "Bangalore Gardens", "Coastal Beaches"],
    trending: false,
    icon: <TreePine className="h-5 w-5" />,
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 27,
    startingPrice: 11999,
    rating: 4.2,
    reviews: 445,
    category: "Heritage",
    bestTime: "October - February",
    description: "Historical caves, hill stations, and vibrant cities",
    highlights: ["Ajanta Ellora Caves", "Lonavala", "Mumbai", "Mahabaleshwar"],
    trending: false,
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    country: "India",
    image: "/placeholder.svg?height=300&width=400",
    packages: 23,
    startingPrice: 10999,
    rating: 4.3,
    reviews: 378,
    category: "Cultural",
    bestTime: "October - March",
    description: "Cultural capital with rich heritage and hill stations",
    highlights: ["Kolkata Heritage", "Darjeeling Tea Gardens", "Sundarbans", "Cultural Festivals"],
    trending: false,
    icon: <Building className="h-5 w-5" />,
  },
]

const categories = [
  { value: "all", label: "All Categories", icon: <MapPin className="h-4 w-4" /> },
  { value: "beach", label: "Beach", icon: <Waves className="h-4 w-4" /> },
  { value: "hill station", label: "Hill Station", icon: <Mountain className="h-4 w-4" /> },
  { value: "heritage", label: "Heritage", icon: <Building className="h-4 w-4" /> },
  { value: "nature", label: "Nature", icon: <TreePine className="h-4 w-4" /> },
  { value: "adventure", label: "Adventure", icon: <Mountain className="h-4 w-4" /> },
  { value: "spiritual", label: "Spiritual", icon: <Building className="h-4 w-4" /> },
  { value: "cultural", label: "Cultural", icon: <Building className="h-4 w-4" /> },
]

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)

  // Filter destinations
  let filteredDestinations = destinations.filter(
    (destination) =>
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (filterCategory !== "all") {
    filteredDestinations = filteredDestinations.filter(
      (destination) => destination.category.toLowerCase() === filterCategory.toLowerCase(),
    )
  }

  if (showTrendingOnly) {
    filteredDestinations = filteredDestinations.filter((destination) => destination.trending)
  }

  // Sort destinations
  filteredDestinations.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.startingPrice - b.startingPrice
      case "price-high":
        return b.startingPrice - a.startingPrice
      case "rating":
        return b.rating - a.rating
      case "packages":
        return b.packages - a.packages
      default:
        return b.reviews - a.reviews
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="container text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <MapPin className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Discover incredible destinations across India with our curated travel packages
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">{destinations.length} Destinations</Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              {destinations.reduce((sum, dest) => sum + dest.packages, 0)} Packages
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">Best Prices Guaranteed</Badge>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="packages">Most Packages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      {category.icon}
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showTrendingOnly ? "default" : "outline"}
              onClick={() => setShowTrendingOnly(!showTrendingOnly)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Trending Only
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Trending Badge */}
                {destination.trending && (
                  <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}

                {/* Category Badge */}
                <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                  <div className="flex items-center gap-1">
                    {destination.icon}
                    {destination.category}
                  </div>
                </Badge>

                {/* Destination Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{destination.packages} packages</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">₹{destination.startingPrice.toLocaleString()}</div>
                      <div className="text-xs opacity-75">starting from</div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{destination.rating}</span>
                      <span className="text-gray-500 text-sm">({destination.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{destination.bestTime}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                      {destination.highlights.length > 3 && (
                        <span className="text-xs text-gray-500">+{destination.highlights.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href={`/destinations/${destination.id}`}>
                        <Camera className="h-3 w-3 mr-1" />
                        Explore
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/destinations/${destination.id}`}>
                        <Plane className="h-3 w-3 mr-1" />
                        Packages
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No destinations found matching your criteria</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("all")
                setShowTrendingOnly(false)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Popular Categories */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <Card
                key={category.value}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => setFilterCategory(category.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">{category.icon}</div>
                  </div>
                  <h3 className="font-semibold">{category.label}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {destinations.filter((d) => d.category.toLowerCase() === category.value).length} destinations
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find Your Dream Destination?</h2>
          <p className="text-lg mb-6">
            Let our travel experts help you plan the perfect trip tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/custom-packages">Create Custom Package</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
