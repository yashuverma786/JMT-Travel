"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Clock, MapPin, Users, TrendingUp, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const packageCategories = {
  popular: {
    title: "Most Popular",
    icon: <TrendingUp className="h-4 w-4" />,
    route: "/trip-types/popular",
    packages: [
      {
        id: 1,
        title: "Goa Beach Holiday",
        destination: "Goa",
        image: "/placeholder.svg?height=200&width=300&text=Goa+Beach",
        duration: "4 Days / 3 Nights",
        price: 12999,
        originalPrice: 15999,
        rating: 4.5,
        reviews: 245,
        discount: 19,
        category: "Beach",
        includes: ["Hotel", "Meals", "Transfers"],
        country: "goa",
      },
      {
        id: 2,
        title: "Kerala Backwaters",
        destination: "Kerala",
        image: "/placeholder.svg?height=200&width=300&text=Kerala+Backwaters",
        duration: "5 Days / 4 Nights",
        price: 18999,
        originalPrice: 22999,
        rating: 4.7,
        reviews: 189,
        discount: 17,
        category: "Nature",
        includes: ["Houseboat", "Meals", "Sightseeing"],
        country: "kerala",
      },
      {
        id: 3,
        title: "Rajasthan Royal Tour",
        destination: "Rajasthan",
        image: "/placeholder.svg?height=200&width=300&text=Rajasthan+Royal",
        duration: "6 Days / 5 Nights",
        price: 24999,
        originalPrice: 29999,
        rating: 4.6,
        reviews: 312,
        discount: 17,
        category: "Heritage",
        includes: ["Palace Hotels", "Meals", "Guide"],
        country: "rajasthan",
      },
      {
        id: 4,
        title: "Himachal Adventure",
        destination: "Himachal Pradesh",
        image: "/placeholder.svg?height=200&width=300&text=Himachal+Adventure",
        duration: "7 Days / 6 Nights",
        price: 21999,
        originalPrice: 26999,
        rating: 4.4,
        reviews: 178,
        discount: 19,
        category: "Adventure",
        includes: ["Hotel", "Adventure", "Meals"],
        country: "himachal-pradesh",
      },
    ],
  },
  trending: {
    title: "Trending Now",
    icon: <Sparkles className="h-4 w-4" />,
    route: "/trip-types/trending",
    packages: [
      {
        id: 15,
        title: "Leh Ladakh Adventure",
        destination: "Ladakh",
        image: "/placeholder.svg?height=200&width=300&text=Leh+Ladakh",
        duration: "8 Days / 7 Nights",
        price: 35999,
        originalPrice: 42999,
        rating: 4.8,
        reviews: 189,
        discount: 16,
        category: "Adventure",
        includes: ["Hotel", "Transport", "Permits"],
        country: "ladakh",
      },
      {
        id: 7,
        title: "Andaman Islands Paradise",
        destination: "Andaman",
        image: "/placeholder.svg?height=200&width=300&text=Andaman+Islands",
        duration: "6 Days / 5 Nights",
        price: 28999,
        originalPrice: 34999,
        rating: 4.6,
        reviews: 234,
        discount: 17,
        category: "Beach",
        includes: ["Hotel", "Meals", "Activities"],
        country: "andaman",
      },
      {
        id: 10,
        title: "Spiti Valley Expedition",
        destination: "Spiti Valley",
        image: "/placeholder.svg?height=200&width=300&text=Spiti+Valley",
        duration: "9 Days / 8 Nights",
        price: 32999,
        originalPrice: 38999,
        rating: 4.7,
        reviews: 156,
        discount: 15,
        category: "Adventure",
        includes: ["Camping", "Meals", "Guide"],
        country: "himachal-pradesh",
      },
      {
        id: 6,
        title: "Kashmir Paradise",
        destination: "Kashmir",
        image: "/placeholder.svg?height=200&width=300&text=Kashmir+Paradise",
        duration: "6 Days / 5 Nights",
        price: 28999,
        originalPrice: 34999,
        rating: 4.8,
        reviews: 156,
        discount: 17,
        category: "Hill Station",
        includes: ["Houseboat", "Hotels", "Shikara"],
        country: "kashmir",
      },
    ],
  },
  budget: {
    title: "Budget Friendly",
    icon: <Users className="h-4 w-4" />,
    route: "/trip-types/budget",
    packages: [
      {
        id: 8,
        title: "Rishikesh Yoga Retreat",
        destination: "Rishikesh",
        image: "/placeholder.svg?height=200&width=300&text=Rishikesh+Yoga",
        duration: "4 Days / 3 Nights",
        price: 8999,
        originalPrice: 11999,
        rating: 4.4,
        reviews: 167,
        discount: 25,
        category: "Spiritual",
        includes: ["Ashram", "Yoga", "Meals"],
        country: "uttarakhand",
      },
      {
        id: 9,
        title: "Coorg Coffee Plantation",
        destination: "Coorg",
        image: "/placeholder.svg?height=200&width=300&text=Coorg+Coffee",
        duration: "3 Days / 2 Nights",
        price: 9999,
        originalPrice: 12999,
        rating: 4.3,
        reviews: 198,
        discount: 23,
        category: "Nature",
        includes: ["Homestay", "Meals", "Plantation Tour"],
        country: "karnataka",
      },
      {
        id: 11,
        title: "Pushkar Desert Experience",
        destination: "Pushkar",
        image: "/placeholder.svg?height=200&width=300&text=Pushkar+Desert",
        duration: "3 Days / 2 Nights",
        price: 7999,
        originalPrice: 9999,
        rating: 4.2,
        reviews: 145,
        discount: 20,
        category: "Cultural",
        includes: ["Desert Camp", "Camel Safari", "Meals"],
        country: "rajasthan",
      },
      {
        id: 12,
        title: "Darjeeling Tea Gardens",
        destination: "Darjeeling",
        image: "/placeholder.svg?height=200&width=300&text=Darjeeling+Tea",
        duration: "4 Days / 3 Nights",
        price: 11999,
        originalPrice: 14999,
        rating: 4.5,
        reviews: 223,
        discount: 20,
        category: "Hill Station",
        includes: ["Hotel", "Toy Train", "Tea Garden Tour"],
        country: "west-bengal",
      },
    ],
  },
}

export default function InteractiveHolidayPackages() {
  const [activeTab, setActiveTab] = useState("popular")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pick Your <span className="text-blue-600">Perfect Plan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated categories to find the perfect trip that matches your style and budget
            </p>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-sm">
            {Object.entries(packageCategories).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {category.icon}
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(packageCategories).map(([key, category]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.packages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group h-full">
                      <div className="relative">
                        <Image
                          src={pkg.image || "/placeholder.svg"}
                          alt={pkg.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {pkg.discount > 0 && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white">{pkg.discount}% OFF</Badge>
                        )}
                        <Badge className="absolute top-2 right-2 bg-blue-500 text-white">{pkg.category}</Badge>
                      </div>

                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="space-y-3 flex-grow">
                          <div>
                            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {pkg.title}
                            </h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{pkg.destination}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span>{pkg.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{pkg.rating}</span>
                              <span className="text-gray-500">({pkg.reviews})</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {pkg.includes.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">₹{pkg.price.toLocaleString()}</span>
                              {pkg.originalPrice > pkg.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{pkg.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">per person</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/destinations/${pkg.country}`}>View All</Link>
                            </Button>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                              <Link href={`/holidays/${pkg.id}`}>Book Now</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* View All Button for Each Category */}
              <div className="text-center mt-8">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium">
                  <Link href={category.route}>View All {category.title} Trips</Link>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
