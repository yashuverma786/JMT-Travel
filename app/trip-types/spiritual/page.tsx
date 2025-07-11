"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, MapPin, Calendar, Users, Star, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Trip {
  _id: string
  title: string
  destinationName: string
  adultPrice: number
  salePrice: number
  durationDays: number
  durationNights: number
  featuredImage: string
  rating?: number
  highlights: string[]
  isTrending: boolean
}

export default function SpiritualTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [durationFilter, setDurationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  useEffect(() => {
    fetchSpiritualTrips()
  }, [])

  const fetchSpiritualTrips = async () => {
    try {
      const response = await fetch("/api/trips?tripType=Spiritual")
      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips || [])
      }
    } catch (error) {
      console.error("Error fetching spiritual trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destinationName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = trip.salePrice >= priceRange[0] && trip.salePrice <= priceRange[1]
    const matchesDuration =
      durationFilter === "all" ||
      (durationFilter === "short" && trip.durationDays <= 5) ||
      (durationFilter === "medium" && trip.durationDays > 5 && trip.durationDays <= 10) ||
      (durationFilter === "long" && trip.durationDays > 10)

    return matchesSearch && matchesPrice && matchesDuration
  })

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.salePrice - b.salePrice
      case "price-high":
        return b.salePrice - a.salePrice
      case "duration":
        return a.durationDays - b.durationDays
      case "popular":
      default:
        return b.isTrending ? 1 : -1
    }
  })

  const calculateDiscount = (originalPrice: number, salePrice: number) => {
    if (originalPrice > salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8" />
            <h1 className="text-4xl md:text-6xl font-bold">Spiritual Packages</h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 opacity-90">Find peace and enlightenment on sacred journeys</p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search spiritual destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={2000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Durations</SelectItem>
                    <SelectItem value="short">1-5 Days</SelectItem>
                    <SelectItem value="medium">6-10 Days</SelectItem>
                    <SelectItem value="long">10+ Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setPriceRange([0, 100000])
                    setDurationFilter("all")
                    setSortBy("popular")
                  }}
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{sortedTrips.length} Spiritual Packages Found</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedTrips.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No spiritual packages found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
              <Button asChild>
                <Link href="/custom-packages">Create Custom Package</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrips.map((trip) => {
              const discount = calculateDiscount(trip.adultPrice, trip.salePrice)
              return (
                <Card key={trip._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <Image
                      src={trip.featuredImage || "/placeholder.svg?height=200&width=300&query=spiritual+temple"}
                      alt={trip.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {trip.isTrending && (
                        <Badge className="bg-orange-500 text-white">
                          <Heart className="h-3 w-3 mr-1" />
                          Sacred
                        </Badge>
                      )}
                      {discount > 0 && <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>}
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/70 text-white">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {trip.rating || "4.6"}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {trip.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span>{trip.destinationName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>
                          {trip.durationDays} Days / {trip.durationNights} Nights
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span>Spiritual Seekers</span>
                      </div>
                    </div>

                    {trip.highlights && trip.highlights.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {trip.highlights.slice(0, 2).map((highlight, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                          {trip.highlights.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{trip.highlights.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-orange-600">₹{trip.salePrice.toLocaleString()}</span>
                          {discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.adultPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <Button asChild className="bg-orange-600 hover:bg-orange-700">
                        <Link href={`/trips/${trip._id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
