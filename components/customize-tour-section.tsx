"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MapPin, Users, Plane, Car, Train, Ship, Star } from "lucide-react"
import { motion } from "framer-motion"

const destinations = [
  "Goa",
  "Kerala",
  "Rajasthan",
  "Himachal Pradesh",
  "Kashmir",
  "Uttarakhand",
  "Karnataka",
  "Tamil Nadu",
  "Andhra Pradesh",
  "Maharashtra",
  "Gujarat",
  "Other",
]

const tripTypes = [
  "Beach Holiday",
  "Hill Station",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Pilgrimage",
  "Honeymoon",
  "Family Trip",
  "Solo Travel",
  "Group Tour",
  "Business Trip",
  "Other",
]

const accommodationTypes = [
  "3 Star Hotel",
  "4 Star Hotel",
  "5 Star Hotel",
  "Resort",
  "Homestay",
  "Guest House",
  "Luxury Villa",
  "Budget Hotel",
]

const transportModes = [
  { icon: <Plane className="h-4 w-4" />, label: "Flight", value: "flight" },
  { icon: <Train className="h-4 w-4" />, label: "Train", value: "train" },
  { icon: <Car className="h-4 w-4" />, label: "Car/Bus", value: "car" },
  { icon: <Ship className="h-4 w-4" />, label: "Cruise", value: "cruise" },
]

const activities = [
  "Sightseeing",
  "Adventure Sports",
  "Water Sports",
  "Trekking",
  "Wildlife Safari",
  "Cultural Tours",
  "Food Tours",
  "Photography",
  "Shopping",
  "Spa & Wellness",
]

const features = [
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Choose Your Destination",
    description: "Pick from 500+ destinations worldwide",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Flexible Dates",
    description: "Travel on your preferred dates",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Group Size",
    description: "Perfect for solo, couple, or group travel",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Premium Experience",
    description: "Handpicked hotels and activities",
  },
]

export default function CustomizeTourSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    tripType: "",
    startDate: "",
    endDate: "",
    adults: "",
    children: "",
    accommodation: "",
    transport: "",
    budget: "",
    activities: [] as string[],
    specialRequests: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActivityChange = (activity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      activities: checked ? [...prev.activities, activity] : prev.activities.filter((a) => a !== activity),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Custom tour request:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        tripType: "",
        startDate: "",
        endDate: "",
        adults: "",
        children: "",
        accommodation: "",
        transport: "",
        budget: "",
        activities: [],
        specialRequests: "",
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2 sm:mb-4">Request Submitted Successfully!</h3>
                <p className="text-green-700 mb-4">
                  Thank you for your custom tour request. Our travel experts will contact you within 24 hours with a
                  personalized itinerary.
                </p>
                <p className="text-sm text-green-600">
                  You will receive a confirmation email shortly with your request details.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl"></div>
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent">
            Can't Find Your Perfect Trip?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Let us create a personalized travel experience just for you. Tell us your preferences and we'll craft the
            perfect itinerary.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Features */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-orange-100 rounded-lg text-orange-600 flex-shrink-0">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">{feature.title}</h3>
                            <p className="text-xs sm:text-base text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8 sm:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Customize Your Dream Tour</h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <MapPin className="w-5 h-5 text-orange-600" />
                          </div>
                          <span className="text-gray-700">Choose your dream destinations</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-gray-700">Pick your preferred dates</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-gray-700">Set your group size</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <Plane className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="text-gray-700">Select activities & preferences</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-6">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4">
                          <Plane className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-gray-600 mb-6">
                          Our travel experts will create a personalized itinerary based on your preferences and budget.
                        </p>
                      </div>

                      <Link href="/customize-tour">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          Customize Your Tour
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tour Request Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center">Custom Tour Request Form</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Trip Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="destination">Preferred Destination *</Label>
                          <Select
                            value={formData.destination}
                            onValueChange={(value) => handleInputChange("destination", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                            <SelectContent>
                              {destinations.map((dest) => (
                                <SelectItem key={dest} value={dest}>
                                  {dest}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tripType">Trip Type *</Label>
                          <Select
                            value={formData.tripType}
                            onValueChange={(value) => handleInputChange("tripType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select trip type" />
                            </SelectTrigger>
                            <SelectContent>
                              {tripTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Travel Dates */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Travel Dates
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Group Size */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Group Size
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adults">Number of Adults *</Label>
                          <Select value={formData.adults} onValueChange={(value) => handleInputChange("adults", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select adults" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} Adult{num > 1 ? "s" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="children">Number of Children</Label>
                          <Select
                            value={formData.children}
                            onValueChange={(value) => handleInputChange("children", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select children" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">No Children</SelectItem>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} Child{num > 1 ? "ren" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-blue-600" />
                        Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="accommodation">Accommodation Type</Label>
                          <Select
                            value={formData.accommodation}
                            onValueChange={(value) => handleInputChange("accommodation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select accommodation" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="budget">Budget Range (per person)</Label>
                          <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-10000">Under ₹10,000</SelectItem>
                              <SelectItem value="10000-25000">₹10,000 - ₹25,000</SelectItem>
                              <SelectItem value="25000-50000">₹25,000 - ₹50,000</SelectItem>
                              <SelectItem value="50000-100000">₹50,000 - ₹1,00,000</SelectItem>
                              <SelectItem value="above-100000">Above ₹1,00,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Transportation */}
                      <div className="mb-4">
                        <Label className="text-base font-medium mb-3 block">Preferred Transportation</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {transportModes.map((mode) => (
                            <div key={mode.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={mode.value}
                                checked={formData.transport === mode.value}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleInputChange("transport", mode.value)
                                  }
                                }}
                              />
                              <Label htmlFor={mode.value} className="flex items-center gap-2 cursor-pointer">
                                {mode.icon}
                                {mode.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">Preferred Activities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {activities.map((activity) => (
                            <div key={activity} className="flex items-center space-x-2">
                              <Checkbox
                                id={activity}
                                checked={formData.activities.includes(activity)}
                                onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                              />
                              <Label htmlFor={activity} className="cursor-pointer text-sm">
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label htmlFor="specialRequests">Special Requests or Additional Information</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Any special requirements, dietary restrictions, accessibility needs, or other preferences..."
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Submit Custom Tour Request
                      </Button>
                      <p className="text-sm text-gray-500 mt-2">Our travel experts will contact you within 24 hours</p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
