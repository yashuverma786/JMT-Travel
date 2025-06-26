"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { FileUpload } from "@/components/ui/file-upload"
import { useAdmin } from "@/components/admin/admin-context"
import { PERMISSIONS } from "@/lib/permissions"

interface Transfer {
  _id: string
  type: string
  price: number
  description: string
  images: string[]
  status: "pending" | "approved" | "rejected"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function TransfersAdminPage() {
  const { user } = useAdmin()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null)
  const [formData, setFormData] = useState({
    type: "",
    price: "",
    description: "",
    images: [] as string[],
  })
  const [loading, setLoading] = useState(false)

  const canApprove = user?.permissions?.includes(PERMISSIONS.APPROVE_LISTINGS)
  const canManageTransfers = user?.permissions?.includes(PERMISSIONS.MANAGE_RENTALS)

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/transfers")
      if (response.ok) {
        const data = await response.json()
        setTransfers(data.transfers)
      }
    } catch (error) {
      console.error("Error fetching transfers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransfers = transfers.filter(
    (transfer) =>
      transfer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (transfer: Transfer) => {
    setEditingTransfer(transfer)
    setFormData({
      type: transfer.type,
      price: transfer.price.toString(),
      description: transfer.description,
      images: transfer.images || [],
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transfer?")) {
      try {
        const response = await fetch(`/api/admin/transfers/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setTransfers(transfers.filter((t) => t._id !== id))
        } else {
          alert("Failed to delete transfer.")
        }
      } catch (error) {
        console.error("Error deleting transfer:", error)
        alert("An error occurred.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingTransfer ? `/api/admin/transfers/${editingTransfer._id}` : "/api/admin/transfers"
      const method = editingTransfer ? "PUT" : "POST"

      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        await fetchTransfers()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save transfer.")
      }
    } catch (error) {
      console.error("Error saving transfer:", error)
      alert("An error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (transferId: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/admin/transfers/${transferId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchTransfers()
      } else {
        alert("Failed to update transfer status.")
      }
    } catch (error) {
      console.error("Error updating transfer status:", error)
      alert("An error occurred.")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTransfer(null)
    setFormData({
      type: "",
      price: "",
      description: "",
      images: [],
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
              {editingTransfer ? "Edit Transfer" : "Add New Transfer"}
            </h1>
            <p className="text-gray-600">Manage transfer services</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Transfer Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airport-pickup">Airport Pickup</SelectItem>
                      <SelectItem value="airport-drop">Airport Drop</SelectItem>
                      <SelectItem value="city-transfer">City Transfer</SelectItem>
                      <SelectItem value="intercity">Intercity Transfer</SelectItem>
                      <SelectItem value="car-rental">Car Rental</SelectItem>
                      <SelectItem value="bus-service">Bus Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 1500"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Transfer service description..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <FileUpload
                  label="Transfer Images"
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                  multiple={true}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingTransfer ? "Update Transfer" : "Create Transfer"}
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
          <h1 className="text-3xl font-bold text-gray-900">Transfers Management</h1>
          <p className="text-gray-600">Manage transfer services for your website</p>
        </div>
        {canManageTransfers && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transfer
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transfers..."
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
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Loading transfers...
                    </td>
                  </tr>
                ) : filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No transfers found.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <tr key={transfer._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={transfer.images[0] || "/placeholder.svg?text=Transfer"}
                          alt={transfer.type}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{transfer.type}</td>
                      <td className="p-4 text-gray-600">₹{transfer.price.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            transfer.status === "approved"
                              ? "default"
                              : transfer.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transfer.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {canManageTransfers && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(transfer)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(transfer._id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {canApprove && transfer.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleApproval(transfer._id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(transfer._id, "rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
