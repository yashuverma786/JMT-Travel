"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, MapPin, Users, Plane, Car, Train, Ship, Star, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

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

export default function CustomizeTourPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleActivityChange = (activity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      activities: checked ? [...prev.activities, activity] : prev.activities.filter((a) => a !== activity),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Custom tour request:", formData)
    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset form after 5 seconds
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
    }, 5000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-16">
        <div className="container px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="border-green-200 bg-green-50 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Request Submitted Successfully!</h3>
                <p className="text-green-700 mb-4 text-sm sm:text-base">
                  Thank you for your custom tour request. Our travel experts will contact you within 24 hours with a
                  personalized itinerary.
                </p>
                <p className="text-xs sm:text-sm text-green-600 mb-6">
                  You will receive a confirmation email shortly with your request details.
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/">Back to Home</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 sm:py-16">
      <div className="container px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="mb-4 p-0 h-auto">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Customize Your <span className="text-blue-600">Perfect Tour</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                Tell us your preferences and we'll create a personalized travel experience just for you
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl text-center">Custom Tour Request Form</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Trip Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="destination" className="text-sm">
                        Preferred Destination *
                      </Label>
                      <Select
                        value={formData.destination}
                        onValueChange={(value) => handleInputChange("destination", value)}
                      >
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="tripType" className="text-sm">
                        Trip Type *
                      </Label>
                      <Select value={formData.tripType} onValueChange={(value) => handleInputChange("tripType", value)}>
                        <SelectTrigger className="mt-1">
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
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Travel Dates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-sm">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-sm">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Group Size */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Group Size
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="adults" className="text-sm">
                        Number of Adults *
                      </Label>
                      <Select value={formData.adults} onValueChange={(value) => handleInputChange("adults", value)}>
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="children" className="text-sm">
                        Number of Children
                      </Label>
                      <Select value={formData.children} onValueChange={(value) => handleInputChange("children", value)}>
                        <SelectTrigger className="mt-1">
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
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                    <Star className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                    Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <Label htmlFor="accommodation" className="text-sm">
                        Accommodation Type
                      </Label>
                      <Select
                        value={formData.accommodation}
                        onValueChange={(value) => handleInputChange("accommodation", value)}
                      >
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="budget" className="text-sm">
                        Budget Range (per person)
                      </Label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                        <SelectTrigger className="mt-1">
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
                    <Label className="text-sm font-medium mb-3 block">Preferred Transportation</Label>
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
                          <Label htmlFor={mode.value} className="flex items-center gap-2 cursor-pointer text-sm">
                            {mode.icon}
                            {mode.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Preferred Activities</Label>
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
                  <Label htmlFor="specialRequests" className="text-sm">
                    Special Requests or Additional Information
                  </Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Any special requirements, dietary restrictions, accessibility needs, or other preferences..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Custom Tour Request"}
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Our travel experts will contact you within 24 hours
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
