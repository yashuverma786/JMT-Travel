"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Clock, MapPin, Search, Loader2 } from "lucide-react"

interface Holiday {
  _id: string
  title: string
  destinationName: string
  imageUrls?: string[]
  featuredImage?: string
  adultPrice: number
  salePrice?: number
  durationDays: number
  durationNights: number
  rating?: number
  reviews?: number
  category: string
  includes: string[]
  highlights: string[]
  isTrending?: boolean
  featured?: boolean
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [filterCategory, setFilterCategory] = useState("all")

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trips")
      if (response.ok) {
        const data = await response.json()
        setHolidays(data.trips || [])
      }
    } catch (error) {
      console.error("Error fetching holidays:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter holidays
  let filteredHolidays = holidays.filter(
    (holiday) =>
      holiday.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holiday.destinationName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (filterCategory !== "all") {
    filteredHolidays = filteredHolidays.filter(
      (holiday) => holiday.category?.toLowerCase() === filterCategory.toLowerCase(),
    )
  }

  // Sort holidays
  filteredHolidays.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice || a.adultPrice) - (b.salePrice || b.adultPrice)
      case "price-high":
        return (b.salePrice || b.adultPrice) - (a.salePrice || a.adultPrice)
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "duration":
        return b.durationDays - a.durationDays
      default:
        // featured first
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.isTrending && !b.isTrending) return -1
        if (!a.isTrending && b.isTrending) return 1
        return a.title.localeCompare(b.title)
    }
  })

  const categories = Array.from(new Set(holidays.map((h) => h.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Holiday Packages</h1>
            <p className="text-xl opacity-90">Discover amazing holiday destinations and experiences</p>
          </div>
        </section>
        <div className="container py-16">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="text-lg">Loading holiday packages...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Holiday Packages</h1>
          <p className="text-xl opacity-90">Discover amazing holiday destinations and experiences</p>
        </div>
      </section>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search holiday packages..."
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
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
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
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">Showing {filteredHolidays.length} holiday packages</p>
        </div>

        {/* Holidays Grid */}
        {filteredHolidays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHolidays.map((holiday) => {
              const displayPrice = holiday.salePrice || holiday.adultPrice
              const hasDiscount = holiday.salePrice && holiday.salePrice < holiday.adultPrice
              const discountPercent = hasDiscount
                ? Math.round(((holiday.adultPrice - holiday.salePrice!) / holiday.adultPrice) * 100)
                : 0

              return (
                <Card key={holiday._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <Image
                      src={
                        holiday.featuredImage ||
                        (holiday.imageUrls && holiday.imageUrls[0]) ||
                        "/placeholder.svg?height=200&width=300"
                      }
                      alt={holiday.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                    {hasDiscount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold">
                        {discountPercent}% OFF
                      </Badge>
                    )}
                    {holiday.isTrending && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white">Trending</Badge>
                    )}
                    {holiday.featured && (
                      <Badge className="absolute bottom-2 left-2 bg-yellow-500 text-white">Featured</Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2">{holiday.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{holiday.destinationName}</span>
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3" />
                          <span>
                            {holiday.durationDays}D/{holiday.durationNights}N
                          </span>
                        </div>
                      </div>

                      {holiday.highlights && holiday.highlights.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">Highlights:</p>
                          <div className="flex flex-wrap gap-1">
                            {holiday.highlights.slice(0, 3).map((highlight, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {highlight}
                              </span>
                            ))}
                            {holiday.highlights.length > 3 && (
                              <span className="text-xs text-gray-500">+{holiday.highlights.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {holiday.rating && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{holiday.rating}</span>
                            {holiday.reviews && <span className="text-gray-500">({holiday.reviews})</span>}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {holiday.category}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600">₹{displayPrice.toLocaleString()}</span>
                            {hasDiscount && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{holiday.adultPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">per person</div>
                          {hasDiscount && (
                            <div className="text-xs text-green-600 font-medium">
                              You save ₹{(holiday.adultPrice - holiday.salePrice!).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                          <Link href={`/holidays/${holiday._id}`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No holiday packages found</div>
            <p className="text-sm text-gray-400 mb-4">
              {holidays.length === 0
                ? "Add some trips from the admin panel to get started!"
                : "Try adjusting your search or filters."}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
