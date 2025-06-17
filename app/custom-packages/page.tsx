"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MapPin,
  Users,
  Plane,
  Hotel,
  Car,
  Camera,
  Utensils,
  Mountain,
  Waves,
  Building,
  TreePine,
  Send,
} from "lucide-react"

const destinations = [
  "Goa",
  "Kerala",
  "Rajasthan",
  "Himachal Pradesh",
  "Kashmir",
  "Uttarakhand",
  "Tamil Nadu",
  "Karnataka",
  "Maharashtra",
  "Gujarat",
  "Andhra Pradesh",
  "Other",
]

const interests = [
  { id: "beach", label: "Beach & Water Sports", icon: <Waves className="h-4 w-4" /> },
  { id: "mountain", label: "Mountains & Trekking", icon: <Mountain className="h-4 w-4" /> },
  { id: "heritage", label: "Heritage & Culture", icon: <Building className="h-4 w-4" /> },
  { id: "nature", label: "Nature & Wildlife", icon: <TreePine className="h-4 w-4" /> },
  { id: "adventure", label: "Adventure Sports", icon: <Camera className="h-4 w-4" /> },
  { id: "spiritual", label: "Spiritual & Wellness", icon: <Mountain className="h-4 w-4" /> },
]

const services = [
  { id: "flights", label: "Flight Bookings", icon: <Plane className="h-4 w-4" /> },
  { id: "hotels", label: "Hotel Accommodation", icon: <Hotel className="h-4 w-4" /> },
  { id: "transport", label: "Local Transportation", icon: <Car className="h-4 w-4" /> },
  { id: "meals", label: "Meal Arrangements", icon: <Utensils className="h-4 w-4" /> },
  { id: "guide", label: "Tour Guide", icon: <Users className="h-4 w-4" /> },
  { id: "activities", label: "Activities & Excursions", icon: <Camera className="h-4 w-4" /> },
]

export default function CustomPackagesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "",
    budget: "",
    interests: [] as string[],
    services: [] as string[],
    specialRequests: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interestId] : prev.interests.filter((id) => id !== interestId),
    }))
  }

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked ? [...prev.services, serviceId] : prev.services.filter((id) => id !== serviceId),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your custom package request. Our travel experts will contact you within 24 hours with a
              personalized itinerary.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  destination: "",
                  startDate: "",
                  endDate: "",
                  travelers: "",
                  budget: "",
                  interests: [],
                  services: [],
                  specialRequests: "",
                })
              }}
              className="w-full"
            >
              Create Another Package
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Custom Package
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your dream vacation and we'll create a personalized itinerary just for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="travelers">Number of Travelers *</Label>
                <Select
                  value={formData.travelers}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, travelers: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Person</SelectItem>
                    <SelectItem value="2">2 People</SelectItem>
                    <SelectItem value="3-5">3-5 People</SelectItem>
                    <SelectItem value="6-10">6-10 People</SelectItem>
                    <SelectItem value="10+">10+ People</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Travel Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Travel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="destination">Preferred Destination *</Label>
                <Select
                  value={formData.destination}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, destination: value }))}
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
                <Label htmlFor="budget">Budget Range (per person) *</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
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
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interests.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                    />
                    <Label htmlFor={interest.id} className="flex items-center gap-2 cursor-pointer">
                      {interest.icon}
                      {interest.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Required Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                    />
                    <Label htmlFor={service.id} className="flex items-center gap-2 cursor-pointer">
                      {service.icon}
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Tell us about any special requirements, dietary restrictions, accessibility needs, or specific activities you'd like to include..."
                value={formData.specialRequests}
                onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-3 text-lg"
            >
              {isSubmitting ? "Submitting..." : "Create My Custom Package"}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Our travel experts will contact you within 24 hours with a personalized quote
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
