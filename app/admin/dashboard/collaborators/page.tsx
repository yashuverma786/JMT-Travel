"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Collaborator {
  _id: string
  name: string
  email: string
  company: string
  role: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  updatedAt: string
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCollaborator, setEditingCollaborator] = useState<Collaborator | null>(null)
  const [formData, setFormData] = useState<Omit<Collaborator, "_id" | "createdAt" | "updatedAt">>({
    name: "",
    email: "",
    company: "",
    role: "Partner",
    status: "active",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCollaborators()
  }, [])

  const fetchCollaborators = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/collaborators")
      if (response.ok) {
        const data = await response.json()
        setCollaborators(data.collaborators)
      }
    } catch (error) {
      console.error("Error fetching collaborators:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCollaborators = collaborators.filter(
    (collab) =>
      collab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (collaborator: Collaborator) => {
    setEditingCollaborator(collaborator)
    setFormData({
      name: collaborator.name,
      email: collaborator.email,
      company: collaborator.company,
      role: collaborator.role,
      status: collaborator.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this collaborator?")) {
      try {
        const response = await fetch(`/api/admin/collaborators/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setCollaborators(collaborators.filter((c) => c._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete collaborator.")
        }
      } catch (error) {
        console.error("Error deleting collaborator:", error)
        alert("An error occurred while deleting the collaborator.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingCollaborator
        ? `/api/admin/collaborators/${editingCollaborator._id}`
        : "/api/admin/collaborators"
      const method = editingCollaborator ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCollaborators() // Re-fetch all collaborators to update the list
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save collaborator.")
      }
    } catch (error) {
      console.error("Error saving collaborator:", error)
      alert("An error occurred while saving the collaborator.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCollaborator(null)
    setFormData({
      name: "",
      email: "",
      company: "",
      role: "Partner",
      status: "active",
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
              {editingCollaborator ? "Edit Collaborator" : "Add New Collaborator"}
            </h1>
            <p className="text-gray-600">Manage your partners and collaborators</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Collaborator Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Doe"
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
                  placeholder="e.g., john.doe@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g., ABC Hotels"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Hotel Manager, Tour Operator"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive" | "pending") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingCollaborator ? "Update Collaborator" : "Create Collaborator"}
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
          <h1 className="text-3xl font-bold text-gray-900">Collaborators</h1>
          <p className="text-gray-600">Manage your business partners and external contributors</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Collaborator
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search collaborators..."
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
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Company</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading collaborators...
                    </td>
                  </tr>
                ) : filteredCollaborators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No collaborators found.
                    </td>
                  </tr>
                ) : (
                  filteredCollaborators.map((collab) => (
                    <tr key={collab._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{collab.name}</td>
                      <td className="p-4 text-gray-600">{collab.email}</td>
                      <td className="p-4 text-gray-600">{collab.company}</td>
                      <td className="p-4 text-gray-600">{collab.role}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collab.status === "active"
                              ? "bg-green-100 text-green-800"
                              : collab.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {collab.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(collab)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(collab._id)}
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
