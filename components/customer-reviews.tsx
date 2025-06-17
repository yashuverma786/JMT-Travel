"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Quote, ThumbsUp, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

const reviews = [
  {
    id: 1,
    name: "Arjun Mehta",
    location: "Mumbai",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    date: "2 weeks ago",
    package: "Goa Beach Holiday",
    review:
      "Absolutely fantastic experience! The hotel was amazing, food was delicious, and the beach activities were so much fun. JMT Travel made everything seamless.",
    likes: 24,
    helpful: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    date: "1 month ago",
    package: "Kerala Backwaters",
    review:
      "The houseboat experience was magical! Waking up to the serene backwaters and enjoying traditional Kerala cuisine was unforgettable. Highly recommended!",
    likes: 31,
    helpful: true,
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    location: "Bangalore",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 4,
    date: "3 weeks ago",
    package: "Rajasthan Royal Tour",
    review:
      "Great cultural experience! The palaces were breathtaking and the desert safari was thrilling. Only minor issue was the long travel times between cities.",
    likes: 18,
    helpful: true,
  },
  {
    id: 4,
    name: "Sneha Patel",
    location: "Ahmedabad",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    date: "1 week ago",
    package: "Himachal Adventure",
    review:
      "Perfect for adventure lovers! Paragliding in Manali was the highlight. The mountain views were spectacular and the weather was perfect.",
    likes: 27,
    helpful: true,
  },
]

export default function CustomerReviews() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              💬 What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real reviews from real travelers who have experienced our amazing packages
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Image
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        width={60}
                        height={60}
                        className="rounded-full border-2 border-blue-200"
                      />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Quote className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{review.name}</h4>
                          <p className="text-sm text-gray-600">{review.location}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {review.package}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">"{review.review}"</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                        {review.helpful && (
                          <span className="text-xs text-green-600 font-medium">✓ Verified Review</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium">
            <a href="#reviews">Read All Reviews</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
