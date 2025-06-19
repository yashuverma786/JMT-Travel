"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const trendingDestinations = [
  {
    id: 1,
    name: "Ladakh",
    country: "ladakh",
    image: "/placeholder.svg?height=400&width=300",
    packages: 28,
    trending: "+45%",
    description: "High altitude desert with stunning landscapes",
    startingPrice: 25999,
    bestTime: "May - September",
  },
  {
    id: 2,
    name: "Andaman Islands",
    country: "andaman",
    image: "/placeholder.svg?height=400&width=300",
    packages: 35,
    trending: "+38%",
    description: "Pristine beaches and crystal clear waters",
    startingPrice: 18999,
    bestTime: "October - May",
  },
  {
    id: 3,
    name: "Spiti Valley",
    country: "himachal-pradesh",
    image: "/placeholder.svg?height=400&width=300",
    packages: 22,
    trending: "+52%",
    description: "Cold desert mountain valley",
    startingPrice: 22999,
    bestTime: "June - October",
  },
  {
    id: 4,
    name: "Coorg",
    country: "karnataka",
    image: "/placeholder.svg?height=400&width=300",
    packages: 31,
    trending: "+29%",
    description: "Coffee plantations and misty hills",
    startingPrice: 12999,
    bestTime: "October - March",
  },
  {
    id: 5,
    name: "Rishikesh",
    country: "uttarakhand",
    image: "/placeholder.svg?height=400&width=300",
    packages: 26,
    trending: "+41%",
    description: "Yoga capital and adventure sports hub",
    startingPrice: 8999,
    bestTime: "September - April",
  },
  {
    id: 6,
    name: "Munnar",
    country: "kerala",
    image: "/placeholder.svg?height=400&width=300",
    packages: 33,
    trending: "+35%",
    description: "Tea gardens and rolling hills",
    startingPrice: 14999,
    bestTime: "September - March",
  },
]

export default function TrendingDestinations() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <TrendingUp className="inline-block mr-2 h-8 w-8 text-green-500" />
              Trending <span className="text-green-600">Destinations</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the hottest travel destinations that everyone is talking about
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="relative">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {destination.trending}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{destination.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{destination.packages} packages</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">₹{destination.startingPrice.toLocaleString()}</div>
                          <div className="text-xs opacity-75">starting from</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Best Time:</div>
                      <div className="font-medium">{destination.bestTime}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="group-hover:bg-green-500 group-hover:text-white transition-colors"
                    >
                      <Link href={`/destinations/${destination.country}`}>
                        Explore
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium">
            <Link href="/destinations">Explore All Destinations</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
