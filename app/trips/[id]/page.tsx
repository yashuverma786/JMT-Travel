"use client"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Phone,
  Download,
  ArrowLeft,
  Star,
  CheckCircle,
  XCircle,
  Share2,
} from "lucide-react"
import { useState, useEffect } from "react"
import jsPDF from "jspdf"

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTrip(data.trip)
        } else {
          notFound()
        }
      } catch (error) {
        console.error("Failed to fetch trip:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!trip) {
    notFound()
  }

  const hasDiscount = trip.salePrice && trip.salePrice > 0 && trip.salePrice < trip.normalPrice
  const displayPrice = hasDiscount ? trip.salePrice : trip.normalPrice
  const discountPercentage = hasDiscount
    ? Math.round(((trip.normalPrice - trip.salePrice) / trip.normalPrice) * 100)
    : 0

  const handleCallNow = () => {
    window.open("tel:9312540202", "_self")
  }

  const handleDownloadBrochure = async () => {
    const doc = new jsPDF("p", "pt", "a4")
    const margin = 40
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const contentWidth = pageWidth - margin * 2
    let y = margin

    // Helper to add text and manage y position
    const addText = (text: string, options: any, isTitle = false) => {
      if (y + (options.fontSize || 10) > pageHeight - margin) {
        doc.addPage()
        y = margin
        if (isTitle) addHeader()
      }
      const splitText = doc.splitTextToSize(text, contentWidth)
      doc.setFont(options.font || "helvetica", options.fontStyle || "normal")
      doc.setFontSize(options.fontSize || 10)
      doc.setTextColor(options.color || "#000000")
      doc.text(splitText, margin, y)
      y += doc.getTextDimensions(splitText).h + (options.spacing || 10)
    }

    // Helper to add header on each page
    const addHeader = () => {
      doc.setFontSize(10)
      doc.setTextColor("#888888")
      doc.text("JMT Travel - Your Adventure Awaits", margin, 20)
      doc.line(margin, 25, pageWidth - margin, 25)
    }

    // --- PDF Content ---
    addHeader()
    y = 60 // Reset y after header

    // Title
    addText(trip.title, { fontSize: 24, fontStyle: "bold", spacing: 20 }, true)

    // Main Image
    if (trip.imageUrls?.[0]) {
      try {
        const response = await fetch(trip.imageUrls[0])
        const blob = await response.blob()
        const reader = new FileReader()
        await new Promise((resolve, reject) => {
          reader.onload = resolve
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        const imgData = reader.result as string
        if (y + 150 > pageHeight - margin) {
          doc.addPage()
          y = margin
          addHeader()
        }
        doc.addImage(imgData, "JPEG", margin, y, contentWidth, 150)
        y += 160
      } catch (e) {
        console.error("Error adding image to PDF", e)
      }
    }

    // Overview
    addText("Overview", { fontSize: 16, fontStyle: "bold", spacing: 15 }, true)
    addText(trip.overview, { fontSize: 10, color: "#333333" })

    // Itinerary
    if (trip.itinerary?.length > 0) {
      addText("Day-wise Itinerary", { fontSize: 16, fontStyle: "bold", spacing: 15 }, true)
      trip.itinerary.forEach((day: any) => {
        addText(`Day ${day.day}: ${day.title}`, { fontSize: 12, fontStyle: "bold", spacing: 8 })
        addText(day.description, { fontSize: 10, color: "#333333" })
      })
    }

    // Inclusions & Exclusions
    if (trip.inclusions?.length > 0) {
      addText("Inclusions", { fontSize: 16, fontStyle: "bold", spacing: 15 }, true)
      trip.inclusions.forEach((item: string) => addText(`• ${item}`, { fontSize: 10, color: "#333333", spacing: 5 }))
      y += 10
    }
    if (trip.exclusions?.length > 0) {
      addText("Exclusions", { fontSize: 16, fontStyle: "bold", spacing: 15 }, true)
      trip.exclusions.forEach((item: string) => addText(`• ${item}`, { fontSize: 10, color: "#333333", spacing: 5 }))
      y += 10
    }

    // Footer with contact info and link
    const finalY = pageHeight - margin - 20
    doc.line(margin, finalY - 10, pageWidth - margin, finalY - 10)
    doc.setFontSize(10)
    doc.setTextColor("#0000FF")
    doc.textWithLink("Book this trip online", margin, finalY, { url: window.location.href })
    doc.setTextColor("#333333")
    doc.text("Contact us: 9312540202", pageWidth - margin, finalY, { align: "right" })

    doc.save(`${trip.title.replace(/ /g, "_")}_Brochure.pdf`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: trip.overview,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={trip.imageUrls?.[0] || "/placeholder.svg?height=400&width=800&query=travel+destination"}
          alt={trip.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{trip.title}</h1>
            <div className="flex items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{trip.destinationName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{trip.durationDays} Days</span>
              </div>
              {trip.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>{trip.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Trip Overview
                  <div className="flex gap-2">
                    {trip.category && <Badge className="bg-blue-600">{trip.category}</Badge>}
                    {hasDiscount && <Badge className="bg-red-500">{discountPercentage}% OFF</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{trip.overview}</p>
              </CardContent>
            </Card>

            {/* Inclusions & Exclusions */}
            {(trip.inclusions?.length > 0 || trip.exclusions?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trip.inclusions?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {trip.inclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {trip.exclusions?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">What's Not Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {trip.exclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Itinerary */}
            {trip.itinerary?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Day-wise Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trip.itinerary.map((day: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {day.day}
                          </div>
                          <h3 className="text-lg font-semibold">{day.title}</h3>
                        </div>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book This Trip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {hasDiscount && (
                      <span className="text-lg text-gray-500 line-through">₹{trip.normalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-bold text-blue-600">₹{displayPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">per person</p>
                  {hasDiscount && <Badge className="bg-red-500 text-white mt-2">Save {discountPercentage}%</Badge>}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{trip.durationDays} Days</p>
                    </div>
                  </div>
                  {trip.groupSize && (
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Group Size</p>
                        <p className="text-sm text-gray-600">{trip.groupSize}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{trip.destinationName}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleCallNow}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now - 9312540202
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadBrochure}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure (PDF)
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Trip
                  </Button>
                </div>

                <div className="text-center pt-4 border-t">
                  <p className="text-xs text-gray-500">Call us for instant booking and best deals!</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trip.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <Badge variant="outline" className="capitalize">
                      {trip.difficulty}
                    </Badge>
                  </div>
                )}
                {trip.category && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <Badge variant="outline" className="capitalize">
                      {trip.category}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className="bg-green-500">Available</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
