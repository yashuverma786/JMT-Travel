"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { Plus, Minus, Star, Calculator, X, ArrowLeft } from "lucide-react"

interface Destination {
  _id: string
  name: string
  country: string
}

interface TripFormProps {
  trip?: any
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function TripForm({ trip, onSubmit, onCancel, isLoading }: TripFormProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [formData, setFormData] = useState({
    title: "",
    destinationId: "",
    tripType: "",
    status: "draft",
    durationDays: 0,
    durationNights: 0,
    minPax: 1,
    maxPax: 10,
    adultPrice: 0,
    salePrice: 0,
    childPrice: 0,
    description: "",
    highlights: [""],
    inclusions: [""],
    exclusions: [""],
    itinerary: [{ day: 1, title: "", description: "" }],
    featuredImage: "",
    galleryImages: [],
    isTrending: false,
  })

  const [discountPercentage, setDiscountPercentage] = useState(0)

  useEffect(() => {
    fetchDestinations()
    if (trip) {
      setFormData({
        title: trip.title || "",
        destinationId: trip.destinationId || "",
        tripType: trip.tripType || "",
        status: trip.status || "draft",
        durationDays: trip.durationDays || 0,
        durationNights: trip.durationNights || 0,
        minPax: trip.minPax || 1,
        maxPax: trip.maxPax || 10,
        adultPrice: trip.adultPrice || 0,
        salePrice: trip.salePrice || 0,
        childPrice: trip.childPrice || 0,
        description: trip.description || "",
        highlights: trip.highlights || [""],
        inclusions: trip.inclusions || [""],
        exclusions: trip.exclusions || [""],
        itinerary: trip.itinerary || [{ day: 1, title: "", description: "" }],
        featuredImage: trip.featuredImage || "",
        galleryImages: trip.galleryImages || [],
        isTrending: trip.isTrending || false,
      })
    }
  }, [trip])

  useEffect(() => {
    // Calculate discount percentage
    if (formData.adultPrice > 0 && formData.salePrice > 0 && formData.salePrice < formData.adultPrice) {
      const discount = ((formData.adultPrice - formData.salePrice) / formData.adultPrice) * 100
      setDiscountPercentage(Math.round(discount))
    } else {
      setDiscountPercentage(0)
    }
  }, [formData.adultPrice, formData.salePrice])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/admin/destinations")
      if (response.ok) {
        const data = await response.json()
        setDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error("Error fetching destinations:", error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_: any, i: number) => i !== index),
      }))
    }
  }

  const handleItineraryChange = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item: any, i: number) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }],
    }))
  }

  const removeItineraryDay = (index: number) => {
    if (formData.itinerary.length > 1) {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.filter((_: any, i: number) => i !== index),
      }))
    }
  }

  const handleGalleryUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url],
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_: string, i: number) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Title is required")
      return
    }

    if (!formData.destinationId) {
      alert("Please select a destination")
      return
    }

    if (formData.durationDays <= 0) {
      alert("Duration days must be greater than 0")
      return
    }

    if (formData.adultPrice <= 0) {
      alert("Adult price must be greater than 0")
      return
    }

    if (formData.salePrice <= 0) {
      alert("Sale price must be greater than 0")
      return
    }

    // Clean up empty array items
    const cleanedData = {
      ...formData,
      highlights: formData.highlights.filter((item) => item.trim() !== ""),
      inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
      exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
      itinerary: formData.itinerary.filter((item) => item.title.trim() !== "" || item.description.trim() !== ""),
      discountPercentage,
    }

    try {
      await onSubmit(cleanedData)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error saving trip. Please try again.")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{trip ? "Edit Trip" : "Create New Trip"}</h1>
        </div>
        {discountPercentage > 0 && (
          <Badge className="bg-red-500 text-white text-lg px-3 py-1">{discountPercentage}% OFF Preview</Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title (H1) *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter trip title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Select
                      value={formData.destinationId}
                      onValueChange={(value) => handleInputChange("destinationId", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest._id} value={dest._id}>
                            {dest.name}, {dest.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tripType">Trip Type</Label>
                    <Select value={formData.tripType} onValueChange={(value) => handleInputChange("tripType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Honeymoon">Honeymoon</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Nature">Nature</SelectItem>
                        <SelectItem value="Pilgrimage">Pilgrimage</SelectItem>
                        <SelectItem value="Wildlife">Wildlife</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="days">Days *</Label>
                    <Input
                      id="days"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => handleInputChange("durationDays", Number.parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nights">Nights *</Label>
                    <Input
                      id="nights"
                      type="number"
                      value={formData.durationNights}
                      onChange={(e) => handleInputChange("durationNights", Number.parseInt(e.target.value) || 0)}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="minPax">Min Pax</Label>
                    <Input
                      id="minPax"
                      type="number"
                      value={formData.minPax}
                      onChange={(e) => handleInputChange("minPax", Number.parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPax">Max Pax</Label>
                    <Input
                      id="maxPax"
                      type="number"
                      value={formData.maxPax}
                      onChange={(e) => handleInputChange("maxPax", Number.parseInt(e.target.value) || 10)}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={formData.isTrending}
                    onCheckedChange={(checked) => handleInputChange("isTrending", checked)}
                  />
                  <Label htmlFor="trending">Mark as Trending (for Special Offers)</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="adultPrice">Adult Price (₹) *</Label>
                    <Input
                      id="adultPrice"
                      type="number"
                      value={formData.adultPrice}
                      onChange={(e) => handleInputChange("adultPrice", Number.parseInt(e.target.value) || 0)}
                      placeholder="Original price"
                      min="0"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Original cost price</p>
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange("salePrice", Number.parseInt(e.target.value) || 0)}
                      placeholder="Selling price"
                      min="0"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Customer pays this amount</p>
                  </div>
                  <div>
                    <Label htmlFor="childPrice">Child Price (₹)</Label>
                    <Input
                      id="childPrice"
                      type="number"
                      value={formData.childPrice}
                      onChange={(e) => handleInputChange("childPrice", Number.parseInt(e.target.value) || 0)}
                      placeholder="Child price"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional child pricing</p>
                  </div>
                </div>

                {discountPercentage > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-green-800">Discount Preview</h4>
                        <p className="text-sm text-green-600">
                          Customers save ₹{(formData.adultPrice - formData.salePrice).toLocaleString()} per person
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {discountPercentage}% OFF
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Pricing Display Preview</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-900">₹{formData.salePrice.toLocaleString()}</span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ₹{formData.adultPrice.toLocaleString()}
                        </span>
                        <Badge variant="destructive">{discountPercentage}% OFF</Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 mt-1">per person</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Description & Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter trip description"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Highlights</Label>
                  {formData.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={highlight}
                        onChange={(e) => handleArrayChange("highlights", index, e.target.value)}
                        placeholder="Enter highlight"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("highlights", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem("highlights")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                <div>
                  <Label>Inclusions</Label>
                  {formData.inclusions.map((inclusion: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={inclusion}
                        onChange={(e) => handleArrayChange("inclusions", index, e.target.value)}
                        placeholder="Enter inclusion"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("inclusions", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem("inclusions")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inclusion
                  </Button>
                </div>

                <div>
                  <Label>Exclusions</Label>
                  {formData.exclusions.map((exclusion: string, index: number) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={exclusion}
                        onChange={(e) => handleArrayChange("exclusions", index, e.target.value)}
                        placeholder="Enter exclusion"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("exclusions", index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => addArrayItem("exclusions")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exclusion
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.map((day: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Day {day.day}</h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeItineraryDay(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                        placeholder="Day title"
                      />
                      <Textarea
                        value={day.description}
                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                        placeholder="Day description"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItineraryDay}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onUpload={(url) => handleInputChange("featuredImage", url)}
                  currentImage={formData.featuredImage}
                />
                <p className="text-sm text-gray-500 mt-2">This image will be used as the main image for trip cards</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gallery Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUpload onUpload={handleGalleryUpload} />

                {formData.galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.galleryImages.map((image: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">Additional images for the trip gallery</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}
          </Button>
        </div>
      </form>
    </div>
  )
}
