"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, TrendingUp, Phone, Mail, Clock, Award, Shield, Heart, Mountain } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SearchForm from "@/components/search-form"
import PopupManager from "@/components/popup-manager"
import CustomerReviews from "@/components/customer-reviews"
import Partners from "@/components/partners"

interface Destination {
  _id: string
  name: string
  country: string
  imageUrl: string
  popular: boolean
  trending: boolean
  type: string
}

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
}

interface TripType {
  _id: string
  name: string
  description: string
  iconUrl: string
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripTypes, setTripTypes] = useState<TripType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)

      const [destinationsRes, tripsRes, tripTypesRes] = await Promise.all([
        fetch("/api/destinations"),
        fetch("/api/trips?limit=8"),
        fetch("/api/trip-types"),
      ])

      const [destinationsData, tripsData, tripTypesData] = await Promise.all([
        destinationsRes.json(),
        tripsRes.json(),
        tripTypesRes.json(),
      ])

      setDestinations(destinationsData.destinations || [])
      setTrips(tripsData.trips || [])
      setTripTypes(tripTypesData.tripTypes || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const popularDestinations = destinations.filter((d) => d.popular).slice(0, 6)
  const trendingTrips = trips.filter((t) => t.isTrending).slice(0, 4)
  const featuredTrips = trips.slice(0, 8)

  return (
    <div className="min-h-screen">
      <PopupManager />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <Image
          src="/diverse-travel-destinations.png"
          alt="Travel destinations"
          fill
          className="object-cover mix-blend-overlay opacity-50"
          priority
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 animate-fade-in">
            Discover Your Next
            <span className="block text-yellow-400">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Explore incredible destinations with our expertly crafted travel packages
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Award Winning Service
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              100% Safe & Secure
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              10,000+ Happy Customers
            </Badge>
          </div>

          <SearchForm />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{destinations.length}+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{trips.length}+</div>
              <div className="text-gray-600">Tour Packages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Types */}
      {tripTypes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Adventure</h2>
              <p className="text-xl text-gray-600">Find the perfect trip type for your next journey</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tripTypes.slice(0, 8).map((type) => (
                <Link key={type._id} href={`/trip-types/${type.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 group-hover:scale-110 transition-transform">
                        {type.iconUrl ? (
                          <Image
                            src={type.iconUrl || "/placeholder.svg"}
                            alt={type.name}
                            width={48}
                            height={48}
                            className="mx-auto"
                          />
                        ) : (
                          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                            <Mountain className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/trip-types">View All Trip Types</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      {popularDestinations.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Popular Destinations</h2>
              <p className="text-xl text-gray-600">Discover the most loved travel destinations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularDestinations.map((destination) => (
                <Link
                  key={destination._id}
                  href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-64">
                      <Image
                        src={destination.imageUrl || "/placeholder.svg?height=300&width=400"}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {destination.trending && (
                        <Badge className="absolute top-4 left-4 bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}

                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {destination.country}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/destinations">Explore All Destinations</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Trips */}
      {featuredTrips.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Featured Packages</h2>
              <p className="text-xl text-gray-600">Handpicked travel packages for unforgettable experiences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTrips.map((trip) => (
                <Link key={trip._id} href={`/trips/${trip._id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-48">
                      <Image
                        src={trip.images?.[0] || "/placeholder.svg?height=200&width=300"}
                        alt={trip.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {trip.isTrending && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{trip.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {trip.destinationName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {trip.durationDays}D/{trip.durationNights}N
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-green-600">₹{trip.salePrice?.toLocaleString()}</span>
                          {trip.adultPrice > trip.salePrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{trip.adultPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline">{trip.tripType}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link href="/trips">View All Packages</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose JMT Travel?</h2>
            <p className="text-xl text-gray-600">Your trusted partner for memorable journeys</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Planning</h3>
              <p className="text-gray-600">15+ years of experience in crafting perfect travel experiences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">100% secure bookings with comprehensive travel insurance</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for a hassle-free experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Partners */}
      <Partners />

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Get in touch with our travel experts today</p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>info@jmttravel.com</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/custom-packages">Plan Custom Trip</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading latest data...</p>
          </div>
        </div>
      )}
    </div>
  )
}
