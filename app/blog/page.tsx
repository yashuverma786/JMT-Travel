import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, User, Search, ArrowRight, Eye, MessageCircle } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travel Blog - Tips, Guides & Stories",
  description:
    "Discover amazing destinations, travel tips, and inspiring stories from fellow travelers. Get expert advice for your next adventure.",
  openGraph: {
    title: "Travel Blog - Tips, Guides & Stories | JMT Travel",
    description: "Discover amazing destinations, travel tips, and inspiring stories from fellow travelers.",
    images: ["/blog-og-image.jpg"],
  },
}

// Mock blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Rajasthan You Must Visit",
    excerpt:
      "Discover the lesser-known treasures of Rajasthan beyond the popular tourist destinations. From secret lakes to ancient temples, explore the mystical side of the desert state.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Priya Sharma",
    publishDate: "2024-01-15",
    readTime: "8 min read",
    category: "Destinations",
    tags: ["Rajasthan", "Hidden Gems", "Travel Tips"],
    views: 1250,
    comments: 23,
    featured: true,
  },
  {
    id: 2,
    title: "Best Time to Visit Kerala: A Complete Guide",
    excerpt:
      "Planning a trip to God's Own Country? Learn about the best seasons, weather patterns, and what to expect during different times of the year in Kerala.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Rajesh Kumar",
    publishDate: "2024-01-12",
    readTime: "6 min read",
    category: "Travel Tips",
    tags: ["Kerala", "Weather", "Planning"],
    views: 980,
    comments: 15,
    featured: false,
  },
  {
    id: 3,
    title: "Street Food Adventures in Delhi: A Foodie's Paradise",
    excerpt:
      "Embark on a culinary journey through the bustling streets of Delhi. From spicy chaat to sweet jalebis, discover the flavors that make Delhi a food lover's dream.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Amit Singh",
    publishDate: "2024-01-10",
    readTime: "10 min read",
    category: "Food & Culture",
    tags: ["Delhi", "Street Food", "Culture"],
    views: 1450,
    comments: 31,
    featured: true,
  },
  {
    id: 4,
    title: "Trekking in Himachal Pradesh: Beginner's Guide",
    excerpt:
      "New to trekking? Start your mountain adventure in Himachal Pradesh with our comprehensive guide covering the best beginner-friendly treks and essential tips.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Neha Gupta",
    publishDate: "2024-01-08",
    readTime: "12 min read",
    category: "Adventure",
    tags: ["Himachal Pradesh", "Trekking", "Adventure"],
    views: 2100,
    comments: 45,
    featured: false,
  },
  {
    id: 5,
    title: "Budget Travel Tips for Exploring India",
    excerpt:
      "Traveling on a shoestring budget? Discover practical tips and tricks to explore India without breaking the bank while still having amazing experiences.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Vikram Patel",
    publishDate: "2024-01-05",
    readTime: "7 min read",
    category: "Budget Travel",
    tags: ["Budget Travel", "Tips", "India"],
    views: 1800,
    comments: 28,
    featured: false,
  },
  {
    id: 6,
    title: "Spiritual Journey: Sacred Temples of South India",
    excerpt:
      "Explore the architectural marvels and spiritual significance of South India's most revered temples. A journey through history, culture, and devotion.",
    content: "Full blog content here...",
    image: "/placeholder.svg?height=400&width=600",
    author: "Lakshmi Iyer",
    publishDate: "2024-01-03",
    readTime: "9 min read",
    category: "Culture",
    tags: ["South India", "Temples", "Spirituality"],
    views: 1350,
    comments: 19,
    featured: false,
  },
]

const categories = ["All", "Destinations", "Travel Tips", "Food & Culture", "Adventure", "Budget Travel", "Culture"]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">Travel Blog</h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90">
              Discover amazing destinations, travel tips, and inspiring stories from fellow travelers
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search articles..."
                className="pl-10 py-3 text-gray-900 bg-white border-0 rounded-full text-base min-h-[44px]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 sm:py-12 px-4 sm:px-6">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="rounded-full text-sm sm:text-base min-h-[40px] px-4 sm:px-6"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-8 sm:mb-12" aria-labelledby="featured-articles">
            <h2 id="featured-articles" className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                    <div className="relative h-48 sm:h-64 overflow-hidden">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white">Featured</Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="min-h-[36px]">
                          <Link href={`/blog/${post.id}`} className="flex items-center gap-1">
                            Read More <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section aria-labelledby="latest-articles">
          <h2 id="latest-articles" className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {regularPosts.map((post) => (
              <article key={post.id}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                  <div className="relative h-40 sm:h-48 overflow-hidden">
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
                    <h3 className="text-base sm:text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="truncate">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="min-h-[36px]">
                        <Link href={`/blog/${post.id}`} className="flex items-center gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </section>

        {/* Load More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 sm:py-4 text-base min-h-[44px]"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  )
}
