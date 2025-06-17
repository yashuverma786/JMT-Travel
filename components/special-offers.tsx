"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for special offers
const specialOffers = [
  {
    id: 1,
    title: "Summer Special: Bali Retreat",
    image: "/placeholder.svg?height=300&width=600",
    description: "Enjoy 20% off on our most popular Bali packages. Limited time offer!",
    discount: "20% OFF",
    validUntil: "June 30, 2024",
    code: "SUMMER20",
  },
  {
    id: 2,
    title: "Early Bird: European Adventures",
    image: "/placeholder.svg?height=300&width=600",
    description: "Book your European holiday 3 months in advance and get 15% discount.",
    discount: "15% OFF",
    validUntil: "For bookings 90+ days in advance",
    code: "EARLYBIRD15",
  },
  {
    id: 3,
    title: "Honeymoon Package: Maldives",
    image: "/placeholder.svg?height=300&width=600",
    description: "Special honeymoon package with complimentary spa treatments and romantic dinner.",
    discount: "25% OFF",
    validUntil: "December 31, 2024",
    code: "HONEYMOON25",
  },
  {
    id: 4,
    title: "Family Deal: Thailand Adventure",
    image: "/placeholder.svg?height=300&width=600",
    description: "Kids stay and eat free! Perfect for a memorable family vacation.",
    discount: "Family Deal",
    validUntil: "September 30, 2024",
    code: "FAMILYFUN",
  },
]

export default function SpecialOffers() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % specialOffers.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + specialOffers.length) % specialOffers.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      prevSlide()
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isAnimating])

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={sliderRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {specialOffers.map((offer) => (
            <div key={offer.id} className="w-full flex-shrink-0 px-4">
              <Card className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div className="relative">
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    width={600}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-[#ea4335] to-[#f7931e]">
                    {offer.discount}
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>Valid until: {offer.validUntil}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 px-3 py-1 rounded-md">
                      <span className="text-sm font-medium">Code: {offer.code}</span>
                    </div>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#ea4335] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ea4335] transition-all duration-300"
                    >
                      <Link href={`/offers/${offer.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full hover:bg-[#f7931e] hover:text-white transition-colors"
          aria-label="Previous offer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {specialOffers.map((_, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAnimating(true)
              setCurrentIndex(index)
              setTimeout(() => setIsAnimating(false), 500)
            }}
            className={`w-2 h-2 rounded-full p-0 min-w-0 ${
              currentIndex === index ? "bg-gradient-to-r from-[#ea4335] to-[#f7931e] border-0" : "bg-gray-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full hover:bg-[#f7931e] hover:text-white transition-colors"
          aria-label="Next offer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
