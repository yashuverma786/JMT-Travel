"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Star,
  TrendingUp,
  Plane,
  Camera,
  Mountain,
  Waves,
  TreePine,
  Building,
  Loader2,
  RefreshCw,
} from "lucide-react"

interface Destination {
  _id: string
  name: string
  country: string
  description: string
  imageUrl: string
  type: string
  popular: boolean
  trending: boolean
  createdAt: string
  updatedAt: string
}

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
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchDestinations = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      })

      if (filterCategory !== "all") params.append("type", filterCategory)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/destinations?${params}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDestinations(data.destinations || [])
          setTotalPages(data.pagination?.pages || 1)
        } else {
          console.error("API returned error:", data.error)
          setDestinations([])
        }
      } else {
        console.error("Failed to fetch destinations:", response.status)
        setDestinations([])
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
      setDestinations([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDestinations()
  }, [currentPage, filterCategory, searchTerm])

  // Filter and sort destinations locally
  let filteredDestinations = [...destinations]

  if (showTrendingOnly) {
    filteredDestinations = filteredDestinations.filter((destination) => destination.trending)
  }

  // Sort destinations
  filteredDestinations.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "country":
        return a.country.localeCompare(b.country)
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        // popularity - trending and popular first
        if (a.trending && !b.trending) return -1
        if (!a.trending && b.trending) return 1
        if (a.popular && !b.popular) return -1
        if (!a.popular && b.popular) return 1
        return a.name.localeCompare(b.name)
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchDestinations()
  }

  const handleRefresh = () => {
    fetchDestinations(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
          <div className="container px-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <MapPin className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
              Discover incredible destinations across India with our curated travel packages
            </p>
          </div>
        </section>

        <div className="container px-6 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="text-lg">Loading destinations...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="container px-6 text-center">
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
            <Badge className="bg-white/20 text-white border-white/30">Best Prices Guaranteed</Badge>
          </div>
        </div>
      </section>

      <div className="container px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
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
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>

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

            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
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
        {filteredDestinations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination) => (
                <Card key={destination._id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <Image
                      src={destination.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={destination.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Trending Badge */}
                    {destination.trending && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}

                    {/* Popular Badge */}
                    {destination.popular && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}

                    {/* Destination Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{destination.name}</h3>
                      <div className="flex items-center gap-1 text-sm mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{destination.country}</span>
                      </div>
                      {destination.description && (
                        <p className="text-sm opacity-90 line-clamp-2">{destination.description}</p>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {destination.type || "Destination"}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          Added {new Date(destination.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Camera className="h-3 w-3 mr-1" />
                            Explore
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/trips?destination=${destination.name}`}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
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
            <div className="text-gray-500 mb-4">
              {destinations.length === 0
                ? "No destinations found. Add some destinations from the admin panel!"
                : "No destinations found matching your criteria"}
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterCategory("all")
                  setShowTrendingOnly(false)
                  setCurrentPage(1)
                }}
              >
                Clear Filters
              </Button>
              <Button variant="outline" onClick={handleRefresh}>
                Refresh Data
              </Button>
            </div>
          </div>
        )}

        {/* Popular Categories */}
        {destinations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(1).map((category) => {
                const count = destinations.filter((d) => d.type?.toLowerCase() === category.value).length
                return (
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
                      <p className="text-sm text-gray-600 mt-1">{count} destinations</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

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
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Talk to Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
