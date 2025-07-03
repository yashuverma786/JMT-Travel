"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { Plus, X, Save, ArrowLeft, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface Destination {
  _id: string
  name: string
  country: string
}

interface TripFormProps {
  trip?: any
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function TripForm({ trip, onSubmit, isLoading }: TripFormProps) {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [formData, setFormData] = useState({
    title: "",
    destinationId: "",
    tripType: "",
    status: "draft",
    durationDays: "",
    durationNights: "",
    minPax: "",
    maxPax: "",
    adultPrice: "",
    salePrice: "",
    childPrice: "",
    description: "",
    featuredImage: "",
    galleryImages: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    itinerary: [] as { day: number; title: string; description: string }[],
    activities: [] as string[],
    highlights: [] as string[],
    isTrending: false,
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [newHighlight, setNewHighlight] = useState("")

  // Fetch destinations on component mount
  useEffect(() => {
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
    fetchDestinations()
  }, [])

  // Load trip data if editing
  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || "",
        destinationId: trip.destinationId || "",
        tripType: trip.tripType || "",
        status: trip.status || "draft",
        durationDays: trip.durationDays?.toString() || "",
        durationNights: trip.durationNights?.toString() || "",
        minPax: trip.minPax?.toString() || "",
        maxPax: trip.maxPax?.toString() || "",
        adultPrice: trip.adultPrice?.toString() || "",
        salePrice: trip.salePrice?.toString() || "",
        childPrice: trip.childPrice?.toString() || "",
        description: trip.description || "",
        featuredImage: trip.featuredImage || "",
        galleryImages: trip.galleryImages || [],
        inclusions: trip.inclusions || [],
        exclusions: trip.exclusions || [],
        itinerary: trip.itinerary || [],
        activities: trip.activities || [],
        highlights: trip.highlights || [],
        isTrending: trip.isTrending || false,
      })
    }
  }, [trip])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Calculate discount percentage automatically
  const calculateDiscount = () => {
    const adult = Number.parseFloat(formData.adultPrice)
    const sale = Number.parseFloat(formData.salePrice)
    if (adult && sale && sale < adult) {
      return Math.round(((adult - sale) / adult) * 100)
    }
    return 0
  }

  const handleFeaturedImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, featuredImage: url }))
  }

  const handleGalleryImageUpload = (url: string) => {
    if (url) {
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, url],
      }))
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }))
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData((prev) => ({ ...prev, inclusions: [...prev.inclusions, newInclusion.trim()] }))
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData((prev) => ({ ...prev, inclusions: prev.inclusions.filter((_, i) => i !== index) }))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, newExclusion.trim()] }))
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData((prev) => ({ ...prev, exclusions: prev.exclusions.filter((_, i) => i !== index) }))
  }

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData((prev) => ({ ...prev, activities: [...prev.activities, newActivity.trim()] }))
      setNewActivity("")
    }
  }

  const removeActivity = (index: number) => {
    setFormData((prev) => ({ ...prev, activities: prev.activities.filter((_, i) => i !== index) }))
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }))
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setFormData((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }))
  }

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "" }],
    }))
  }

  const updateItinerary = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      durationDays: Number.parseInt(formData.durationDays) || 0,
      durationNights: Number.parseInt(formData.durationNights) || 0,
      minPax: Number.parseInt(formData.minPax) || 1,
      maxPax: Number.parseInt(formData.maxPax) || 10,
      adultPrice: Number.parseFloat(formData.adultPrice) || 0,
      salePrice: Number.parseFloat(formData.salePrice) || 0,
      childPrice: Number.parseFloat(formData.childPrice) || 0,
      discountPercentage: calculateDiscount(),
    }

    await onSubmit(submitData)
  }

  const discountPercent = calculateDiscount()
  const selectedDestination = destinations.find((d) => d._id === formData.destinationId)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{trip ? "Edit Trip" : "Create New Trip"}</h1>
        </div>
        {discountPercent > 0 && (
          <Badge className="bg-red-500 text-white text-lg px-3 py-1">{discountPercent}% OFF Preview</Badge>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title (H1) *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Amazing Goa Beach Holiday"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="days">Days *</Label>
                    <Input
                      id="days"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => handleInputChange("durationDays", e.target.value)}
                      placeholder="5"
                      required
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nights">Nights *</Label>
                    <Input
                      id="nights"
                      type="number"
                      value={formData.durationNights}
                      onChange={(e) => handleInputChange("durationNights", e.target.value)}
                      placeholder="4"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minPax">Min Pax</Label>
                    <Input
                      id="minPax"
                      type="number"
                      value={formData.minPax}
                      onChange={(e) => handleInputChange("minPax", e.target.value)}
                      placeholder="2"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPax">Max Pax</Label>
                    <Input
                      id="maxPax"
                      type="number"
                      value={formData.maxPax}
                      onChange={(e) => handleInputChange("maxPax", e.target.value)}
                      placeholder="10"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the trip experience..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={formData.isTrending}
                    onCheckedChange={(checked) => handleInputChange("isTrending", Boolean(checked))}
                  />
                  <Label
                    htmlFor="trending"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as Trending (for Special Offers)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="adultPrice">Adult Price (₹) *</Label>
                    <Input
                      id="adultPrice"
                      type="number"
                      value={formData.adultPrice}
                      onChange={(e) => handleInputChange("adultPrice", e.target.value)}
                      placeholder="25000"
                      required
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Original cost price</p>
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange("salePrice", e.target.value)}
                      placeholder="20000"
                      required
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Selling price to customers</p>
                  </div>
                  <div>
                    <Label htmlFor="childPrice">Child Price (₹)</Label>
                    <Input
                      id="childPrice"
                      type="number"
                      value={formData.childPrice}
                      onChange={(e) => handleInputChange("childPrice", e.target.value)}
                      placeholder="15000"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional child pricing</p>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Discount Preview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Customer Pays</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{Number.parseFloat(formData.salePrice).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Original Price</p>
                        <p className="text-lg text-gray-500 line-through">
                          ₹{Number.parseFloat(formData.adultPrice).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Discount</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-500 text-white text-lg px-3 py-1">{discountPercent}% OFF</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      Customers save ₹
                      {(
                        Number.parseFloat(formData.adultPrice) - Number.parseFloat(formData.salePrice)
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                {discountPercent === 0 && formData.adultPrice && formData.salePrice && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>No discount:</strong> Sale price should be less than adult price to show discount.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Featured Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">This will be the main image displayed on trip cards</p>
                  <FileUpload onUpload={handleFeaturedImageUpload} currentImage={formData.featuredImage} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gallery Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Additional images for the trip gallery</p>

                  {formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {formData.galleryImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <FileUpload onUpload={handleGalleryImageUpload} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inclusions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Inclusions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      placeholder="Add inclusion..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
                    />
                    <Button type="button" onClick={addInclusion}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.inclusions.map((inclusion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <span className="text-sm">{inclusion}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeInclusion(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Exclusions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      placeholder="Add exclusion..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
                    />
                    <Button type="button" onClick={addExclusion}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                        <span className="text-sm">{exclusion}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeExclusion(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="Add activity..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addActivity())}
                    />
                    <Button type="button" onClick={addActivity}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.activities.map((activity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {activity}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeActivity(index)} />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-600">Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add highlight..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                    />
                    <Button type="button" onClick={addHighlight}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((highlight, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {highlight}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeHighlight(index)} />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Day-wise Itinerary</CardTitle>
                  <Button type="button" onClick={addItineraryDay} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">Day {day.day}</span>
                      </h4>
                      <Button type="button" variant="outline" size="sm" onClick={() => removeItineraryDay(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Day title (e.g., Arrival in Goa)"
                        value={day.title}
                        onChange={(e) => updateItinerary(index, "title", e.target.value)}
                      />
                      <Textarea
                        placeholder="Day description and activities..."
                        value={day.description}
                        onChange={(e) => updateItinerary(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}

                {formData.itinerary.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No itinerary added yet. Click "Add Day" to start building the itinerary.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[140px]">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {trip ? "Update Trip" : "Create Trip"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
