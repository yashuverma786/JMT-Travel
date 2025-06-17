"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

// Mock data for popular destinations
const destinations = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    image: "/placeholder.svg?height=300&width=400",
    packages: 45,
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    image: "/placeholder.svg?height=300&width=400",
    packages: 38,
  },
  {
    id: 3,
    name: "Santorini",
    country: "Greece",
    image: "/placeholder.svg?height=300&width=400",
    packages: 29,
  },
  {
    id: 4,
    name: "Tokyo",
    country: "Japan",
    image: "/placeholder.svg?height=300&width=400",
    packages: 42,
  },
  {
    id: 5,
    name: "New York",
    country: "USA",
    image: "/placeholder.svg?height=300&width=400",
    packages: 51,
  },
  {
    id: 6,
    name: "Dubai",
    country: "UAE",
    image: "/placeholder.svg?height=300&width=400",
    packages: 33,
  },
]

export default function PopularDestinations() {
  const [visible, setVisible] = useState<boolean[]>(Array(destinations.length).fill(false))

  useEffect(() => {
    const timer = setTimeout(() => {
      destinations.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, index * 150)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {destinations.map((destination, index) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.id}`}
          className={`transition-all duration-700 transform ${
            visible[index] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Card className="overflow-hidden transition-all hover:shadow-lg h-full group">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <Image
                src={destination.image || "/placeholder.svg"}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white transform group-hover:translate-y-[-8px] transition-transform duration-300">
                <h3 className="text-lg sm:text-xl font-bold">{destination.name}</h3>
                <p className="text-xs sm:text-sm opacity-90">{destination.country}</p>
              </div>
            </div>
            <CardContent className="p-3 sm:p-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{destination.packages} holiday packages available</p>
              <ArrowRight className="h-4 w-4 text-[#f7931e] transform group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
