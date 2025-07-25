"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"

interface Activity {
  _id: string
  name: string
  description: string
  imageUrl: string
  category: string
  createdAt: string
  updatedAt: string
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState<Omit<Activity, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    imageUrl: "",
    category: "General",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/activities")
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities)
      }
    } catch (error) {
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredActivities = activities.filter(
    (activity) =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setFormData({
      name: activity.name,
      description: activity.description,
      imageUrl: activity.imageUrl,
      category: activity.category,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        const response = await fetch(`/api/admin/activities/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setActivities(activities.filter((a) => a._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete activity.")
        }
      } catch (error) {
        console.error("Error deleting activity:", error)
        alert("An error occurred while deleting the activity.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingActivity ? `/api/admin/activities/${editingActivity._id}` : "/api/admin/activities"
      const method = editingActivity ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchActivities() // Re-fetch all activities to update the list
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save activity.")
      }
    } catch (error) {
      console.error("Error saving activity:", error)
      alert("An error occurred while saving the activity.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingActivity(null)
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      category: "General",
    })
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingActivity ? "Edit Activity" : "Add New Activity"}
            </h1>
            <p className="text-gray-600">Manage activities for your trips</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Scuba Diving, Hiking"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A brief description of the activity"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/activity-image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Water Sports, Adventure, Cultural"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingActivity ? "Update Activity" : "Create Activity"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Manage activities that can be part of your trips</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Image</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Loading activities...
                    </td>
                  </tr>
                ) : filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity) => (
                    <tr key={activity._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={activity.imageUrl || "/placeholder.svg"}
                          alt={activity.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{activity.name}</td>
                      <td className="p-4 text-gray-600">{activity.category}</td>
                      <td className="p-4 text-gray-600">{activity.description.substring(0, 50)}...</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(activity._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
