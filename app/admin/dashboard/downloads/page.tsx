"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, ImageIcon, File, Calendar } from "lucide-react"

interface DownloadFile {
  id: string
  name: string
  type: "pdf" | "image" | "document"
  size: string
  downloads: number
  uploadDate: string
  category: string
}

export default function DownloadsPage() {
  const [files] = useState<DownloadFile[]>([
    {
      id: "1",
      name: "Travel Brochure 2024",
      type: "pdf",
      size: "2.5 MB",
      downloads: 245,
      uploadDate: "2024-01-15",
      category: "Brochures",
    },
    {
      id: "2",
      name: "Destination Guide - Goa",
      type: "pdf",
      size: "1.8 MB",
      downloads: 189,
      uploadDate: "2024-01-14",
      category: "Guides",
    },
    {
      id: "3",
      name: "Trip Itinerary Template",
      type: "document",
      size: "0.5 MB",
      downloads: 156,
      uploadDate: "2024-01-13",
      category: "Templates",
    },
    {
      id: "4",
      name: "Kerala Photo Gallery",
      type: "image",
      size: "5.2 MB",
      downloads: 98,
      uploadDate: "2024-01-12",
      category: "Images",
    },
    {
      id: "5",
      name: "Booking Terms & Conditions",
      type: "pdf",
      size: "0.8 MB",
      downloads: 312,
      uploadDate: "2024-01-11",
      category: "Legal",
    },
    {
      id: "6",
      name: "Travel Insurance Guide",
      type: "pdf",
      size: "1.2 MB",
      downloads: 78,
      uploadDate: "2024-01-10",
      category: "Insurance",
    },
  ])

  const handleDownload = (file: DownloadFile) => {
    // Frontend-only download trigger
    const link = document.createElement("a")
    link.href = `/placeholder.pdf?filename=${encodeURIComponent(file.name)}`
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success message
    alert(`Downloading ${file.name}...`)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-600" />
      case "image":
        return <ImageIcon className="w-8 h-8 text-blue-600" />
      case "document":
        return <File className="w-8 h-8 text-green-600" />
      default:
        return <File className="w-8 h-8 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800"
      case "image":
        return "bg-blue-100 text-blue-800"
      case "document":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = [...new Set(files.map((file) => file.category))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Downloads</h1>
          <p className="text-gray-600">Manage downloadable files and resources</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Upload New File
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Files</p>
                <p className="text-3xl font-bold text-gray-900">{files.length}</p>
              </div>
              <File className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {files.reduce((sum, file) => sum + file.downloads, 0)}
                </p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Downloads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(files.reduce((sum, file) => sum + file.downloads, 0) / files.length)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files by Category */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files
                .filter((file) => file.category === category)
                .map((file) => (
                  <Card key={file.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-2 line-clamp-2">{file.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(file.type)}>{file.type.toUpperCase()}</Badge>
                            <span className="text-xs text-gray-500">{file.size}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{file.downloads} downloads</span>
                            <span>{file.uploadDate}</span>
                          </div>
                          <Button size="sm" className="w-full" onClick={() => handleDownload(file)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
