import type { Metadata } from "next"
import BlogClientPage from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Travel Blog - Tips, Guides & Stories",
  description:
    "Discover amazing destinations, travel tips, and inspiring stories from fellow travelers. Get expert advice for your next adventure.",
  openGraph: {
    title: "Travel Blog - Tips, Guides & Stories | JMT Travel",
    description: "Discover amazing destinations, travel tips, and inspiring stories from fellow travelers.",
    images: ["/blog-og-image.jpg"], // Placeholder for Open Graph image
  },
  // Add canonical tag if needed, e.g., if there are multiple URLs for the same content
  // canonical: "https://www.jmttravel.com/blog",
}

export default function BlogPage() {
  return <BlogClientPage />
}
