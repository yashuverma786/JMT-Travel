"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  label: string
  value: string | string[]
  onChange: (url: string | string[]) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
}

export function FileUpload({
  label,
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  maxFiles = 5,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "jmt_travel")
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvimun8pn")

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvimun8pn"}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.secure_url) {
        return data.secure_url
      } else {
        throw new Error("No secure URL returned from Cloudinary")
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error)
      throw error
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const currentUrls = Array.isArray(value) ? value : value ? [value] : []

    // Check file limits
    if (multiple && currentUrls.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setUploading(true)
    try {
      if (multiple) {
        const uploadPromises = Array.from(files).map(uploadToCloudinary)
        const urls = await Promise.all(uploadPromises)
        onChange([...currentUrls, ...urls])
      } else {
        const url = await uploadToCloudinary(files[0])
        onChange(url)
      }
    } catch (error) {
      console.error("Upload error:", error)
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
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
        ) : (
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        )}

        <p className="text-gray-600 mb-4">
          {uploading
            ? "Uploading images..."
            : `Drag and drop ${multiple ? "images" : "an image"} here, or click to select`}
        </p>

        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, "-")}`}
          disabled={uploading}
        />

        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, "-")}`)?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </>
          )}
        </Button>

        {multiple && (
          <p className="text-xs text-gray-500 mt-2">
            {currentImages.length}/{maxFiles} files uploaded
          </p>
        )}
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
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => removeImage(url)}
                disabled={uploading}
              >
                <X className="w-3 h-3" />
              </Button>
              {index === 0 && multiple && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">Primary</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
