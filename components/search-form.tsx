"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Search, MapPin, Users, Mountain, Heart, Camera } from "lucide-react"

export default function SearchForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("destinations")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setActiveTab("destinations")
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [isClient])

  const handleSearch = (e: React.FormEvent, tab: string) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()
    if (departureDate) params.append("departure", format(departureDate, "yyyy-MM-dd"))
    if (returnDate) params.append("return", format(returnDate, "yyyy-MM-dd"))

    // Navigate to search results
    router.push(`/${tab}?${params.toString()}`)
  }

  const tabConfig = [
    {
      value: "destinations",
      label: "Destinations",
      icon: <MapPin className="h-5 w-5" />,
      gradient: "from-blue-500 to-cyan-500",
      description: "Explore amazing places",
    },
    {
      value: "trips",
      label: "Trips",
      icon: <Mountain className="h-5 w-5" />,
      gradient: "from-green-500 to-emerald-500",
      description: "Adventure awaits you",
    },
    {
      value: "trip-types",
      label: "Trip Types",
      icon: <Heart className="h-5 w-5" />,
      gradient: "from-pink-500 to-rose-500",
      description: "Find your perfect style",
    },
    {
      value: "activities",
      label: "Activities",
      icon: <Camera className="h-5 w-5" />,
      gradient: "from-orange-500 to-amber-500",
      description: "Thrilling experiences",
    },
  ]

  return (
    <div className="relative">
      {/* Parallax Background Elements - Only render on client */}
      {isClient && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        </div>
      )}

      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg relative z-10 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 animate-pulse"></div>

        <CardContent className="p-0 relative z-10">
          <Tabs defaultValue="destinations" className="w-full" onValueChange={setActiveTab}>
            {/* Enhanced Tab List */}
            <TabsList className="grid w-full grid-cols-4 rounded-none h-auto bg-gradient-to-r from-gray-50 to-gray-100 p-2">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 
                    data-[state=active]:bg-white data-[state=active]:shadow-lg 
                    data-[state=active]:scale-105 hover:scale-102 group
                    data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient}
                    data-[state=active]:text-white
                  `}
                >
                  <div
                    className={`
                    p-2 rounded-lg transition-all duration-300 group-hover:scale-110
                    ${
                      activeTab === tab.value
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                    }
                  `}
                  >
                    {tab.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div
                      className={`text-xs transition-opacity duration-300 ${
                        activeTab === tab.value ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Destinations Tab */}
            <TabsContent value="destinations" className="m-0">
              <div className="p-8 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Discover Amazing Destinations</h3>
                  <p className="text-gray-600">Find your perfect getaway destination</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      From City
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <Input
                        placeholder="Delhi, Mumbai, Bangalore..."
                        className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-green-500" />
                      Destination
                    </label>
                    <div className="relative group">
                      <Mountain className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                      <Input
                        placeholder="Goa, Kerala, Rajasthan..."
                        className="pl-10 h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-purple-500" />
                      Travel Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 rounded-xl"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
                          {departureDate ? format(departureDate, "dd MMM yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl">
                        <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      Travelers
                    </label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <Select defaultValue="2">
                        <SelectTrigger className="pl-10 h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Traveler</SelectItem>
                          <SelectItem value="2">2 Travelers</SelectItem>
                          <SelectItem value="3">3 Travelers</SelectItem>
                          <SelectItem value="4">4 Travelers</SelectItem>
                          <SelectItem value="5">5+ Travelers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => handleSearch(e, "destinations")}
                  >
                    <Search className="mr-3 h-5 w-5" />
                    Explore Destinations
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Trips Tab */}
            <TabsContent value="trips" className="m-0">
              <div className="p-8 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Plan Your Perfect Trip</h3>
                  <p className="text-gray-600">Customize your adventure experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-green-500" />
                      Trip Category
                    </label>
                    <Select defaultValue="adventure">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure Trips</SelectItem>
                        <SelectItem value="beach">Beach Holidays</SelectItem>
                        <SelectItem value="mountain">Mountain Escapes</SelectItem>
                        <SelectItem value="cultural">Cultural Tours</SelectItem>
                        <SelectItem value="wildlife">Wildlife Safaris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-purple-500" />
                      Duration
                    </label>
                    <Select defaultValue="3-5">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 Days</SelectItem>
                        <SelectItem value="3-5">3-5 Days</SelectItem>
                        <SelectItem value="6-10">6-10 Days</SelectItem>
                        <SelectItem value="10+">10+ Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      Budget Range
                    </label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget (₹5K-15K)</SelectItem>
                        <SelectItem value="medium">Medium (₹15K-30K)</SelectItem>
                        <SelectItem value="luxury">Luxury (₹30K+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Preferred Region
                    </label>
                    <Select defaultValue="any">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Region</SelectItem>
                        <SelectItem value="north">North India</SelectItem>
                        <SelectItem value="south">South India</SelectItem>
                        <SelectItem value="east">East India</SelectItem>
                        <SelectItem value="west">West India</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => handleSearch(e, "trips")}
                  >
                    <Mountain className="mr-3 h-5 w-5" />
                    Find Perfect Trips
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Trip Types Tab */}
            <TabsContent value="trip-types" className="m-0">
              <div className="p-8 bg-gradient-to-br from-pink-50/50 to-rose-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Travel Style</h3>
                  <p className="text-gray-600">Find trips that match your preferences</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { name: "Honeymoon", icon: "💕", desc: "Romantic getaways" },
                    { name: "Family", icon: "👨‍👩‍👧‍👦", desc: "Fun for everyone" },
                    { name: "Adventure", icon: "🏔️", desc: "Thrill seekers" },
                    { name: "Luxury", icon: "✨", desc: "Premium experiences" },
                    { name: "Budget", icon: "💰", desc: "Value for money" },
                    { name: "Group", icon: "👥", desc: "Friends & groups" },
                  ].map((type) => (
                    <div
                      key={type.name}
                      className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          {type.icon}
                        </div>
                        <div className="font-semibold text-gray-800">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => handleSearch(e, "trip-types")}
                  >
                    <Heart className="mr-3 h-5 w-5" />
                    Explore Trip Types
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="m-0">
              <div className="p-8 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Exciting Activities Await</h3>
                  <p className="text-gray-600">Discover thrilling experiences and adventures</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Camera className="h-4 w-4 text-orange-500" />
                      Activity Type
                    </label>
                    <Select defaultValue="water">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">Water Sports</SelectItem>
                        <SelectItem value="adventure">Adventure Sports</SelectItem>
                        <SelectItem value="cultural">Cultural Activities</SelectItem>
                        <SelectItem value="nature">Nature Experiences</SelectItem>
                        <SelectItem value="wellness">Wellness & Spa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <Input
                        placeholder="Goa, Rishikesh, Manali..."
                        className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-purple-500" />
                      Difficulty Level
                    </label>
                    <Select defaultValue="beginner">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Group Size
                    </label>
                    <Select defaultValue="small">
                      <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solo">Solo (1 person)</SelectItem>
                        <SelectItem value="small">Small (2-5 people)</SelectItem>
                        <SelectItem value="medium">Medium (6-15 people)</SelectItem>
                        <SelectItem value="large">Large (15+ people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={(e) => handleSearch(e, "activities")}
                  >
                    <Camera className="mr-3 h-5 w-5" />
                    Discover Activities
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
