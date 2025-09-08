"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EnhancedTripCard from "@/components/enhanced-trip-card"
import { Search, Filter, RefreshCw, Loader2 } from "lucide-react"

interface Trip {
  _id: string
  title: string
  destinationName: string
  tripType: string
  status: string
  durationDays: number
  durationNights: number
  adultPrice: number
  salePrice: number
  isTrending: boolean
  imageUrl: string
  description: string
  createdAt: string
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [duration, setDuration] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = ["adventure", "beach", "cultural", "nature", "spiritual", "luxury", "family", "honeymoon"]
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-10000", label: "Under ₹10,000" },
    { value: "10000-25000", label: "₹10,000 - ₹25,000" },
    { value: "25000-50000", label: "₹25,000 - ₹50,000" },
    { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
    { value: "100000-999999", label: "Above ₹1,00,000" },
  ]

  const fetchTrips = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      })

      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchTerm) params.append("destination", searchTerm)
      if (duration !== "all") params.append("duration", duration)

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-")
        if (min) params.append("minPrice", min)
        if (max) params.append("maxPrice", max)
      }

      const response = await fetch(`/api/trips?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTrips(data.trips || [])
          setTotalPages(data.pagination?.pages || 1)
        } else {
          console.error("API returned error:", data.error)
          setTrips([])
        }
      } else {
        console.error("Failed to fetch trips:", response.status)
        setTrips([])
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error)
      setTrips([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [currentPage, selectedCategory, priceRange, duration])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchTrips()
  }

  const handleRefresh = () => {
    fetchTrips(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange("all")
    setDuration("all")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Our Trips</h1>
            <p className="text-xl opacity-90">Discover amazing destinations and create unforgettable memories</p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-6xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl"
            >
              <div className="lg:col-span-2">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white text-gray-900"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white text-gray-900">
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

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="bg-white text-gray-900">
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

              <div className="flex gap-2">
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16">
        <div className="container px-6">
          {/* Filter Summary */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-600">{loading ? "Loading..." : `${trips.length} trips found`}</p>
              {(selectedCategory !== "all" || priceRange !== "all" || searchTerm || duration !== "all") && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span className="text-lg">Loading trips...</span>
            </div>
          ) : trips.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {trips.map((trip) => (
                  <EnhancedTripCard key={trip._id} trip={trip} />
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
              <p className="text-xl text-gray-600 mb-6">No trips found matching your criteria.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={clearFilters}>Clear Filters</Button>
                <Button variant="outline" onClick={handleRefresh}>
                  Refresh Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Custom Tour CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 opacity-90">Let us create a custom tour package just for you</p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg" asChild>
            <a href="/customize-tour">Create Custom Package</a>
          </Button>
        </div>
      </section>
    </div>
  )
}
