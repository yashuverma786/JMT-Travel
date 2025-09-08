"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Users, Mountain, Heart, Camera, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// Modal Portal Component
function ModalPortal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }

    return () => {
      document.body.style.overflow = "unset"
      document.body.style.paddingRight = "0px"
    }
  }, [isOpen])

  if (!mounted || typeof window === "undefined") {
    return null
  }

  return createPortal(children, document.body)
}

export default function SearchModal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("destinations")
  const [isClient, setIsClient] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent, tab: string) => {
    e.preventDefault()
    console.log({ destination, checkIn, checkOut, guests })
    router.push(`/${tab}`)
    setIsOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <>
      {/* Trigger Button */}
      <div className="relative z-20">
        <div className="flex justify-center px-4">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium rounded-full min-h-[44px]"
          >
            <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Search for your perfect trip</span>
            <span className="sm:hidden">Search trips</span>
          </Button>
        </div>
      </div>

      {/* Modal Portal */}
      <ModalPortal isOpen={isOpen}>
        <AnimatePresence mode="wait">
          {isOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
              }}
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleBackdropClick}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.3,
                }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
                style={{
                  position: "relative",
                  zIndex: 10000,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="shadow-2xl border-0 bg-white backdrop-blur-lg">
                  {/* Close Button */}
                  <div className="absolute top-4 right-4 z-[10001]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-white/80 hover:bg-white shadow-sm min-h-[44px] min-w-[44px]"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close modal"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="max-h-[90vh] overflow-y-auto">
                    <Tabs defaultValue="destinations" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 rounded-none h-auto bg-gradient-to-r from-gray-50 to-gray-100 p-2 sticky top-0 z-[10000]">
                        <TabsTrigger
                          value="destinations"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white py-3 text-sm sm:text-base min-h-[44px]"
                        >
                          <MapPin className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Destinations</span>
                          <span className="sm:hidden">Places</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="trip-types"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white py-3 text-sm sm:text-base min-h-[44px]"
                        >
                          <Heart className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Trip Types</span>
                          <span className="sm:hidden">Types</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="activities"
                          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white py-3 text-sm sm:text-base min-h-[44px]"
                        >
                          <Camera className="mr-1 sm:mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Activities</span>
                          <span className="sm:hidden">Fun</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="destinations" className="m-0">
                        <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
                          <div className="text-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                              Discover Amazing Destinations
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">Find your perfect getaway destination</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-500" />
                                From City
                              </label>
                              <div className="relative group">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <Input
                                  placeholder="Delhi, Mumbai, Bangalore..."
                                  className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 rounded-xl text-base"
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
                                  className="pl-10 h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 rounded-xl text-base"
                                  value={destination}
                                  onChange={(e) => setDestination(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                Travel Date
                              </label>
                              <Select>
                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-300 rounded-xl text-base">
                                  <SelectValue placeholder="Select date" />
                                </SelectTrigger>
                                <SelectContent className="z-[10002]">
                                  <SelectItem value="june">June 2024</SelectItem>
                                  <SelectItem value="july">July 2024</SelectItem>
                                  <SelectItem value="august">August 2024</SelectItem>
                                  <SelectItem value="september">September 2024</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="h-4 w-4 text-orange-500" />
                                Travelers
                              </label>
                              <Select defaultValue="2">
                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 rounded-xl text-base">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[10002]">
                                  <SelectItem value="1">1 Traveler</SelectItem>
                                  <SelectItem value="2">2 Travelers</SelectItem>
                                  <SelectItem value="3">3 Travelers</SelectItem>
                                  <SelectItem value="4">4 Travelers</SelectItem>
                                  <SelectItem value="5">5+ Travelers</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-center mt-8">
                            <Button
                              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[44px]"
                              onClick={(e) => handleSearch(e, "destinations")}
                            >
                              <Search className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                              Explore Destinations
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="trip-types" className="m-0">
                        <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-50/50 to-rose-50/50">
                          <div className="text-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                              Choose Your Travel Style
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">Find trips that match your preferences</p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
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
                                className="p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-300 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group min-h-[80px] sm:min-h-[100px] flex flex-col justify-center"
                              >
                                <div className="text-center">
                                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                                    {type.icon}
                                  </div>
                                  <div className="font-semibold text-gray-800 text-sm sm:text-base">{type.name}</div>
                                  <div className="text-xs sm:text-sm text-gray-600">{type.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-center">
                            <Button
                              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[44px]"
                              onClick={(e) => handleSearch(e, "trip-types")}
                            >
                              <Heart className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                              Explore Trip Types
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="activities" className="m-0">
                        <div className="p-4 sm:p-6 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
                          <div className="text-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                              Exciting Activities Await
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                              Discover thrilling experiences and adventures
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Camera className="h-4 w-4 text-orange-500" />
                                Activity Type
                              </label>
                              <Select defaultValue="water">
                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 rounded-xl text-base">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[10002]">
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
                                  className="pl-10 h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 rounded-xl text-base"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-500" />
                                Group Size
                              </label>
                              <Select defaultValue="small">
                                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 rounded-xl text-base">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="z-[10002]">
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
                              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-h-[44px]"
                              onClick={(e) => handleSearch(e, "activities")}
                            >
                              <Camera className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                              Discover Activities
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </>
  )
}
