"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, MapPin, Users, Search, Calendar, Percent, Gift, Timer, Tag } from "lucide-react"

const offerPackages = [
  {
    id: 1,
    title: "Goa Beach Holiday - Early Bird Special",
    destination: "Goa",
    image: "/placeholder.svg?height=200&width=300",
    duration: "4 Days / 3 Nights",
    price: 9999,
    originalPrice: 15999,
    rating: 4.5,
    reviews: 245,
    discount: 38,
    offerType: "Early Bird",
    validTill: "2024-02-15",
    category: "Beach",
    includes: ["Hotel", "Meals", "Transfers"],
    highlights: ["Baga Beach", "Water Sports", "Sunset Cruise"],
    offerDescription: "Book 30 days in advance and save big!",
  },
  {
    id: 2,
    title: "Kerala Backwaters - Monsoon Special",
    destination: "Kerala",
    image: "/placeholder.svg?height=200&width=300",
    duration: "5 Days / 4 Nights",
    price: 14999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 35,
    offerType: "Seasonal",
    validTill: "2024-01-31",
    category: "Nature",
    includes: ["Houseboat", "Meals", "Sightseeing"],
    highlights: ["Alleppey Backwaters", "Munnar Hills", "Thekkady Wildlife"],
    offerDescription: "Experience Kerala's beauty during monsoon season",
  },
  {
    id: 3,
    title: "Rajasthan Royal Tour - Group Discount",
    destination: "Rajasthan",
    image: "/placeholder.svg?height=200&width=300",
    duration: "6 Days / 5 Nights",
    price: 19999,
    originalPrice: 29999,
    rating: 4.6,
    reviews: 312,
    discount: 33,
    offerType: "Group Deal",
    validTill: "2024-03-31",
    category: "Heritage",
    includes: ["Palace Hotels", "Meals", "Guide"],
    highlights: ["Jaipur City Palace", "Udaipur Lake Palace", "Jodhpur Fort"],
    offerDescription: "Special rates for groups of 6 or more",
  },
  {
    id: 4,
    title: "Himachal Adventure - Flash Sale",
    destination: "Himachal Pradesh",
    image: "/placeholder.svg?height=200&width=300",
    duration: "7 Days / 6 Nights",
    price: 16999,
    originalPrice: 26999,
    rating: 4.4,
    reviews: 178,
    discount: 37,
    offerType: "Flash Sale",
    validTill: "2024-01-20",
    category: "Adventure",
    includes: ["Hotel", "Adventure", "Meals"],
    highlights: ["Manali", "Solang Valley", "Rohtang Pass"],
    offerDescription: "Limited time offer - only 48 hours left!",
  },
  {
    id: 5,
    title: "Golden Triangle - Weekend Special",
    destination: "Delhi-Agra-Jaipur",
    image: "/placeholder.svg?height=200&width=300",
    duration: "5 Days / 4 Nights",
    price: 12999,
    originalPrice: 19999,
    rating: 4.5,
    reviews: 210,
    discount: 35,
    offerType: "Weekend Deal",
    validTill: "2024-02-28",
    category: "Heritage",
    includes: ["Hotels", "Transport", "Guide"],
    highlights: ["Red Fort", "Taj Mahal", "Hawa Mahal"],
    offerDescription: "Perfect for weekend getaways",
  },
  {
    id: 6,
    title: "Kashmir Paradise - Honeymoon Package",
    destination: "Kashmir",
    image: "/placeholder.svg?height=200&width=300",
    duration: "6 Days / 5 Nights",
    price: 22999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 156,
    discount: 34,
    offerType: "Honeymoon",
    validTill: "2024-04-30",
    category: "Romantic",
    includes: ["Houseboat", "Hotels", "Shikara"],
    highlights: ["Dal Lake", "Gulmarg", "Pahalgam"],
    offerDescription: "Special romantic package for couples",
  },
  {
    id: 7,
    title: "Ladakh Adventure - Last Minute Deal",
    destination: "Ladakh",
    image: "/placeholder.svg?height=200&width=300",
    duration: "8 Days / 7 Nights",
    price: 28999,
    originalPrice: 42999,
    rating: 4.8,
    reviews: 189,
    discount: 33,
    offerType: "Last Minute",
    validTill: "2024-01-25",
    category: "Adventure",
    includes: ["Hotel", "Transport", "Permits"],
    highlights: ["Pangong Lake", "Nubra Valley", "Khardung La Pass"],
    offerDescription: "Book now for immediate departure",
  },
  {
    id: 8,
    title: "Andaman Islands - Family Package",
    destination: "Andaman",
    image: "/placeholder.svg?height=200&width=300",
    duration: "6 Days / 5 Nights",
    price: 18999,
    originalPrice: 28999,
    rating: 4.6,
    reviews: 234,
    discount: 34,
    offerType: "Family Deal",
    validTill: "2024-03-15",
    category: "Beach",
    includes: ["Hotel", "Meals", "Activities"],
    highlights: ["Radhanagar Beach", "Cellular Jail", "Scuba Diving"],
    offerDescription: "Special rates for families with children",
  },
]

