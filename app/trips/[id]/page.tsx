"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Users, Star, Download, Check, X, Phone, Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Trip {
  _id: string
  title: string
  destinationName?: string
  destinationId?: string
  durationDays?: number
  durationNights?: number
  minPax?: number
  maxPax?: number
  adultPrice?: number
  salePrice?: number
  childPrice?: number
  description?: string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: Array<{
    day: number
    title: string
    description: string
  }>
  featuredImage?: string
  galleryImages?: string[]
  imageUrls?: string[]
  tripType?: string
  status?: string
  isTrending?: boolean
  rating?: number
  createdAt?: string
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
          }
          throw new Error("Failed to fetch trip")
        }
        const data = await response.json()
        setTrip(data.trip || data)
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

    setDownloadingPDF(true)
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      // Add JMT Travel logo and header
      doc.setFontSize(24)
      doc.setTextColor(41, 128, 185)
      doc.text("JMT TRAVEL", 20, 30)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Your Journey, Our Passion", 20, 40)

      // Add trip title
      doc.setFontSize(18)
      doc.setTextColor(0, 0, 0)
      const title = trip.title || "Trip Details"
      doc.text(title, 20, 60)

      // Add trip details
      let yPosition = 80

      if (trip.destinationName) {
        doc.setFontSize(12)
        doc.text(`Destination: ${trip.destinationName}`, 20, yPosition)
        yPosition += 10
      }

      if (trip.durationDays) {
        doc.text(
          `Duration: ${trip.durationDays} Days / ${trip.durationNights || trip.durationDays - 1} Nights`,
          20,
          yPosition,
        )
        yPosition += 10
      }

      // Add pricing
      const displayPrice = trip.salePrice || trip.adultPrice
      if (displayPrice && displayPrice > 0) {
        doc.setFontSize(14)
        doc.setTextColor(0, 128, 0)
        doc.text(`Price: ₹${displayPrice.toLocaleString("en-IN")} per person`, 20, yPosition)
        yPosition += 15
      }

      // Add description
      if (trip.description) {
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text("Description:", 20, yPosition)
        yPosition += 10

        const splitDescription = doc.splitTextToSize(trip.description, 170)
        doc.text(splitDescription, 20, yPosition)
        yPosition += splitDescription.length * 5 + 10
      }

      // Add highlights
      if (trip.highlights && trip.highlights.length > 0) {
        doc.text("Highlights:", 20, yPosition)
        yPosition += 10

        trip.highlights.forEach((highlight) => {
          if (highlight.trim()) {
            doc.text(`• ${highlight}`, 25, yPosition)
            yPosition += 7
          }
        })
        yPosition += 5
      }

      // Add inclusions
      if (trip.inclusions && trip.inclusions.length > 0) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.text("Inclusions:", 20, yPosition)
        yPosition += 10

        trip.inclusions.forEach((inclusion) => {
          if (inclusion.trim()) {
            doc.text(`✓ ${inclusion}`, 25, yPosition)
            yPosition += 7
          }
        })
        yPosition += 5
      }

      // Add exclusions
      if (trip.exclusions && trip.exclusions.length > 0) {
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.text("Exclusions:", 20, yPosition)
        yPosition += 10

        trip.exclusions.forEach((exclusion) => {
          if (exclusion.trim()) {
            doc.text(`✗ ${exclusion}`, 25, yPosition)
            yPosition += 7
          }
        })
        yPosition += 5
      }

      // Add itinerary
      if (trip.itinerary && trip.itinerary.length > 0) {
        if (yPosition > 200) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(14)
        doc.text("Itinerary:", 20, yPosition)
        yPosition += 15

        trip.itinerary.forEach((day) => {
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFontSize(12)
          doc.setTextColor(41, 128, 185)
          doc.text(`Day ${day.day}: ${day.title}`, 20, yPosition)
          yPosition += 10

          if (day.description) {
            doc.setTextColor(0, 0, 0)
            const splitDesc = doc.splitTextToSize(day.description, 170)
            doc.text(splitDesc, 25, yPosition)
            yPosition += splitDesc.length * 5 + 10
          }
        })
      }

      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.setTextColor(128, 128, 128)
        doc.text("JMT Travel - Contact: +91-XXXXXXXXXX | Email: info@jmttravel.com", 20, 285)
        doc.text(`Page ${i} of ${pageCount}`, 180, 285)
      }

      // Save the PDF
      const fileName = `${trip.title?.replace(/[^a-zA-Z0-9]/g, "_") || "trip"}_brochure.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating brochure. Please try again.")
    } finally {
      setDownloadingPDF(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
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
  const displayPrice = salePrice > 0 ? salePrice : adultPrice
  const hasDiscount = adultPrice > salePrice && salePrice > 0
  const discountPercentage = hasDiscount ? Math.round(((adultPrice - salePrice) / adultPrice) * 100) : 0

  // Safe image handling
  const allImages = [trip.featuredImage, ...(trip.galleryImages || []), ...(trip.imageUrls || [])].filter(Boolean)

  const images = allImages.length > 0 ? allImages : ["/diverse-travel-destinations.png"]

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={trip.title || "Trip image"}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
              />
              {trip.isTrending && <Badge className="absolute top-4 left-4 bg-green-500 text-white">Trending</Badge>}
              {hasDiscount && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">{discountPercentage}% OFF</Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Trip image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                {trip.destinationName && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.destinationName}</span>
                  </div>
                )}
                {trip.durationDays && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {trip.durationDays} Days / {trip.durationNights || trip.durationDays - 1} Nights
                    </span>
                  </div>
                )}
                {(trip.minPax || trip.maxPax) && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {trip.minPax || 1}-{trip.maxPax || 10} People
                    </span>
                  </div>
                )}
              </div>

              {trip.tripType && (
                <Badge variant="secondary" className="mb-4">
                  {trip.tripType}
                </Badge>
              )}
            </div>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {displayPrice > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-green-600">
                          ₹{displayPrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="text-xl text-gray-500 line-through">
                            ₹{adultPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-blue-600">Price on request</span>
                    )}
                    <p className="text-sm text-gray-600">per person</p>
                    {trip.childPrice && trip.childPrice > 0 && (
                      <p className="text-sm text-gray-600">Child: ₹{trip.childPrice.toLocaleString("en-IN")}</p>
                    )}
                  </div>
                  {typeof trip.rating === "number" && trip.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold">{trip.rating}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    size="lg"
                    onClick={handleDownloadBrochure}
                    disabled={downloadingPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingPDF ? "Generating..." : "Download Brochure"}
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Quick Info</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{trip.durationDays || 1} Days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Group Size:</span>
                    <p className="font-medium">
                      {trip.minPax || 1}-{trip.maxPax || 10} People
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Trip Type:</span>
                    <p className="font-medium">{trip.tripType || "Standard"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Destination:</span>
                    <p className="font-medium">{trip.destinationName || "Multiple"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        {trip.description && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>About This Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{trip.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Highlights */}
        {trip.highlights && trip.highlights.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Trip Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {trip.highlights.map(
                  (highlight, index) =>
                    highlight.trim() && (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ),
                )}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Inclusions & Exclusions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {trip.inclusions && trip.inclusions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Inclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trip.inclusions.map(
                    (inclusion, index) =>
                      inclusion.trim() && (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{inclusion}</span>
                        </li>
                      ),
                  )}
                </ul>
              </CardContent>
            </Card>
          )}

          {trip.exclusions && trip.exclusions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Exclusions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trip.exclusions.map(
                    (exclusion, index) =>
                      exclusion.trim() && (
                        <li key={index} className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{exclusion}</span>
                        </li>
                      ),
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Itinerary */}
        {trip.itinerary && trip.itinerary.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Detailed Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trip.itinerary.map((day, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <h4 className="font-semibold text-lg mb-2">
                      Day {day.day}: {day.title}
                    </h4>
                    {day.description && <p className="text-gray-700 leading-relaxed">{day.description}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact CTA */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Book This Trip?</h3>
            <p className="mb-6 opacity-90">Contact our travel experts for personalized assistance and the best deals</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Phone className="h-4 w-4 mr-2" />
                Call Now: +91-XXXXXXXXXX
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
