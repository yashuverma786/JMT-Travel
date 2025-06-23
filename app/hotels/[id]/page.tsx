"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MapPin, Phone, Mail, Wifi, ParkingCircle, Utensils, Dumbbell, Check } from "lucide-react"

interface Hotel {
  _id: string
  name: string
  description: string
  address: string
  city: string
  country: string
  contactPhone?: string
  contactEmail?: string
  images: string[]
  amenities: string[]
  starRating?: number
  pricePerNight?: number
}

// Helper to map amenity names to icons
const amenityIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="h-5 w-5 text-blue-500" />,
  parking: <ParkingCircle className="h-5 w-5 text-blue-500" />,
  restaurant: <Utensils className="h-5 w-5 text-blue-500" />,
  gym: <Dumbbell className="h-5 w-5 text-blue-500" />,
  pool: <Check className="h-5 w-5 text-blue-500" />, // Generic check for now
  "air conditioning": <Check className="h-5 w-5 text-blue-500" />,
  spa: <Check className="h-5 w-5 text-blue-500" />,
}

export default function HotelDetailPage() {
  const params = useParams()
  const hotelId = params.id as string
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (hotelId) {
      const fetchHotel = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/hotels/${hotelId}`) // Public API endpoint
          if (!response.ok) {
            if (response.status === 404) notFound()
            throw new Error("Failed to fetch hotel details")
          }
          const data = await response.json()
          setHotel(data.hotel)
          if (data.hotel?.images?.length > 0) {
            setSelectedImage(data.hotel.images[0])
          }
        } catch (error) {
          console.error(error)
          // Potentially redirect to a 404 page or show an error message
        }
        setLoading(false)
      }
      fetchHotel()
    }
  }, [hotelId])

  if (loading) {
    return <div className="container py-10 text-center">Loading hotel details...</div>
  }

  if (!hotel) {
    // This will be caught by Next.js and render the not-found.tsx page
    notFound()
    return null // Keep TypeScript happy
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <section className="bg-gray-800">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative aspect-[16/10] rounded-lg overflow-hidden shadow-lg">
              {selectedImage ? (
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : hotel.images[0] ? (
                <Image
                  src={hotel.images[0] || "/placeholder.svg"}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2 max-h-[400px] md:max-h-none overflow-y-auto">
              {hotel.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedImage === img ? "ring-2 ring-blue-500" : ""}`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${hotel.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <h1 className="text-3xl font-bold">{hotel.name}</h1>
                  {hotel.starRating && (
                    <Badge className="bg-yellow-500 text-white text-lg px-3 py-1 flex items-center gap-1 self-start md:self-center">
                      <Star className="h-5 w-5" /> {hotel.starRating} Stars
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  {hotel.address}, {hotel.city}, {hotel.country}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </CardContent>
            </Card>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {hotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-100 rounded-md">
                        {amenityIcons[amenity.toLowerCase()] || <Check className="h-5 w-5 text-blue-500" />}
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Placeholder for Map Embed - User would add iframe code in admin */}
            <Card>
              <CardHeader>
                <CardTitle>Location Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Map will be displayed here</p>
                  {/* Example: <iframe src="google_maps_embed_url" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hotel.pricePerNight && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-3xl font-bold text-blue-700">₹{hotel.pricePerNight.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                )}
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-3">
                  Check Availability & Book
                </Button>
                <div className="text-sm text-gray-600 space-y-2">
                  {hotel.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span>{hotel.contactPhone}</span>
                    </div>
                  )}
                  {hotel.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span>{hotel.contactEmail}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
