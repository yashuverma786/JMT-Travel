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
  // Add other blog posts here...
]

const relatedPosts = [
  {
    id: 2,
    title: "Best Time to Visit Kerala: A Complete Guide",
    image: "/placeholder.svg?height=200&width=300",
    category: "Travel Tips",
  },
  {
    id: 3,
    title: "Street Food Adventures in Delhi",
    image: "/placeholder.svg?height=200&width=300",
    category: "Food & Culture",
  },
  {
    id: 4,
    title: "Trekking in Himachal Pradesh",
    image: "/placeholder.svg?height=200&width=300",
    category: "Adventure",
  },
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const postId = Number.parseInt(params.id)
  const post = blogPosts.find((p) => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96 overflow-hidden">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-blue-600 text-white">{post.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gray-600">Share:</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="p-2">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="p-2">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>

                <Separator className="mb-8" />

                {/* Article Content */}
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                <div className="mt-8 pt-8 border-t">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-600 mr-2">Tags:</span>
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
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Comments ({post.comments})</h3>
                <div className="space-y-6">
                  {/* Sample Comments */}
                  <div className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Amit Kumar</span>
                          <span className="text-gray-500 text-sm">2 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          Great article! I visited Bundi last year and it was absolutely stunning. The step wells are
                          truly architectural marvels.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Sneha Patel</span>
                          <span className="text-gray-500 text-sm">1 day ago</span>
                        </div>
                        <p className="text-gray-700">
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
                <Button size="sm" className="w-full">
                  Follow
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Related Articles</h3>
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
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
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

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                <p className="text-gray-600 text-sm mb-4">Get the latest travel tips and destination guides.</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                  <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
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
