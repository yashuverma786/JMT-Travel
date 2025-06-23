"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  preferredDestination?: string
  tripType?: string
  travelDates?: string
  groupSize?: number
  budget?: string
  activities?: string[]
  specialRequests?: string
  status: "new" | "contacted" | "converted" | "rejected"
  createdAt: string
  updatedAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [formData, setFormData] = useState<Omit<Lead, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    email: "",
    phone: "",
    preferredDestination: undefined,
    tripType: undefined,
    travelDates: undefined,
    groupSize: undefined,
    budget: undefined,
    activities: [],
    specialRequests: undefined,
    status: "new",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/leads")
      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads)
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      preferredDestination: lead.preferredDestination || "",
      tripType: lead.tripType || "",
      travelDates: lead.travelDates || "",
      groupSize: lead.groupSize || undefined,
      budget: lead.budget || "",
      activities: lead.activities || [],
      specialRequests: lead.specialRequests || "",
      status: lead.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        const response = await fetch(`/api/admin/leads/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setLeads(leads.filter((l) => l._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete lead.")
        }
      } catch (error) {
        console.error("Error deleting lead:", error)
        alert("An error occurred while deleting the lead.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingLead ? `/api/admin/leads/${editingLead._id}` : "/api/admin/leads"
      const method = editingLead ? "PUT" : "POST"

      const payload = {
        ...formData,
        groupSize: formData.groupSize === 0 ? undefined : formData.groupSize, // Handle 0 as undefined for optional number fields
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchLeads() // Re-fetch all leads to update the list
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save lead.")
      }
    } catch (error) {
      console.error("Error saving lead:", error)
      alert("An error occurred while saving the lead.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingLead(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredDestination: undefined,
      tripType: undefined,
      travelDates: undefined,
      groupSize: undefined,
      budget: undefined,
      activities: [],
      specialRequests: undefined,
      status: "new",
    })
  }

  const handleActivitiesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }))
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{editingLead ? "Edit Lead" : "Add New Lead"}</h1>
            <p className="text-gray-600">Manage customer inquiries and custom tour requests</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Lead Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Customer Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDestination">Preferred Destination (Optional)</Label>
                  <Input
                    id="preferredDestination"
                    value={formData.preferredDestination || ""}
                    onChange={(e) => setFormData({ ...formData, preferredDestination: e.target.value })}
                    placeholder="e.g., Maldives, Europe"
                  />
                </div>
                <div>
                  <Label htmlFor="tripType">Trip Type (Optional)</Label>
                  <Input
                    id="tripType"
                    value={formData.tripType || ""}
                    onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                    placeholder="e.g., Honeymoon, Adventure"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="travelDates">Travel Dates (Optional)</Label>
                  <Input
                    id="travelDates"
                    value={formData.travelDates || ""}
                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                    placeholder="e.g., Dec 2024, Flexible"
                  />
                </div>
                <div>
                  <Label htmlFor="groupSize">Group Size (Optional)</Label>
                  <Input
                    id="groupSize"
                    type="number"
                    value={formData.groupSize || ""}
                    onChange={(e) => setFormData({ ...formData, groupSize: Number(e.target.value) || undefined })}
                    placeholder="e.g., 2 adults, 1 child"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget (Optional)</Label>
                  <Input
                    id="budget"
                    value={formData.budget || ""}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., $2000 - $3000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="activities">Activities (comma-separated, Optional)</Label>
                <Textarea
                  id="activities"
                  value={formData.activities?.join(", ") || ""}
                  onChange={(e) => handleActivitiesChange(e.target.value)}
                  placeholder="Snorkeling, Hiking, City Tour"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests || ""}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Any specific requirements or preferences"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "new" | "contacted" | "converted" | "rejected") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingLead ? "Update Lead" : "Create Lead"}
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
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage custom tour requests and customer inquiries</p>
        </div>
        {/* No "Add Lead" button as leads are typically generated from frontend forms */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
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
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Destination</th>
                  <th className="text-left p-4">Trip Type</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Created At</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading leads...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4 text-gray-600">
                        {lead.email}
                        <br />
                        {lead.phone}
                      </td>
                      <td className="p-4 text-gray-600">{lead.preferredDestination || "N/A"}</td>
                      <td className="p-4 text-gray-600">{lead.tripType || "N/A"}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "contacted"
                                ? "bg-purple-100 text-purple-800"
                                : lead.status === "converted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(lead)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(lead._id)}
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
