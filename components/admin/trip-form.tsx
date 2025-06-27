"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TripFormProps {
  trip?: any
  onSave: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TripForm({ trip, onSave, onCancel, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState({
    title: trip?.title || "",
    overview: trip?.overview || "",
    destinationName: trip?.destinationName || "",
    durationDays: trip?.durationDays || "",
    groupSize: trip?.groupSize || "",
    normalPrice: trip?.normalPrice || "",
    salePrice: trip?.salePrice || "",
    imageUrls: trip?.imageUrls || [],
    inclusions: trip?.inclusions || [""],
    exclusions: trip?.exclusions || [""],
    itinerary: trip?.itinerary || [{ day: 1, title: "", description: "" }],
    difficulty: trip?.difficulty || "easy",
    category: trip?.category || "adventure",
    status: trip?.status || "active",
  })

  // Calculate discount percentage
  const discountPercentage =
    (((Number.parseFloat(formData.normalPrice) || 0) - (Number.parseFloat(formData.salePrice) || 0)) /
      (Number.parseFloat(formData.normalPrice) || 1)) *
    100

  const handleSubmit = (e: any) => {
    e.preventDefault()

    // Clean up empty inclusions and exclusions
    const cleanedData = {
      ...formData,
      inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
      exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
      normalPrice: Number.parseFloat(formData.normalPrice) || 0,
      salePrice: Number.parseFloat(formData.salePrice) || null,
    }

    onSave(cleanedData)
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: url ? [url] : [],
    }))
  }

  const addInclusion = () => {
    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, ""],
    }))
  }

  const updateInclusion = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeInclusion = (index: number) => {
    if (formData.inclusions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        inclusions: prev.inclusions.filter((_, i) => i !== index),
      }))
    }
  }

  const addExclusion = () => {
    setFormData((prev) => ({
      ...prev,
      exclusions: [...prev.exclusions, ""],
    }))
  }

  const updateExclusion = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.map((item, i) => (i === index ? value : item)),
    }))
  }

  const removeExclusion = (index: number) => {
    if (formData.exclusions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        exclusions: prev.exclusions.filter((_, i) => i !== index),
      }))
    }
  }

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", description: "" }],
    }))
  }

  const updateItinerary = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const removeItineraryDay = (index: number) => {
    if (formData.itinerary.length > 1) {
      setFormData((prev) => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index),
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{trip ? "Edit Trip" : "Add New Trip"}</h1>
          <p className="text-gray-600">Create or modify travel packages</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Trip Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="destinationName">Destination *</Label>
                    <Input
                      id="destinationName"
                      value={formData.destinationName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, destinationName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="overview">Overview *</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="durationDays">Duration (Days) *</Label>
                    <Input
                      id="durationDays"
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData((prev) => ({ ...prev, durationDays: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                      id="groupSize"
                      value={formData.groupSize}
                      onChange={(e) => setFormData((prev) => ({ ...prev, groupSize: e.target.value }))}
                      placeholder="e.g., 2-8 people"
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="difficult">Difficult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Trip Image *</Label>
                  <FileUpload onUpload={handleImageUpload} currentImage={formData.imageUrls[0]} accept="image/*" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="normalPrice">Regular Price (₹) *</Label>
                    <Input
                      id="normalPrice"
                      type="number"
                      value={formData.normalPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, normalPrice: e.target.value }))}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salePrice">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, salePrice: e.target.value }))}
                      placeholder="Leave empty if no discount"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be less than regular price to show discount</p>
                  </div>
                </div>

                {discountPercentage > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">{Math.round(discountPercentage)}% OFF</Badge>
                      <span className="text-green-700 font-medium">
                        Discount Preview: Save ₹
                        {(
                          Number.parseFloat(formData.normalPrice) - Number.parseFloat(formData.salePrice)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inclusions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-green-600">Inclusions</CardTitle>
                    <Button type="button" onClick={addInclusion} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.inclusions.map((inclusion, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={inclusion}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        placeholder="What's included?"
                      />
                      {formData.inclusions.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeInclusion(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-red-600">Exclusions</CardTitle>
                    <Button type="button" onClick={addExclusion} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.exclusions.map((exclusion, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={exclusion}
                        onChange={(e) => updateExclusion(index, e.target.value)}
                        placeholder="What's not included?"
                      />
                      {formData.exclusions.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeExclusion(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Day-wise Itinerary</CardTitle>
                  <Button type="button" onClick={addItineraryDay} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Day
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.map((day, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Day {day.day}</h4>
                      {formData.itinerary.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeItineraryDay(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Day title"
                        value={day.title}
                        onChange={(e) => updateItinerary(index, "title", e.target.value)}
                      />
                      <Textarea
                        placeholder="Day description"
                        value={day.description}
                        onChange={(e) => updateItinerary(index, "description", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="beach">Beach</SelectItem>
                        <SelectItem value="cultural">Cultural</SelectItem>
                        <SelectItem value="nature">Nature</SelectItem>
                        <SelectItem value="spiritual">Spiritual</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="honeymoon">Honeymoon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
