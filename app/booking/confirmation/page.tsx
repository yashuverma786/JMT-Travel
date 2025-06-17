"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ChevronRight, Download, Calendar, Users, CreditCard } from "lucide-react"

// Mock data for packages
const packages = {
  "1": {
    title: "Enchanting Bali Adventure",
    destination: "Bali, Indonesia",
    price: 1299,
    discount: 15,
  },
  "2": {
    title: "Magical Switzerland Tour",
    destination: "Zurich, Switzerland",
    price: 2499,
    discount: 10,
  },
  "3": {
    title: "Serene Maldives Getaway",
    destination: "Malé, Maldives",
    price: 1899,
    discount: 20,
  },
  "4": {
    title: "Historic Rome Expedition",
    destination: "Rome, Italy",
    price: 1599,
    discount: 12,
  },
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("packageId") || "1"
  const date = searchParams.get("date") || ""
  const travelers = searchParams.get("travelers") || "2"

  const [bookingNumber, setBookingNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const packageData = packages[packageId as keyof typeof packages]
  const discountedPrice = packageData.price - (packageData.price * packageData.discount) / 100
  const totalPrice = discountedPrice * Number.parseInt(travelers)

  useEffect(() => {
    // Generate a random booking number
    const randomBooking = "JMT" + Math.floor(100000 + Math.random() * 900000).toString()

    // Simulate loading
    const timer = setTimeout(() => {
      setBookingNumber(randomBooking)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/holidays" className="hover:text-primary">
          Holiday Packages
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Booking Confirmation</span>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-green-800">Booking Confirmed!</h2>
            <p className="text-green-700">
              Your booking has been confirmed. A confirmation email has been sent to your email address.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Booking Reference</div>
              <div className="text-lg font-semibold">{bookingNumber}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Package</div>
              <div className="text-lg font-semibold">{packageData.title}</div>
              <div>{packageData.destination}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Departure Date</div>
                  <div>{date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Travelers</div>
                  <div>
                    {travelers} {Number.parseInt(travelers) === 1 ? "Person" : "People"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Payment Status</div>
                  <div>Paid</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Package Price</span>
                <span>
                  ${discountedPrice} x {travelers}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Taxes & Fees</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto" asChild>
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Itinerary
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
