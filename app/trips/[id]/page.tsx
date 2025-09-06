"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, Users, Star, Calendar, Camera, Download, Phone, Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Trip {
  _id: string
  title: string
  destinationName?: string
  destinationCountry?: string
  durationDays?: number
  durationNights?: number
  featuredImage?: string
  imageUrls?: string[]
  galleryImages?: string[]
  adultPrice?: number
  salePrice?: number
  normalPrice?: number
  rating?: number
  category?: string
  tripType?: string
  overview?: string
  description?: string
  itinerary?: Array<{
    day: number
    title: string
    description: string
    activities?: string[]
    meals?: string[]
    accommodation?: string
  }>
  inclusions?: string[]
  exclusions?: string[]
  highlights?: string[]
  status?: string
  isTrending?: boolean
  maxGroupSize?: number
  minAge?: number
  difficulty?: string
  bestTimeToVisit?: string
  departureCity?: string
  returnCity?: string
}

export default function TripDetailsPage() {
  const params = useParams()
  const { id } = params

  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchTrip = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/trips/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
            return
          }
          throw new Error("Failed to fetch trip")
        }
        const data = await response.json()
        setTrip(data.trip)
      } catch (error) {
        console.error("Error fetching trip:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [id])

  const handleDownloadBrochure = async () => {
    if (!trip) return

    try {
      setDownloadingPDF(true)
      const response = await fetch(`/api/trips/${trip._id}/brochure`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to generate brochure")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${trip.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_brochure.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading brochure:", error)
      alert("Failed to download brochure. Please try again.")
    } finally {
      setDownloadingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trip) {
    return notFound()
  }

  // Safe price handling
  const adultPrice = typeof trip.adultPrice === "number" ? trip.adultPrice : 0
  const salePrice = typeof trip.salePrice === "number" ? trip.salePrice : adultPrice
  const normalPrice = typeof trip.normalPrice === "number" ? trip.normalPrice : adultPrice

  const displayPrice = salePrice > 0 ? salePrice : normalPrice > 0 ? normalPrice : adultPrice
  const originalPrice = adultPrice > salePrice ? adultPrice : normalPrice

  const hasDiscount = originalPrice > displayPrice && displayPrice > 0
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0

  // Safe image handling
  const images = [trip.featuredImage, ...(trip.imageUrls || []), ...(trip.galleryImages || [])].filter(Boolean)

  const mainImage = images[selectedImage] || "/diverse-travelers-world-map.png"

  // Safe duration handling
  const duration = trip.durationDays || 1
  const nights = trip.durationNights || (duration > 0 ? duration - 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/trips" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Trips
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 overflow-hidden rounded-lg">
                <Image src={mainImage || "/placeholder.svg"} alt={trip.title} fill className="object-cover" />
                {trip.isTrending && <Badge className="absolute top-4 left-4 bg-green-500 text-white">Trending</Badge>}
                {hasDiscount && discountPercentage > 0 && (
                  <Badge className="absolute top-4 right-4 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.slice(0, 6).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-blue-500" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                  {images.length > 6 && (
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-sm font-medium">
                      +{images.length - 6}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trip Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {trip.destinationName && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {trip.destinationName}
                      {trip.destinationCountry && `, ${trip.destinationCountry}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {duration} Days / {nights} Nights
                  </span>
                </div>
                {trip.maxGroupSize && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max {trip.maxGroupSize} people</span>
                  </div>
                )}
                {typeof trip.rating === "number" && trip.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{trip.rating}/5</span>
                  </div>
                )}
              </div>

              {trip.highlights && trip.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {trip.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="secondary">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {trip.overview || trip.description || "No overview available for this trip."}
                    </p>
                  </CardContent>
                </Card>

                {trip.highlights && trip.highlights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trip Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {trip.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-4">
                {trip.itinerary && trip.itinerary.length > 0 ? (
                  trip.itinerary.map((day, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Day {day.day}: {day.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-semibold mb-2">Activities:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {day.activities.map((activity, i) => (
                                <li key={i}>{activity}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {day.meals && day.meals.length > 0 && (
                          <div className="mb-3">
                            <h4 className="font-semibold mb-2">Meals:</h4>
                            <div className="flex flex-wrap gap-2">
                              {day.meals.map((meal, i) => (
                                <Badge key={i} variant="outline">
                                  {meal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {day.accommodation && (
                          <div>
                            <h4 className="font-semibold mb-2">Accommodation:</h4>
                            <p className="text-sm text-gray-600">{day.accommodation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">Detailed itinerary will be provided upon booking.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="inclusions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Inclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trip.inclusions && trip.inclusions.length > 0 ? (
                        <ul className="space-y-2">
                          {trip.inclusions.map((inclusion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{inclusion}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Inclusions will be detailed upon inquiry.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Exclusions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trip.exclusions && trip.exclusions.length > 0 ? (
                        <ul className="space-y-2">
                          {trip.exclusions.map((exclusion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{exclusion}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Exclusions will be detailed upon inquiry.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No gallery images available.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  {displayPrice > 0 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && originalPrice > displayPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold text-blue-600">Price on Request</span>
                      <p className="text-sm text-gray-600">Contact us for pricing</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                    Book Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleDownloadBrochure}
                    disabled={downloadingPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingPDF ? "Generating..." : "Download Brochure"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trip Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {duration} Days / {nights} Nights
                  </span>
                </div>
                {trip.maxGroupSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size:</span>
                    <span className="font-medium">Max {trip.maxGroupSize} people</span>
                  </div>
                )}
                {trip.minAge && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Age:</span>
                    <span className="font-medium">{trip.minAge} years</span>
                  </div>
                )}
                {trip.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{trip.difficulty}</span>
                  </div>
                )}
                {trip.bestTimeToVisit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Time:</span>
                    <span className="font-medium">{trip.bestTimeToVisit}</span>
                  </div>
                )}
                {trip.departureCity && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">{trip.departureCity}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">Contact our travel experts for personalized assistance.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us: +91 98765 43210
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Email: info@jmttravel.com
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
