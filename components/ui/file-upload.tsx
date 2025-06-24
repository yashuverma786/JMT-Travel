"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  label: string
  value: string | string[]
  onChange: (url: string | string[]) => void
  multiple?: boolean
  accept?: string
}

export function FileUpload({ label, value, onChange, multiple = false, accept = "image/*" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "jmt_travel") // You'll need to create this in Cloudinary
    formData.append("cloud_name", "your_cloud_name") // Replace with your Cloudinary cloud name

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Upload failed:", error)
      throw error
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      if (multiple) {
        const uploadPromises = Array.from(files).map(uploadToCloudinary)
        const urls = await Promise.all(uploadPromises)
        const currentUrls = Array.isArray(value) ? value : []
        onChange([...currentUrls, ...urls])
      } else {
        const url = await uploadToCloudinary(files[0])
        onChange(url)
      }
    } catch (error) {
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove))
    } else {
      onChange("")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const currentImages = Array.isArray(value) ? value : value ? [value] : []

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">Drag and drop {multiple ? "images" : "an image"} here, or click to select</p>
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id={`file-upload-${label}`}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Select Files"}
        </Button>
      </div>

      {/* Image Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(url)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
