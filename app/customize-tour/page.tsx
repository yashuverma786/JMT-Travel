"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Mail, MapPin, Users, Sparkles, ListChecks } from "lucide-react"

const activityOptions = [
  "Sightseeing",
  "Adventure Sports",
  "Cultural Tours",
  "Wildlife Safari",
  "Beach Activities",
  "Shopping",
  "Nightlife",
  "Relaxation & Spa",
]

export default function CustomizeTourPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    destination: "",
    tripType: "",
    departureDate: "",
    duration: "",
    adults: 1,
    children: 0,
    accommodation: "Standard",
    transportation: "Standard",
    budget: "",
    activities: [] as string[],
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.fullName.trim()) errors.fullName = "Full name is required."
    if (!formData.email.trim()) errors.email = "Email is required."
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid."
    if (!formData.phone.trim()) errors.phone = "Phone number is required."
    if (!formData.destination.trim()) errors.destination = "Preferred destination is required."
    if (!formData.tripType) errors.tripType = "Trip type is required."
    if (formData.adults < 1) errors.adults = "At least one adult is required."
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "adults" || name === "children" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleActivityChange = (activity: string) => {
    setFormData((prev) => {
      const newActivities = prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity]
      return { ...prev, activities: newActivities }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setSubmissionStatus(null)
    try {
      const response = await fetch("/api/admin/custom-requests", {
        // Using the admin endpoint for now
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmissionStatus("success")
        setFormData({
          // Reset form
          fullName: "",
          email: "",
          phone: "",
          destination: "",
          tripType: "",
          departureDate: "",
          duration: "",
          adults: 1,
          children: 0,
          accommodation: "Standard",
          transportation: "Standard",
          budget: "",
          activities: [],
          specialRequests: "",
        })
      } else {
        setSubmissionStatus("error")
      }
    } catch (error) {
      setSubmissionStatus("error")
      console.error("Failed to submit custom tour request:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 py-8 md:py-12">
      <div className="container max-w-3xl">
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <CardTitle className="text-3xl font-bold">Create Your Dream Trip!</CardTitle>
            </div>
            <p className="opacity-90 mt-1">
              Fill out the form below and let our experts craft a personalized itinerary for you.
            </p>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            {submissionStatus === "success" && (
              <div className="p-4 bg-green-100 text-green-700 rounded-md text-center">
                Your request has been submitted successfully! Our team will contact you shortly.
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
                There was an error submitting your request. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <User />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name*</Label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address*</Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number*</Label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
                </div>
              </section>

              {/* Trip Details */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <MapPin />
                  Trip Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="destination">Preferred Destination*</Label>
                    <Input
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="e.g., Goa, Kerala, Paris"
                    />
                    {formErrors.destination && <p className="text-red-500 text-xs mt-1">{formErrors.destination}</p>}
                  </div>
                  <div>
                    <Label htmlFor="tripType">Trip Type*</Label>
                    <Select
                      name="tripType"
                      value={formData.tripType}
                      onValueChange={(value) => handleSelectChange("tripType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leisure">Leisure</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Honeymoon">Honeymoon</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Group">Group</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.tripType && <p className="text-red-500 text-xs mt-1">{formErrors.tripType}</p>}
                  </div>
                  <div>
                    <Label htmlFor="departureDate">Preferred Departure Date</Label>
                    <Input name="departureDate" type="date" value={formData.departureDate} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="duration">Trip Duration (e.g., 7 days)</Label>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g., 7 days, 2 weeks"
                    />
                  </div>
                </div>
              </section>

              {/* Group Size */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <Users />
                  Group Size
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adults">Number of Adults*</Label>
                    <Input name="adults" type="number" min="1" value={formData.adults} onChange={handleChange} />
                    {formErrors.adults && <p className="text-red-500 text-xs mt-1">{formErrors.adults}</p>}
                  </div>
                  <div>
                    <Label htmlFor="children">Number of Children (0-12 yrs)</Label>
                    <Input name="children" type="number" min="0" value={formData.children} onChange={handleChange} />
                  </div>
                </div>
              </section>

              {/* Preferences */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <ListChecks />
                  Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="accommodation">Accommodation Type</Label>
                    <Select
                      name="accommodation"
                      value={formData.accommodation}
                      onValueChange={(value) => handleSelectChange("accommodation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Budget">Budget</SelectItem>
                        <SelectItem value="Standard">Standard (3-star)</SelectItem>
                        <SelectItem value="Comfort">Comfort (4-star)</SelectItem>
                        <SelectItem value="Luxury">Luxury (5-star)</SelectItem>
                        <SelectItem value="Boutique">Boutique/Resort</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transportation">Transportation Mode</Label>
                    <Select
                      name="transportation"
                      value={formData.transportation}
                      onValueChange={(value) => handleSelectChange("transportation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transportation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Economy">Economy (Public/Shared)</SelectItem>
                        <SelectItem value="Standard">Standard (Private Car)</SelectItem>
                        <SelectItem value="Comfort">Comfort (SUV/Van)</SelectItem>
                        <SelectItem value="Luxury">Luxury (Premium Car)</SelectItem>
                        <SelectItem value="Flights">Include Flights</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="budget">Estimated Budget (per person, ₹)</Label>
                    <Input
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="e.g., 20000 - 50000"
                    />
                  </div>
                </div>
              </section>

              {/* Activities */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <Sparkles />
                  Preferred Activities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {activityOptions.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={formData.activities.includes(activity)}
                        onCheckedChange={() => handleActivityChange(activity)}
                      />
                      <Label htmlFor={activity} className="text-sm font-normal">
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Special Requests */}
              <section>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-gray-700">
                  <Mail />
                  Special Requests
                </h3>
                <Textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Any specific needs, preferences, or occasions (e.g., anniversary, dietary restrictions)"
                  rows={4}
                />
              </section>

              <Button
                type="submit"
                className="w-full text-lg py-3 bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get My Custom Quote"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
