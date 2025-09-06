"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"

interface FileUploadProps {
  label?: string
  value?: string | string[]
  onChange: (url: string | string[]) => void
  multiple?: boolean
  accept?: string
  maxSize?: number
}

export function FileUpload({
  label = "Upload Image",
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // Use default preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dvimun8pn/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw new Error("Failed to upload image. Please try again.")
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select image files only (JPG, PNG, GIF)")
        }

        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
        }

        return uploadToCloudinary(file)
      })

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const urls = await Promise.all(uploadPromises)

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        if (multiple) {
          const currentUrls = Array.isArray(value) ? value : []
          onChange([...currentUrls, ...urls])
        } else {
          onChange(urls[0])
        }
        setProgress(0)
        setUploading(false)
        setError(null)
      }, 500)
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed. Please try again.")
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const removeImage = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((url) => url !== urlToRemove))
    } else {
      onChange("")
    }
  }

  const currentValue = Array.isArray(value) ? value : value ? [value] : []

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentValue.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentValue.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => removeImage(url)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
          multiple={multiple}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin mx-auto h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            <p className="text-sm text-gray-600">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
          </div>
        ) : (
          <div className="space-y-2">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB</p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Choose File{multiple ? "s" : ""}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
