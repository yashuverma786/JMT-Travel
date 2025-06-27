"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

interface FileUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  accept?: string
  maxSize?: number
}

export function FileUpload({ onUpload, currentImage, accept = "image/*", maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "jmt_travel")

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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setProgress(0)

      try {
        // Create preview
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)

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

        // Upload to Cloudinary
        const url = await uploadToCloudinary(file)

        clearInterval(progressInterval)
        setProgress(100)

        onUpload(url)

        // Clean up preview URL
        URL.revokeObjectURL(previewUrl)
      } catch (error) {
        console.error("Upload error:", error)
        setPreview(null)
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple: false,
  })

  const removeImage = () => {
    setPreview(null)
    onUpload("")
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
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
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <ImageIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
              </p>
              <p className="text-sm text-gray-500">or click to select a file</p>
            </div>
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  )
}

// keep default export so existing imports keep working
export default FileUpload
