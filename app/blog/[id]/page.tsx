import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  BookmarkPlus,
  Eye,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react"
import type { Metadata } from "next"

// Mock blog data (same as in blog page)
const blogPosts = [
  {
    id: 1,
    title: "10 Hidden Gems in Rajasthan You Must Visit",
    excerpt: "Discover the lesser-known treasures of Rajasthan beyond the popular tourist destinations.",
    content: `
      <p>Rajasthan, the land of kings, is renowned for its magnificent palaces, vibrant culture, and vast desert landscapes. While most travelers flock to popular destinations like Jaipur, Udaipur, and Jodhpur, the state harbors numerous hidden gems that offer equally enchanting experiences without the crowds.</p>
      
      <h2>1. Bundi - The Blue City's Hidden Cousin</h2>
      <p>Often overshadowed by Jodhpur, Bundi is a picturesque town known for its stunning step wells (baoris) and intricate murals. The Taragarh Fort offers panoramic views of the town, while the Chitrashala in the City Palace showcases exquisite Rajput paintings.</p>
      
      <h2>2. Kumbhalgarh Fort - The Great Wall of India</h2>
      <p>This UNESCO World Heritage site boasts the second-longest wall in the world after the Great Wall of China. The fort's massive walls stretch over 36 kilometers and offer breathtaking views of the Aravalli Hills.</p>
      
      <h2>3. Mandawa - Open Air Art Gallery</h2>
      <p>Located in the Shekhawati region, Mandawa is famous for its painted havelis adorned with beautiful frescoes. Walking through its streets feels like exploring an open-air art gallery.</p>
      
      <h2>4. Ranakpur Jain Temple - Architectural Marvel</h2>
      <p>This stunning marble temple complex is dedicated to Tirthankara Rishabhanatha. With 1,444 intricately carved pillars, each unique in design, it's considered one of the most beautiful Jain temples in India.</p>
      
      <h2>5. Kuldhara Village - The Abandoned Mystery</h2>
      <p>This abandoned village near Jaisalmer tells a haunting tale of the Paliwal Brahmins who mysteriously disappeared overnight 200 years ago. The ruins offer a glimpse into medieval Rajasthani architecture.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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
    content: `
      <p>Kerala, often referred to as "God's Own Country," is a tropical paradise known for its serene backwaters, lush greenery, and beautiful beaches. Choosing the right time to visit can significantly enhance your experience.</p>
      
      <h2>1. Winter (October to March) - The Best Time</h2>
      <p>This is undoubtedly the most popular time to visit Kerala. The weather is pleasant and cool, with minimal humidity, making it ideal for sightseeing, houseboat cruises, and beach activities. Temperatures range from 18°C to 29°C.</p>
      
      <h2>2. Summer (April to May) - Hot but Affordable</h2>
      <p>Summers in Kerala are hot and humid, with temperatures soaring up to 36°C. However, this is also the off-season, meaning fewer crowds and significant discounts on hotels and flights. It's a good time for budget travelers, especially if you plan to visit hill stations like Munnar or Wayanad.</p>
      
      <h2>3. Monsoon (June to September) - Lush Greenery & Ayurveda</h2>
      <p>The monsoon season transforms Kerala into a lush green wonderland. While heavy rainfall can disrupt travel plans, it's considered the best time for Ayurvedic treatments, as the atmosphere is cool, moist, and dust-free, which is believed to enhance the effectiveness of therapies. It's also a great time for nature lovers and photographers.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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
    content: `
      <p>Delhi's street food scene is a vibrant tapestry of flavors, aromas, and traditions. It's a culinary adventure that takes you through narrow lanes and bustling markets, offering a taste of authentic Indian cuisine.</p>
      
      <h2>1. Chandni Chowk - The Heart of Delhi's Food</h2>
      <p>No street food tour of Delhi is complete without a visit to Chandni Chowk. Here, you can savor iconic dishes like Parathe Wali Gali's stuffed parathas, Natraj Dahi Bhalle Wala's dahi bhalle, and Old Famous Jalebi Wala's crispy jalebis.</p>
      
      <h2>2. Karol Bagh - Punjabi Delights</h2>
      <p>Karol Bagh is famous for its Punjabi street food. Try the chole bhature, golgappe, and various tikkis from local vendors. The area also offers a great selection of sweets.</p>
      
      <h2>3. Connaught Place - Modern & Traditional Mix</h2>
      <p>While Connaught Place is known for its upscale restaurants, its inner circle also hosts several popular street food stalls. From momos to kulfi, you'll find a mix of modern and traditional snacks.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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
    content: `
      <p>Himachal Pradesh, with its majestic Himalayas and serene valleys, is a trekker's paradise. If you're new to trekking, this guide will help you choose the perfect trail and prepare for your adventure.</p>
      
      <h2>1. Triund Trek - The Crown Jewel</h2>
      <p>Located near McLeod Ganj, the Triund trek is perfect for beginners. It's a relatively easy 9 km trail that offers stunning views of the Dhauladhar range and Kangra Valley. The trek can be completed in a day or with an overnight camp.</p>
      
      <h2>2. Kheerganga Trek - Hot Springs & Serenity</h2>
      <p>This popular trek in Parvati Valley leads to a natural hot spring. The trail is moderately easy and takes about 3-4 hours from Barshaini. It's known for its beautiful landscapes and spiritual ambiance.</p>
      
      <h2>3. Prashar Lake Trek - Panoramic Views</h2>
      <p>The trek to Prashar Lake offers panoramic views of the Dhauladhar, Pir Panjal, and Kinnaur mountain ranges. The lake has a floating island and a pagoda-style temple, making it a unique destination for a beginner-friendly trek.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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
    content: `
      <p>Exploring India on a budget is not just possible, but it can also lead to more authentic and memorable experiences. Here are some tips to help you save money without compromising on your adventure.</p>
      
      <h2>1. Travel by Train</h2>
      <p>Indian Railways offers an extensive network and is incredibly affordable. Opt for sleeper class or AC 3-tier for comfortable yet budget-friendly travel across long distances.</p>
      
      <h2>2. Eat Local Street Food</h2>
      <p>Street food is not only delicious but also very cheap. Look for popular local eateries and stalls where locals frequent for the best and safest options.</p>
      
      <h2>3. Stay in Hostels or Guesthouses</h2>
      <p>Hostels offer dormitory beds at very low prices and are great for meeting other travelers. Guesthouses provide a more private experience at a fraction of the cost of hotels.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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
    content: `
      <p>South India is a land steeped in ancient history, rich culture, and profound spirituality, home to some of the most magnificent temples in the world. A spiritual journey through this region offers a glimpse into its architectural grandeur and deep-rooted traditions.</p>
      
      <h2>1. Meenakshi Amman Temple, Madurai</h2>
      <p>This historic Hindu temple is dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar, a form of Shiva. Its towering gopurams (gateway towers) are adorned with thousands of colorful sculptures.</p>
      
      <h2>2. Brihadeeswarar Temple, Thanjavur</h2>
      <p>A UNESCO World Heritage site, this Chola-era temple is a marvel of Dravidian architecture. Built entirely of granite, it's known for its massive vimana (temple tower) and intricate carvings.</p>
      
      <h2>3. Ramanathaswamy Temple, Rameswaram</h2>
      <p>Located on Rameswaram Island, this temple is one of the twelve Jyotirlinga temples dedicated to Lord Shiva. It boasts the longest corridor among all Hindu temples in India.</p>
    `,
    image: "/placeholder.svg?height=500&width=800",
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

// Metadata for the blog post page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const postId = Number.parseInt(params.id)
  const post = blogPosts.find((p) => p.id === postId)

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image || "/placeholder.svg"],
      type: "article",
      publishedTime: new Date(post.publishDate).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image || "/placeholder.svg"],
    },
    // Add canonical tag if needed, e.g., if there are multiple URLs for the same content
    // canonical: `https://www.jmttravel.com/blog/${post.id}`,
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)
  const post = blogPosts.find((p) => p.id === postId)

  if (!post) {
    notFound()
  }

  // Filter out the current post from related posts
  const relatedPosts = blogPosts.filter((p) => p.id !== postId).slice(0, 3) // Get up to 3 related posts

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8 px-4 sm:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild className="min-h-[44px]">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  loading="eager"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 text-white">{post.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{post.title}</h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 text-sm sm:text-base mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex flex-wrap items-center gap-4 mb-6 sm:mb-8">
                  <span className="text-gray-600 text-sm sm:text-base">Share:</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 min-h-[36px] min-w-[36px]"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 min-h-[36px] min-w-[36px]"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 min-h-[36px] min-w-[36px]"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 min-h-[36px] min-w-[36px]"
                      aria-label="Share on Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto min-h-[44px]">
                    <BookmarkPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                    Save
                  </Button>
                </div>

                <Separator className="mb-6 sm:mb-8" />

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-600 mr-2 text-sm sm:text-base">Tags:</span>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <Card className="mt-8">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Comments ({post.comments})</h2>
                <div className="space-y-6">
                  {/* Sample Comments */}
                  <div className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-base">Amit Kumar</span>
                          <span className="text-gray-500 text-sm">2 days ago</span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Great article! I visited Bundi last year and it was absolutely stunning. The step wells are
                          truly architectural marvels.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-base">Sneha Patel</span>
                          <span className="text-gray-500 text-sm">1 day ago</span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Thanks for sharing these hidden gems! Adding Kumbhalgarh Fort to my travel bucket list.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {post.author.charAt(0)}
                </div>
                <h3 className="font-bold text-lg mb-2">{post.author}</h3>
                <p className="text-gray-600 text-sm mb-4">Travel Writer & Photographer</p>
                <Button size="sm" className="w-full min-h-[44px]">
                  Follow
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg mb-4">Related Articles</h2>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="block group">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={relatedPost.image || "/placeholder.svg"}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-2">Stay Updated</h2>
                <p className="text-gray-600 text-sm mb-4">Get the latest travel tips and destination guides.</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md text-sm min-h-[44px]"
                    aria-label="Enter your email for newsletter"
                  />
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 min-h-[44px]">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
