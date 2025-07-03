"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  accept?: string
  maxSize?: number
}

export function FileUpload({ onUpload, currentImage, accept = "image/*", maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadToCloudinary = async (file: File) => {
    const cloudName = "dvimun8pn"
    const uploadPreset = "jmt_travel"

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
    formData.append("cloud_name", cloudName)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Upload failed with status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.secure_url) {
        throw new Error("No secure URL returned from Cloudinary")
      }

      return data.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw error
    }
  }

  const handleUpload = useCallback(
    async (file: File) => {
      setError(null)

      if (file.size > maxSize) {
        setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
        return
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      setUploading(true)
      setUploadProgress(0)

      try {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)

        const url = await uploadToCloudinary(file)

        clearInterval(progressInterval)
        setUploadProgress(100)

        setTimeout(() => {
          onUpload(url)
          setUploading(false)
          setUploadProgress(0)
        }, 500)
      } catch (error) {
        console.error("Upload error:", error)
        setError(error instanceof Error ? error.message : "Upload failed. Please try again.")
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [maxSize, onUpload],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleUpload(e.dataTransfer.files[0])
      }
    },
    [handleUpload],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    setError(null)
    onUpload("")
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${uploading ? "pointer-events-none opacity-50" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin mx-auto">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading image...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-700">Drag and drop your image here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPG, PNG, GIF (Max: {Math.round(maxSize / (1024 * 1024))}MB)
                </p>
              </div>
              <input type="file" accept={accept} onChange={handleFileSelect} className="hidden" id="file-upload" />
              <Button type="button" variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
