"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, SearchIcon, BedDouble } from "lucide-react"

interface Hotel {
  _id: string
  name: string
  location: string
  images: string[]
  pricePerNight: number
  amenities: string[]
  description: string
  status: string
}

export default function HotelsListingPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
  })

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/hotels")
        if (response.ok) {
          const data = await response.json()
          setHotels(data.hotels.filter((hotel: any) => hotel.status === "approved"))
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error)
      }
      setLoading(false)
    }
    fetchHotels()
  }, [])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filteredHotels = hotels.filter((hotel) => {
    return (
      (hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.location ? hotel.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
      (filters.minPrice ? hotel.pricePerNight >= Number.parseFloat(filters.minPrice) : true) &&
      (filters.maxPrice ? hotel.pricePerNight <= Number.parseFloat(filters.maxPrice) : true)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container text-center">
          <BedDouble className="mx-auto h-12 w-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Stay</h1>
          <p className="text-xl mt-2 opacity-90">Explore a wide range of hotels at the best prices.</p>
        </div>
      </section>

      <section className="container py-8">
        <Card className="mb-8 p-4 md:p-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="searchTerm" className="text-sm font-medium">
                Search Hotel or Location
              </Label>
              <div className="relative mt-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="searchTerm"
                  placeholder="e.g., Taj Mahal Palace, Mumbai"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="locationFilter" className="text-sm font-medium">
                Filter by Location
              </Label>
              <Input
                id="locationFilter"
                name="location"
                placeholder="Enter location"
                value={filters.location}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="minPrice" className="text-sm font-medium">
                Min Price (₹)
              </Label>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm font-medium">
                Max Price (₹)
              </Label>
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="Any"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-10">Loading hotels...</div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No hotels found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <Link href={`/hotels/${hotel._id}`} className="block">
                  <div className="relative h-56 w-full">
                    <Image
                      src={hotel.images[0] || "/placeholder.svg?text=Hotel+Image"}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.location}
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-blue-700">
                        ₹{hotel.pricePerNight.toLocaleString()}
                        <span className="text-xs text-gray-500 font-normal"> / night</span>
                      </div>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
