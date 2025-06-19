"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, ImageIcon, File, Calendar } from "lucide-react"

interface DownloadItem {
  id: string
  name: string
  type: "pdf" | "image" | "document"
  size: string
  category: string
  createdAt: string
  downloads: number
}

export default function DownloadsPage() {
  const [downloads] = useState<DownloadItem[]>([
    {
      id: "1",
      name: "Trip Brochure - Goa Paradise",
      type: "pdf",
      size: "2.4 MB",
      category: "Brochures",
      createdAt: "2024-01-15",
      downloads: 245,
    },
    {
      id: "2",
      name: "Kerala Backwaters Itinerary",
      type: "pdf",
      size: "1.8 MB",
      category: "Itineraries",
      createdAt: "2024-01-14",
      downloads: 189,
    },
    {
      id: "3",
      name: "Rajasthan Photo Gallery",
      type: "image",
      size: "15.2 MB",
      category: "Gallery",
      createdAt: "2024-01-13",
      downloads: 67,
    },
    {
      id: "4",
      name: "Travel Insurance Guide",
      type: "document",
      size: "890 KB",
      category: "Guides",
      createdAt: "2024-01-12",
      downloads: 156,
    },
    {
      id: "5",
      name: "Booking Terms & Conditions",
      type: "pdf",
      size: "1.2 MB",
      category: "Legal",
      createdAt: "2024-01-11",
      downloads: 89,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "image":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = (item: DownloadItem) => {
    // Frontend-only download trigger
    const link = document.createElement("a")
    link.href = "#" // In real implementation, this would be the actual file URL
    link.download = item.name
    link.click()

    // Show download notification (optional)
    alert(`Downloading: ${item.name}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Downloads</h1>
          <p className="text-gray-600">Manage downloadable files and resources</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Upload New File
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-2xl font-bold text-gray-900">{downloads.length}</p>
              </div>
              <File className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {downloads.reduce((sum, item) => sum + item.downloads, 0)}
                </p>
              </div>
              <Download className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PDF Files</p>
                <p className="text-2xl font-bold text-gray-900">
                  {downloads.filter((item) => item.type === "pdf").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(downloads.map((item) => item.category)).size}
                </p>
              </div>
              <ImageIcon className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Downloads List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getIcon(item.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.createdAt}
                      </span>
                      <span>{item.size}</span>
                      <Badge variant="secondary" className={getTypeColor(item.type)}>
                        {item.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.downloads}</p>
                    <p className="text-xs text-gray-600">downloads</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              Generate Trip Brochure
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <ImageIcon className="w-6 h-6 mb-2" />
              Create Photo Gallery
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <File className="w-6 h-6 mb-2" />
              Export Trip Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
