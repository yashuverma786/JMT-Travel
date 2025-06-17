"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const nationalDestinations = [
  { id: 1, name: "Andaman", price: 14999, image: "/placeholder.svg?height=300&width=400" },
  { id: 2, name: "Gujarat", price: 14999, image: "/placeholder.svg?height=300&width=400" },
  { id: 3, name: "Rajasthan", price: 6199, image: "/placeholder.svg?height=300&width=400" },
  { id: 4, name: "Himachal", price: 9999, image: "/placeholder.svg?height=300&width=400" },
  { id: 5, name: "Kerala", price: 12999, image: "/placeholder.svg?height=300&width=400" },
  { id: 6, name: "Goa", price: 8999, image: "/placeholder.svg?height=300&width=400" },
]

const internationalDestinations = [
  { id: 7, name: "Dubai", price: 35999, image: "/placeholder.svg?height=300&width=400" },
  { id: 8, name: "Thailand", price: 28999, image: "/placeholder.svg?height=300&width=400" },
  { id: 9, name: "Singapore", price: 42999, image: "/placeholder.svg?height=300&width=400" },
  { id: 10, name: "Maldives", price: 65999, image: "/placeholder.svg?height=300&width=400" },
  { id: 11, name: "Bali", price: 32999, image: "/placeholder.svg?height=300&width=400" },
  { id: 12, name: "Europe", price: 89999, image: "/placeholder.svg?height=300&width=400" },
]

export default function PopularDestinationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("domestic")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  const destinations = activeTab === "domestic" ? nationalDestinations : internationalDestinations
  const itemsPerView = 4
  const maxIndex = Math.max(0, destinations.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    setIsClient(true)
    setCurrentIndex(0)
  }, [activeTab])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Parallax background elements - only render on client */}
      {isClient && (
        <div
          className="absolute inset-0 opacity-5"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Handpicked Holiday Packages</h2>
          <p className="text-gray-600 mb-8">Indulge in unforgettable adventure with special tour plans.</p>

          <Tabs defaultValue="domestic" className="w-fit mx-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="domestic" className="px-8">
                Domestic
              </TabsTrigger>
              <TabsTrigger value="international" className="px-8">
                International
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {destinations.map((destination) => (
                <div key={destination.id} className="w-1/4 flex-shrink-0 px-3">
                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Floating elements on hover */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                          {destination.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">From</span>
                            <div className="text-2xl font-bold">₹ {destination.price.toLocaleString()}</div>
                          </div>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 group-hover:bg-orange-500 transition-all duration-300"
                            asChild
                          >
                            <Link href={`/destinations/${destination.name.toLowerCase()}`}>
                              Explore
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
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
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
