"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Star, TrendingUp, Search, Filter, SortAsc, Camera, Heart } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destinationName: string
  images: string[]
  adultPrice: number
  salePrice: number
  durationDays: number
  durationNights: number
  tripType: string
  isTrending: boolean
  isPopular: boolean
  description: string
  highlights: string[]
  inclusions: string[]
  createdAt: string
}

export default function HolidaysPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")
  const [priceRange, setPriceRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    "all",
    "adventure",
    "beach",
    "cultural",
    "nature",
    "spiritual",
    "luxury",
    "family",
    "honeymoon",
    "wildlife",
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-25000", label: "Under ₹25,000" },
    { value: "25000-50000", label: "₹25,000 - ₹50,000" },
    { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
    { value: "100000-999999", label: "Above ₹1,00,000" },
  ]

  useEffect(() => {
    fetchTrips()
  }, [currentPage, selectedCategory, sortBy, searchTerm])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      })

      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchTerm) params.append("destination", searchTerm)

      const response = await fetch(`/api/trips?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips || [])
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter by price range
  let filteredTrips = trips
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number)
    filteredTrips = trips.filter((trip) => {
      const price = trip.salePrice || trip.adultPrice
      return price >= min && price <= max
    })
  }

  // Sort trips
  filteredTrips.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice || a.adultPrice) - (b.salePrice || b.adultPrice)
      case "price-high":
        return (b.salePrice || b.adultPrice) - (a.salePrice || a.adultPrice)
      case "duration":
        return a.durationDays - b.durationDays
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        // popularity
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1
        if (a.isPopular && !b.isPopular) return -1
        if (!a.isPopular && b.isPopular) return 1
        return a.title.localeCompare(b.title)
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchTrips()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Holiday Packages</h1>
            <p className="text-xl opacity-90">Discover amazing holiday destinations</p>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            <span className="text-lg">Loading holiday packages...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Holiday Packages</h1>
            <p className="text-xl opacity-90">Discover amazing destinations and create unforgettable memories</p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl"
            >
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white text-gray-900"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white text-gray-900 md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Sort by:</span>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredTrips.length} of {trips.length} packages
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16">
        <div className="container">
          {filteredTrips.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {filteredTrips.map((trip) => (
                  <Card key={trip._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <Image
                        src={trip.images?.[0] || "/placeholder.svg?height=200&width=300"}
                        alt={trip.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {trip.isTrending && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}

                      {trip.isPopular && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}

                      <div className="absolute bottom-2 left-2 text-white">
                        <div className="text-xs opacity-90">{trip.tripType}</div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {trip.title}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {trip.destinationName}
                      </div>

                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {trip.durationDays}D/{trip.durationNights}N
                      </div>

                      {trip.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{trip.description}</p>
                      )}

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{(trip.salePrice || trip.adultPrice)?.toLocaleString()}
                          </span>
                          {trip.salePrice && trip.adultPrice > trip.salePrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ₹{trip.adultPrice?.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/holidays/${trip._id}`}>
                            <Camera className="h-3 w-3 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/holidays/${trip._id}`}>
                            <Heart className="h-3 w-3 mr-1" />
                            Save
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">No holiday packages found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setCurrentPage(1)
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Custom Tour CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 opacity-90">Let us create a custom holiday package just for you</p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg" asChild>
            <Link href="/custom-packages">Create Custom Package</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
