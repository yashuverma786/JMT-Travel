"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const activities = [
  {
    id: 1,
    name: "City Tour",
    image: "/placeholder.svg?height=300&width=300",
    trips: 29,
    url: "/activities/city-tour",
  },
  {
    id: 2,
    name: "Cycling",
    image: "/placeholder.svg?height=300&width=300",
    trips: 18,
    url: "/activities/cycling",
  },
  {
    id: 3,
    name: "Hiking",
    image: "/placeholder.svg?height=300&width=300",
    trips: 35,
    url: "/activities/hiking",
  },
  {
    id: 4,
    name: "Jungle Safari",
    image: "/placeholder.svg?height=300&width=300",
    trips: 24,
    url: "/activities/jungle-safari",
  },
  {
    id: 5,
    name: "Peak Climbing",
    image: "/placeholder.svg?height=300&width=300",
    trips: 12,
    url: "/activities/peak-climbing",
  },
  {
    id: 6,
    name: "Rafting",
    image: "/placeholder.svg?height=300&width=300",
    trips: 16,
    url: "/activities/rafting",
  },
]

export default function ActivityGrid() {
  const [isClient, setIsClient] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (!isClient) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pick Your <span className="text-orange-500">Perfect Plan</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of activities and experiences tailored to your adventure style
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              variants={item}
              onMouseEnter={() => setHoveredItem(activity.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative overflow-hidden rounded-lg group"
            >
              <div className="aspect-square relative">
                <Image
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${hoveredItem === activity.id ? "opacity-100" : "opacity-70"}`}
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{activity.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm opacity-90">{activity.trips} Trips</p>
                    <Link href={activity.url} className="flex items-center text-sm font-medium group">
                      <span>View</span>
                      <svg
                        className="h-4 w-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full font-medium">
            <Link href="/activities">Explore All Activities</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
