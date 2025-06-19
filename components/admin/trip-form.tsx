"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Upload, ArrowLeft } from "lucide-react"

interface TripFormProps {
  trip?: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function TripForm({ trip, onSave, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState({
    title: trip?.title || "",
    image: trip?.image || "",
    adultPrice: trip?.adultPrice || "",
    childPrice: trip?.childPrice || "",
    overview: trip?.overview || "",
    itinerary: trip?.itinerary || [{ day: 1, title: "", description: "" }],
    includes: trip?.includes || [],
    excludes: trip?.excludes || [],
    transport: trip?.transport || "",
    language: trip?.language || "",
    groupSize: trip?.groupSize || "",
    difficulty: trip?.difficulty || "",
    mapUrl: trip?.mapUrl || "",
    faqs: trip?.faqs || [{ question: "", answer: "" }],
  })

  const [includesInput, setIncludesInput] = useState("")
  const [excludesInput, setExcludesInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, title: "", description: "" }],
    })
  }

  const removeItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    })
  }

  const updateItinerary = (index: number, field: string, value: string) => {
    const updated = formData.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData({ ...formData, itinerary: updated })
  }

  const addInclude = () => {
    if (includesInput.trim()) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includesInput.trim()],
      })
      setIncludesInput("")
    }
  }

  const addExclude = () => {
    if (excludesInput.trim()) {
      setFormData({
        ...formData,
        excludes: [...formData.excludes, excludesInput.trim()],
      })
      setExcludesInput("")
    }
  }

  const removeInclude = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index),
    })
  }

  const removeExclude = (index: number) => {
    setFormData({
      ...formData,
      excludes: formData.excludes.filter((_, i) => i !== index),
    })
  }

  const addFAQ = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: "", answer: "" }],
    })
  }

  const removeFAQ = (index: number) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter((_, i) => i !== index),
    })
  }

  const updateFAQ = (index: number, field: string, value: string) => {
    const updated = formData.faqs.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData({ ...formData, faqs: updated })
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
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Trip Title (H1)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter trip title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image Upload</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL or upload"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adultPrice">Adult Price (₹)</Label>
                    <Input
                      id="adultPrice"
                      type="number"
                      value={formData.adultPrice}
                      onChange={(e) => setFormData({ ...formData, adultPrice: e.target.value })}
                      placeholder="Adult price"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="childPrice">Child Price (₹)</Label>
                    <Input
                      id="childPrice"
                      type="number"
                      value={formData.childPrice}
                      onChange={(e) => setFormData({ ...formData, childPrice: e.target.value })}
                      placeholder="Child price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="overview">Overview</Label>
                  <Textarea
                    id="overview"
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Trip overview and description"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Itinerary</CardTitle>
                  <Button type="button" onClick={addItineraryDay} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Day
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

          <TabsContent value="inclusions" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Includes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add inclusion"
                      value={includesInput}
                      onChange={(e) => setIncludesInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                    />
                    <Button type="button" onClick={addInclude}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.includes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeInclude(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Excludes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add exclusion"
                      value={excludesInput}
                      onChange={(e) => setExcludesInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclude())}
                    />
                    <Button type="button" onClick={addExclude}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.excludes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeExclude(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trip Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transport">Transport</Label>
                    <Select
                      value={formData.transport}
                      onValueChange={(value) => setFormData({ ...formData, transport: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Select
                      value={formData.groupSize}
                      onValueChange={(value) => setFormData({ ...formData, groupSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4">2-4 People</SelectItem>
                        <SelectItem value="5-10">5-10 People</SelectItem>
                        <SelectItem value="10-20">10-20 People</SelectItem>
                        <SelectItem value="20+">20+ People</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="extreme">Extreme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mapUrl">Google Map URL</Label>
                  <Input
                    id="mapUrl"
                    value={formData.mapUrl}
                    onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                    placeholder="Google Maps embed URL"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <Button type="button" onClick={addFAQ} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">FAQ {index + 1}</h4>
                      {formData.faqs.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeFAQ(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, "question", e.target.value)}
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{trip ? "Update Trip" : "Create Trip"}</Button>
        </div>
      </form>
    </div>
  )
}
