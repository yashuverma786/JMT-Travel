import FilterBar from "@/components/filter-bar"
import SpecialOffersSection from "@/components/special-offers-section"
import TrendingDestinations from "@/components/trending-destinations"
import CustomerReviews from "@/components/customer-reviews"
import ActivityGrid from "@/components/activity-grid"
import TravelBlogs from "@/components/travel-blogs"
import Partners from "@/components/partners"
import PopularDestinationsCarousel from "@/components/popular-destinations-carousel"
import InteractiveHolidayPackages from "@/components/interactive-holiday-packages"
import Testimonials from "@/components/testimonials"
import FeaturedTripsSection from "@/components/featured-trips-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Award, Shield, Plane, MapPin, Calendar, Users } from "lucide-react"
import ClientWrapper from "@/components/client-wrapper"
import SearchModal from "@/components/search-modal"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "JMT Travel - Holiday Packages & Travel Booking",
  description:
    "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel with 50,000+ happy travelers.",
  openGraph: {
    title: "JMT Travel - Holiday Packages & Travel Booking",
    description:
      "Book holiday packages, hotels, flights and more with JMT Travel. Best deals on domestic and international travel.",
    images: ["/og-image.jpg"],
  },
}

const features = [
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    title: "Best Price Guarantee",
    description: "We offer the best prices on holiday packages",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Award className="h-8 w-8 text-green-600" />,
    title: "Award Winning Service",
    description: "Recognized for excellence in travel services",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Shield className="h-8 w-8 text-purple-600" />,
    title: "Secure Booking",
    description: "100% secure payment and booking process",
    gradient: "from-purple-500 to-pink-500",
  },
]

const stats = [
  { icon: <Users className="h-8 w-8" />, number: "50,000+", label: "Happy Travelers" },
  { icon: <MapPin className="h-8 w-8" />, number: "500+", label: "Destinations" },
  { icon: <Calendar className="h-8 w-8" />, number: "10+", label: "Years Experience" },
  { icon: <Plane className="h-8 w-8" />, number: "1000+", label: "Tour Packages" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/3 w-32 h-32 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-xl"></div>
        </div>

        <div className="container relative z-10 px-6">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Discover Amazing
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Holiday Packages
              </span>
            </h1>
            <p className="text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Embark on unforgettable journeys with JMT Travel. From serene beaches to majestic mountains, your perfect
              adventure awaits.
            </p>
          </div>

          <div className="relative mt-12">
            <ClientWrapper>
              <SearchModal />
            </ClientWrapper>
          </div>
        </div>

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
              className="text-gray-50"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
              className="text-gray-50"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
              className="text-gray-50"
            />
          </svg>
        </div>
      </section>

      {/* Filter Bar */}
      <ClientWrapper>
        <FilterBar />
      </ClientWrapper>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container relative z-10 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-base text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trips Section */}
      <ClientWrapper>
        <FeaturedTripsSection />
      </ClientWrapper>

      {/* Interactive Holiday Packages */}
      <ClientWrapper>
        <InteractiveHolidayPackages />
      </ClientWrapper>

      {/* Activity Grid */}
      <ClientWrapper>
        <ActivityGrid />
      </ClientWrapper>

      {/* Popular Destinations Carousel */}
      <ClientWrapper>
        <PopularDestinationsCarousel />
      </ClientWrapper>

      {/* Special Offers Section */}
      <ClientWrapper>
        <SpecialOffersSection />
      </ClientWrapper>

      {/* Trending Destinations */}
      <ClientWrapper>
        <TrendingDestinations />
      </ClientWrapper>

      {/* Customer Reviews */}
      <ClientWrapper>
        <CustomerReviews />
      </ClientWrapper>

      {/* Travel Blogs */}
      <ClientWrapper>
        <TravelBlogs />
      </ClientWrapper>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="container relative z-10 px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              Why Choose JMT Travel?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make your travel dreams come true with our exceptional service and unbeatable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-full text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Tour CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Need a Custom Tour Package?</h2>
          <p className="text-xl mb-8 opacity-90">Let our travel experts create a personalized itinerary just for you</p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg" asChild>
            <Link href="/custom-packages">Create Custom Package</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <ClientWrapper>
        <Testimonials />
      </ClientWrapper>

      {/* Partners Section */}
      <ClientWrapper>
        <Partners />
      </ClientWrapper>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="container text-center relative z-10 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6">Get Exclusive Travel Deals</h2>
            <p className="text-2xl mb-12 opacity-90">
              Subscribe to our newsletter and be the first to know about amazing offers and new destinations
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-2xl">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
                />
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">Join 50,000+ travelers who trust us for their adventures</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
