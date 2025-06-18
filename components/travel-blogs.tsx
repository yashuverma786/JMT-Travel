"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, User } from "lucide-react"

// Mock blog data (same as in blog page)
const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Rajasthan You Must Visit",
    excerpt: "Discover the lesser-known treasures of Rajasthan beyond the popular tourist destinations.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Priya Sharma",
    publishDate: "2024-01-15",
    readTime: "8 min read",
    category: "Destinations",
  },
  {
    id: 2,
    title: "Best Time to Visit Kerala: A Complete Guide",
    excerpt: "Planning a trip to God's Own Country? Learn about the best seasons, weather patterns.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Rajesh Kumar",
    publishDate: "2024-01-12",
    readTime: "6 min read",
    category: "Travel Tips",
  },
  {
    id: 3,
    title: "Street Food Adventures in Delhi: A Foodie's Paradise",
    excerpt: "Embark on a culinary journey through the bustling streets of Delhi.",
    image: "/placeholder.svg?height=200&width=300",
    author: "Amit Singh",
    publishDate: "2024-01-10",
    readTime: "10 min read",
    category: "Food & Culture",
  },
]

export default function TravelBlogs() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50" aria-labelledby="travel-blog-heading">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2
            id="travel-blog-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent"
          >
            Our Latest Travel Blogs
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our travel guides, tips, and inspiring stories from around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <article key={post.id}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" aria-hidden="true" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="min-h-[36px]">
                    <Link href={`/blog/${post.id}`} className="flex items-center gap-1">
                      Read More <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 text-base min-h-[44px]"
          >
            <Link href="/blog">Read All Blogs</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
