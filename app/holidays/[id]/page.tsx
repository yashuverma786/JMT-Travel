"use client"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Utensils,
  Plane,
  Hotel,
  Car,
  Camera,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Star,
  Phone,
  Mail,
  Shield,
  ChevronDown,
  Download,
  Check,
  X,
} from "lucide-react"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from "react"

// Mock data for holiday packages
const holidayPackages = [
  {
    id: 1,
    title: "Goa Beach Holiday",
    destination: "Goa",
    image: "/placeholder.svg?height=400&width=600",
    duration: "4 Days / 3 Nights",
    price: 12999,
    originalPrice: 15999,
    rating: 4.5,
    reviews: 245,
    discount: 19,
    category: "Beach",
    description:
      "Experience the perfect blend of sun, sand, and sea in Goa. This package includes pristine beaches, water sports, vibrant nightlife, and delicious seafood.",
    highlights: [
      "Visit famous beaches like Baga, Calangute, and Anjuna",
      "Water sports activities including parasailing and jet skiing",
      "Explore Old Goa's Portuguese heritage",
      "Sunset cruise on Mandovi River",
      "Traditional Goan cuisine experience",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Beach Exploration",
        activities: ["Airport pickup", "Hotel check-in", "Baga Beach visit", "Welcome dinner"],
        description:
          "Arrive in Goa and check into your hotel. Spend the afternoon exploring Baga Beach and enjoy a welcome dinner.",
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: "Water Sports & Sightseeing",
        activities: [
          "Water sports at Calangute",
          "Old Goa churches tour",
          "Spice plantation visit",
          "Evening at leisure",
        ],
        description:
          "Enjoy water sports at Calangute Beach. Visit the historic churches of Old Goa and a spice plantation.",
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: "Adventure & Culture",
        activities: [
          "Dudhsagar Falls excursion",
          "Local market shopping",
          "Traditional Goan cooking class",
          "Beach party",
        ],
        description:
          "Take an excursion to Dudhsagar Falls. Shop at the local market and participate in a traditional Goan cooking class.",
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: "Departure",
        activities: ["Hotel checkout", "Last-minute shopping", "Airport transfer", "Departure"],
        description:
          "Check out from the hotel and do some last-minute shopping before transferring to the airport for your departure.",
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    inclusions: [
      "3 nights accommodation in 4-star hotel",
      "Daily breakfast and dinner",
      "Airport transfers",
      "Sightseeing as per itinerary",
      "Water sports activities",
      "Professional tour guide",
    ],
    exclusions: [
      "Airfare",
      "Personal expenses",
      "Lunch (except on excursion days)",
      "Tips and gratuities",
      "Travel insurance",
    ],
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 2,
    title: "Kerala Backwaters",
    destination: "Kerala",
    image: "/placeholder.svg?height=400&width=600",
    duration: "5 Days / 4 Nights",
    price: 18999,
    originalPrice: 22999,
    rating: 4.7,
    reviews: 189,
    discount: 17,
    category: "Nature",
    description:
      "Discover God's Own Country with serene backwaters, lush hill stations, and rich cultural heritage. Experience Kerala's natural beauty and traditional lifestyle.",
    highlights: [
      "Houseboat cruise in Alleppey backwaters",
      "Munnar hill station with tea gardens",
      "Thekkady wildlife sanctuary",
      "Traditional Kathakali dance performance",
      "Ayurvedic spa treatments",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Cochin",
        activities: ["Airport pickup", "Cochin city tour", "Chinese fishing nets", "Hotel check-in"],
        description:
          "Arrive in Cochin and check into your hotel. Explore the city, including the famous Chinese fishing nets.",
        meals: { breakfast: false, lunch: false, dinner: true },
      },
      {
        day: 2,
        title: "Munnar Hill Station",
        activities: ["Drive to Munnar", "Tea garden visit", "Mattupetty Dam", "Echo Point"],
        description: "Drive to Munnar and visit the tea gardens, Mattupetty Dam, and Echo Point.",
        meals: { breakfast: true, lunch: true, dinner: false },
      },
      {
        day: 3,
        title: "Thekkady Wildlife",
        activities: ["Drive to Thekkady", "Periyar Wildlife Sanctuary", "Spice plantation tour", "Boat ride"],
        description:
          "Drive to Thekkady and visit the Periyar Wildlife Sanctuary. Enjoy a spice plantation tour and a boat ride.",
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 4,
        title: "Alleppey Backwaters",
        activities: ["Drive to Alleppey", "Houseboat check-in", "Backwater cruise", "Village visit"],
        description:
          "Drive to Alleppey and check into your houseboat. Enjoy a backwater cruise and visit a local village.",
        meals: { breakfast: true, lunch: true, dinner: true },
      },
      {
        day: 5,
        title: "Departure",
        activities: ["Houseboat checkout", "Cochin airport transfer", "Departure"],
        description: "Check out from the houseboat and transfer to Cochin airport for your departure.",
        meals: { breakfast: true, lunch: false, dinner: false },
      },
    ],
    inclusions: [
      "4 nights accommodation (3 nights hotel + 1 night houseboat)",
      "All meals during houseboat stay",
      "Breakfast at hotels",
      "All transfers and sightseeing",
      "Professional guide",
      "Boat rides and entry fees",
    ],
    exclusions: [
      "Airfare",
      "Lunch and dinner at hotels",
      "Personal expenses",
      "Camera fees at monuments",
      "Travel insurance",
    ],
    gallery: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  // Add more packages as needed...
]

export default function HolidayPackageDetail({ params }: { params: { id: string } }) {
  const [itineraryOpen, setItineraryOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const packageId = Number.parseInt(params.id)
  const pkg = holidayPackages.find((p) => p.id === packageId)

  if (!pkg) {
    notFound()
  }

  const discountedPrice = pkg.price

  const faqs = [
    {
      question: "What is included in the package price?",
      answer:
        "The package includes accommodation, meals as specified, transportation, sightseeing, and professional guide services. Please check the inclusions section for detailed information.",
    },
    {
      question: "Is travel insurance included?",
      answer:
        "Travel insurance is not included in the package price but is highly recommended. We can help you arrange comprehensive travel insurance for an additional cost.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Free cancellation up to 48 hours before departure. Cancellations made within 48 hours are subject to a 50% cancellation fee. No refund for no-shows.",
    },
    {
      question: "Can I customize this package?",
      answer:
        "Yes, we offer customization options for all our packages. Contact our travel experts to discuss your specific requirements and preferences.",
    },
    {
      question: "What documents do I need?",
      answer:
        "You'll need a valid government-issued photo ID. For international destinations, a valid passport is required. Visa requirements vary by destination.",
    },
  ]

  const handleDownloadPDF = () => {
    // This would typically generate and download a PDF
    alert("PDF download functionality would be implemented here with a PDF generation library")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{pkg.title}</h1>
            <div className="flex items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{pkg.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span>
                  {pkg.rating} ({pkg.reviews} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/holidays" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Packages
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Package Overview
                  <Badge className="bg-blue-600">{pkg.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Package Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Collapsible Itinerary Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setItineraryOpen(!itineraryOpen)}
                >
                  Detailed Itinerary
                  <ChevronDown className={`h-5 w-5 transition-transform ${itineraryOpen ? "rotate-180" : ""}`} />
                </CardTitle>
              </CardHeader>
              <Collapsible open={itineraryOpen} onOpenChange={setItineraryOpen}>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-6">
                      {pkg.itinerary.map((day) => (
                        <div key={day.day} className="border-l-4 border-blue-500 pl-6 pb-6">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {day.day}
                            </div>
                            <h3 className="text-lg font-semibold">{day.title}</h3>
                          </div>
                          <p className="text-gray-700 mb-4">{day.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">Breakfast:</span>
                              {day.meals.breakfast ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">Lunch:</span>
                              {day.meals.lunch ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">Dinner:</span>
                              {day.meals.dinner ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Inclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Exclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pkg.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${pkg.title} gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg">
                      <button
                        className="w-full px-4 py-3 text-left font-medium flex items-center justify-between hover:bg-gray-50"
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      >
                        {faq.question}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                        />
                      </button>
                      <Collapsible open={openFaq === index}>
                        <CollapsibleContent>
                          <div className="px-4 pb-3 text-gray-600">{faq.answer}</div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book This Package</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {pkg.discount > 0 && (
                      <span className="text-lg text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-bold text-blue-600">₹{discountedPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">per person</p>
                  {pkg.discount > 0 && <Badge className="bg-red-500 text-white mt-2">Save {pkg.discount}%</Badge>}
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{pkg.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Group Size</p>
                      <p className="text-sm text-gray-600">2-15 people</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Destination</p>
                      <p className="text-sm text-gray-600">{pkg.destination}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    asChild
                  >
                    <Link href={`/booking?package=${pkg.id}`}>Book Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call for Booking
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Inquiry
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Flight bookings available</span>
                </div>
                <div className="flex items-center gap-3">
                  <Hotel className="h-5 w-5 text-green-500" />
                  <span className="text-sm">4-star accommodation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Private transportation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Camera className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Photography allowed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Utensils className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Meals included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span className="text-sm">Travel insurance recommended</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
