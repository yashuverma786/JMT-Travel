"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleFileUpload = async (file: File) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const url = await uploadToCloudinary(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setTimeout(() => {
        onUpload(url)
        setUploadProgress(0)
        setUploading(false)
      }, 500)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
      setUploading(false)
      setUploadProgress(0)
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    onUpload("")
  }

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt="Uploaded image"
            width={300}
            height={200}
            className="rounded-lg object-cover w-full h-48"
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
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileSelect} className="hidden" />

          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin mx-auto">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">Upload an image</p>
                <p className="text-sm text-gray-500">Drag and drop or click to select</p>
              </div>
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Select Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FileUpload
