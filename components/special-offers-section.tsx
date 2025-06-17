"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const specialOffers = [
  {
    id: 1,
    title: "Early Bird Special: Goa Beach Paradise",
    destination: "Goa",
    image: "/placeholder.svg?height=300&width=400",
    duration: "4 Days / 3 Nights",
    originalPrice: 15999,
    discountedPrice: 11999,
    discount: 25,
    rating: 4.6,
    reviews: 189,
    validUntil: "Limited Time",
    features: ["Beach Resort", "All Meals", "Airport Transfer"],
  },
  {
    id: 2,
    title: "Monsoon Magic: Kerala Backwaters",
    destination: "Kerala",
    image: "/placeholder.svg?height=300&width=400",
    duration: "5 Days / 4 Nights",
    originalPrice: 22999,
    discountedPrice: 17999,
    discount: 22,
    rating: 4.8,
    reviews: 156,
    validUntil: "This Month Only",
    features: ["Houseboat Stay", "Traditional Meals", "Ayurvedic Spa"],
  },
  {
    id: 3,
    title: "Royal Rajasthan Heritage Tour",
    destination: "Rajasthan",
    image: "/placeholder.svg?height=300&width=400",
    duration: "6 Days / 5 Nights",
    originalPrice: 29999,
    discountedPrice: 23999,
    discount: 20,
    rating: 4.7,
    reviews: 203,
    validUntil: "Book by Month End",
    features: ["Palace Hotels", "Cultural Shows", "Desert Safari"],
  },
]

export default function SpecialOffersSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              🔥 <span className="text-red-600">Special Offers</span> & Deals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Limited time offers on our most popular destinations. Book now and save big!
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specialOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 text-white animate-pulse">{offer.discount}% OFF</Badge>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="outline" className="bg-white/90 text-gray-700">
                    {offer.validUntil}
                  </Badge>
                </div>

                <div className="relative overflow-hidden">
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2 group-hover:text-red-600 transition-colors">
                        {offer.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{offer.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{offer.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{offer.rating}</span>
                          <span className="text-gray-500">({offer.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {offer.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">
                            ₹{offer.originalPrice.toLocaleString()}
                          </span>
                          <span className="text-2xl font-bold text-red-600">
                            ₹{offer.discountedPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">per person</span>
                      </div>
                      <Button
                        className="bg-red-500 hover:bg-red-600 group-hover:scale-105 transition-all duration-300"
                        asChild
                      >
                        <Link href={`/offers/${offer.id}`}>
                          Book Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium">
            <Link href="/offers">View All Special Offers</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
