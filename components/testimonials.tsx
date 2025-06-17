"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "Our trip to Goa was absolutely amazing! JMT Travel took care of everything from flights to accommodations. The itinerary was perfect and gave us a great mix of adventure and relaxation. Will definitely book with them again!",
    package: "Goa Beach Holiday",
    date: "December 2023",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, India",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "The Kerala backwater tour exceeded all our expectations. The houseboat experience was magical, and the tour guide was knowledgeable. JMT Travel made our honeymoon truly special.",
    package: "Kerala Backwaters",
    date: "November 2023",
  },
  {
    id: 3,
    name: "Anita Patel",
    location: "Ahmedabad, India",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4,
    text: "Our family vacation to Rajasthan was well-organized and stress-free. The kids loved the camel safari, and we appreciated the balance of guided activities and free time. Great value for money!",
    package: "Rajasthan Royal Tour",
    date: "October 2023",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Bangalore, India",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
    text: "The Himachal adventure trip was pure bliss. From the mountain views to the adventure activities, everything was top-notch. JMT Travel's attention to detail made this trip unforgettable.",
    package: "Himachal Adventure",
    date: "September 2023",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Parallax background elements - only render on client */}
      {isClient && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-2xl"></div>
        </div>
      )}

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">Real experiences from travelers who have explored with us</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <Quote className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>

                          <p className="text-gray-700 text-lg italic mb-4 leading-relaxed">"{testimonial.text}"</p>

                          <div className="space-y-1">
                            <h4 className="font-bold text-lg">{testimonial.name}</h4>
                            <p className="text-gray-600">{testimonial.location}</p>
                            <p className="text-sm text-blue-600 font-medium">Package: {testimonial.package}</p>
                            <p className="text-sm text-gray-500">{testimonial.date}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
