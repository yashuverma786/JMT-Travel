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
import { FileUpload } from "@/components/ui/file-upload"
import { Plus, X, Save, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface TripFormProps {
  trip?: any
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export default function TripForm({ trip, onSubmit, isLoading }: TripFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    description: "",
    price: "",
    salePrice: "",
    durationDays: "",
    durationNights: "",
    category: "",
    imageUrls: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    itinerary: [] as { day: number; title: string; description: string }[],
    activities: [] as string[],
    bestTimeToVisit: "",
    groupSize: "",
    difficulty: "",
    highlights: [] as string[],
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [newHighlight, setNewHighlight] = useState("")
  const [newItineraryDay, setNewItineraryDay] = useState({ day: 1, title: "", description: "" })

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || "",
        destination: trip.destination || "",
        description: trip.description || "",
        price: trip.price?.toString() || "",
        salePrice: trip.salePrice?.toString() || "",
        durationDays: trip.durationDays?.toString() || "",
        durationNights: trip.durationNights?.toString() || "",
        category: trip.category || "",
        imageUrls: trip.imageUrls || [],
        inclusions: trip.inclusions || [],
        exclusions: trip.exclusions || [],
        itinerary: trip.itinerary || [],
        activities: trip.activities || [],
        bestTimeToVisit: trip.bestTimeToVisit || "",
        groupSize: trip.groupSize?.toString() || "",
        difficulty: trip.difficulty || "",
        highlights: trip.highlights || [],
      })
    }
  }, [trip])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, url],
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
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
    if (newItineraryDay.title.trim() && newItineraryDay.description.trim()) {
      setFormData((prev) => ({
        ...prev,
        itinerary: [...prev.itinerary, { ...newItineraryDay }].sort((a, b) => a.day - b.day),
      }))
      setNewItineraryDay({ day: newItineraryDay.day + 1, title: "", description: "" })
    }
  }

  const removeItineraryDay = (index: number) => {
    setFormData((prev) => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== index) }))
  }

  const calculateDiscount = () => {
    const price = Number.parseFloat(formData.price)
    const salePrice = Number.parseFloat(formData.salePrice)
    if (price && salePrice && salePrice < price) {
      return Math.round(((price - salePrice) / price) * 100)
    }
    return 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : null,
      durationDays: Number.parseInt(formData.durationDays),
      durationNights: Number.parseInt(formData.durationNights),
      groupSize: formData.groupSize ? Number.parseInt(formData.groupSize) : null,
    }

    await onSubmit(submitData)
  }

  const discountPercent = calculateDiscount()

  return (
    <div className="max-w-4xl mx-auto p-6">
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
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Trip Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Amazing Goa Beach Holiday"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={formData.destination}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                      placeholder="e.g., Goa, India"
                      required
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Mountain">Mountain</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Wildlife">Wildlife</SelectItem>
                        <SelectItem value="Heritage">Heritage</SelectItem>
                        <SelectItem value="Pilgrimage">Pilgrimage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="durationDays">Duration (Days) *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => handleInputChange("durationDays", e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="durationNights">Duration (Nights) *</Label>
                    <Input
                      id="durationNights"
                      type="number"
                      value={formData.durationNights}
                      onChange={(e) => handleInputChange("durationNights", e.target.value)}
                      placeholder="4"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>Trip Images</Label>
                  <div className="space-y-4">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Trip image ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <FileUpload onUpload={handleImageUpload} />
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Regular Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="25000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => handleInputChange("salePrice", e.target.value)}
                      placeholder="20000"
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty if no discount</p>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Discount Preview</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{Number.parseFloat(formData.salePrice).toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{Number.parseFloat(formData.price).toLocaleString()}
                      </span>
                      <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Customers save ₹
                      {(Number.parseFloat(formData.price) - Number.parseFloat(formData.salePrice)).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      value={formData.groupSize}
                      onChange={(e) => handleInputChange("groupSize", e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange("difficulty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bestTimeToVisit">Best Time to Visit</Label>
                  <Input
                    id="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => handleInputChange("bestTimeToVisit", e.target.value)}
                    placeholder="October to March"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    <div className="flex flex-wrap gap-2">
                      {formData.inclusions.map((inclusion, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {inclusion}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeInclusion(index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    <div className="flex flex-wrap gap-2">
                      {formData.exclusions.map((exclusion, index) => (
                        <Badge key={index} variant="destructive" className="flex items-center gap-1">
                          {exclusion}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeExclusion(index)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="itinerary">
            <Card>
              <CardHeader>
                <CardTitle>Day-wise Itinerary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                  <div className="md:col-span-2">
                    <Label htmlFor="day">Day</Label>
                    <Input
                      id="day"
                      type="number"
                      value={newItineraryDay.day}
                      onChange={(e) =>
                        setNewItineraryDay((prev) => ({ ...prev, day: Number.parseInt(e.target.value) || 1 }))
                      }
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Label htmlFor="dayTitle">Title</Label>
                    <Input
                      id="dayTitle"
                      value={newItineraryDay.title}
                      onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Day title..."
                    />
                  </div>
                  <div className="md:col-span-5">
                    <Label htmlFor="dayDescription">Description</Label>
                    <Input
                      id="dayDescription"
                      value={newItineraryDay.description}
                      onChange={(e) => setNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Day description..."
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button type="button" onClick={addItineraryDay} className="w-full">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.itinerary.map((day, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{day.day}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{day.title}</h4>
                        <p className="text-gray-600">{day.description}</p>
                      </div>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeItineraryDay(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
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