const offerTypes = [
  { value: "all", label: "All Offers", icon: <Tag className="h-4 w-4" /> },
  { value: "early-bird", label: "Early Bird", icon: <Calendar className="h-4 w-4" /> },
  { value: "flash-sale", label: "Flash Sale", icon: <Timer className="h-4 w-4" /> },
  { value: "group-deal", label: "Group Deals", icon: <Users className="h-4 w-4" /> },
  { value: "seasonal", label: "Seasonal", icon: <Gift className="h-4 w-4" /> },
  { value: "last-minute", label: "Last Minute", icon: <Clock className="h-4 w-4" /> },
]

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("discount")
  const [filterOfferType, setFilterOfferType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Filter packages
  let filteredPackages = offerPackages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (filterOfferType !== "all") {
    filteredPackages = filteredPackages.filter(
      (pkg) => pkg.offerType.toLowerCase().replace(" ", "-") === filterOfferType,
    )
  }

  if (filterCategory !== "all") {
    filteredPackages = filteredPackages.filter((pkg) => pkg.category.toLowerCase() === filterCategory.toLowerCase())
  }

  // Sort packages
  filteredPackages.sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount - a.discount
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return b.discount - a.discount
    }
  })

  const categories = ["all", ...Array.from(new Set(offerPackages.map((pkg) => pkg.category.toLowerCase())))]

  const getOfferTypeColor = (offerType: string) => {
    switch (offerType.toLowerCase()) {
      case "flash sale":
        return "bg-red-500"
      case "early bird":
        return "bg-blue-500"
      case "group deal":
        return "bg-green-500"
      case "seasonal":
        return "bg-purple-500"
      case "last minute":
        return "bg-orange-500"
      case "honeymoon":
        return "bg-pink-500"
      case "family deal":
        return "bg-cyan-500"
      default:
        return "bg-gray-500"
    }
  }

  const isOfferExpiringSoon = (validTill: string) => {
    const today = new Date()
    const expiryDate = new Date(validTill)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="container text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/20 rounded-full">
              <Percent className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Special Offers</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
            Grab the best deals on holiday packages and save big on your next adventure
          </p>
          <div className="flex justify-center items-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white border-white/30">Up to 40% OFF</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Limited Time Offers</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Best Price Guarantee</Badge>
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
                placeholder="Search offers by destination or package name..."
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
                  <SelectItem value="discount">Highest Discount</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={filterOfferType} onValueChange={setFilterOfferType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Offer Type" />
              </SelectTrigger>
              <SelectContent>
                {offerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
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
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">Showing {filteredPackages.length} special offers</p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow group relative">
              {/* Offer Badge */}
              <div className="absolute top-2 left-2 z-10">
                <Badge className={`${getOfferTypeColor(pkg.offerType)} text-white`}>{pkg.offerType}</Badge>
              </div>

              {/* Discount Badge */}
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-red-500 text-white text-lg font-bold px-3 py-1">{pkg.discount}% OFF</Badge>
              </div>

              {/* Expiry Warning */}
              {isOfferExpiringSoon(pkg.validTill) && (
                <div className="absolute top-12 right-2 z-10">
                  <Badge className="bg-orange-500 text-white animate-pulse">
                    <Timer className="h-3 w-3 mr-1" />
                    Expires Soon
                  </Badge>
                </div>
              )}

              <div className="relative">
                <Image
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{pkg.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{pkg.destination}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-3 w-3" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-orange-800 mb-1">Special Offer:</div>
                    <div className="text-sm text-orange-700">{pkg.offerDescription}</div>
                    <div className="text-xs text-orange-600 mt-1">
                      Valid till: {new Date(pkg.validTill).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-gray-500">({pkg.reviews})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {pkg.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pkg.includes.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">₹{pkg.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">per person</div>
                      <div className="text-xs text-green-600 font-medium">
                        You save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                      <Link href={`/holidays/${pkg.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No offers found matching your criteria</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterOfferType("all")
                setFilterCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-lg mb-6">
            These special offers are available for a limited time only. Book now to secure the best deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="h-4 w-4 mr-2" />
              Call for Booking
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Need Help Choosing?
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Phone({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  )
}
