"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const blogPosts = [
  {
    id: 1,
    title: "Ayodhya Tour Package: Divinity Meets Devotion",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 25, 2023",
    url: "/packages/ayodhya-tour",
  },
  {
    id: 2,
    title: "Scenic Beauty of Shimla, Kullu & Manali with JMT Travel",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 2, 2023",
    url: "/packages/shimla-kullu-manali",
  },
  {
    id: 3,
    title: "Shimla Manali Tour Package for 10 Days - The Complete Travel Experience",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 5, 2023",
    url: "/packages/shimla-manali-10-days",
  },
]

export default function TravelBlogs() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Travel Trips & Blogs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest travel packages and read about amazing destinations
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={item}
              onMouseEnter={() => setHoveredItem(post.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={post.url} className="block">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${hoveredItem === post.id ? "scale-110" : "scale-100"}`}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>JMT Travel</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full font-medium">
            <Link href="/packages">Explore All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
