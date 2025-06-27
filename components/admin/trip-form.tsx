"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FileUpload from "@/components/ui/file-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TripFormProps {
  trip?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function TripForm({ trip, onSubmit, onCancel, isLoading }: TripFormProps) {
  const [formData, setFormData] = useState({
    title: trip?.title || "",
    overview: trip?.overview || "",
    destinationName: trip?.destinationName || "",
    durationDays: trip?.durationDays || "",
    groupSize: trip?.groupSize || "",
    normalPrice: trip?.normalPrice || "",
    salePrice: trip?.salePrice || "",
    imageUrls: trip?.imageUrls || [],
    inclusions: trip?.inclusions || [],
    exclusions: trip?.exclusions || [],
    itinerary: trip?.itinerary || [],
    difficulty: trip?.difficulty || "easy",
    category: trip?.category || "adventure",
    status: trip?.status || "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }))
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
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trip Image</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onUpload={handleImageUpload} currentImage={formData.imageUrls[0]} accept="image/*" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.inclusions.map((inclusion, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={inclusion}
                onChange={(e) => updateInclusion(index, e.target.value)}
                placeholder="What's included in this trip?"
              />
              <Button type="button" variant="outline" onClick={() => removeInclusion(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addInclusion}>
            Add Inclusion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exclusions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.exclusions.map((exclusion, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={exclusion}
                onChange={(e) => updateExclusion(index, e.target.value)}
                placeholder="What's not included in this trip?"
              />
              <Button type="button" variant="outline" onClick={() => removeExclusion(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addExclusion}>
            Add Exclusion
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
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

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : trip ? "Update Trip" : "Create Trip"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
