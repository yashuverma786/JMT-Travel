"use client"

import type React from "react"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Gift, Plane, MapPin, Calendar, Users, Phone, Mail } from "lucide-react"

interface LeadGenerationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeadGenerationPopup({ isOpen, onClose }: LeadGenerationPopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    travelers: "",
    budget: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)

    // Auto close after success
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  const popupContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {isSuccess ? (
          // Success State
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your inquiry has been submitted successfully. Our travel expert will contact you within 24 hours with a
              personalized quote.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">🎉 Special Offer Unlocked!</p>
              <p className="text-green-700 text-sm mt-1">Get 15% off on your first booking with us!</p>
            </div>
          </div>
        ) : (
          // Form State
          <>
            <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">🌟 Exclusive Travel Deal!</CardTitle>
                <p className="text-blue-100">Get personalized quotes & save up to 30% on your dream vacation</p>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
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
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 9876543210"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Preferred Destination
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("destination", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goa">Goa</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="himachal">Himachal Pradesh</SelectItem>
                        <SelectItem value="kashmir">Kashmir</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="travelDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Travel Date
                    </Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => handleInputChange("travelDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="travelers">No. of Travelers</Label>
                    <Select onValueChange={(value) => handleInputChange("travelers", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
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
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-25k">Under ₹25,000</SelectItem>
                        <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                        <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="100k-200k">₹1,00,000 - ₹2,00,000</SelectItem>
                        <SelectItem value="200k+">₹2,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Special Requirements</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your preferences, special occasions, or any specific requirements..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Limited Time Offer!</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✅ Free travel consultation worth ₹2,000</li>
                    <li>✅ Up to 30% discount on selected packages</li>
                    <li>✅ Complimentary travel insurance</li>
                    <li>✅ 24/7 customer support during your trip</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Get My Personalized Quote 🚀"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our Terms & Conditions and Privacy Policy. No spam, we promise!
                  🤝
                </p>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )

  return typeof window !== "undefined" ? createPortal(popupContent, document.body) : null
}
