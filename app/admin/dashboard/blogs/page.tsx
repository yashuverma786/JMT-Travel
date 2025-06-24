"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload" // Import FileUpload

interface Blog {
  _id: string
  title: string
  author: string
  content: string
  category: string
  imageUrl: string // This will now be populated by FileUpload
  tags: string[]
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState<Omit<Blog, "_id" | "createdAt" | "updatedAt">>({
    title: "",
    author: "",
    content: "",
    category: "General",
    imageUrl: "",
    tags: [],
    status: "draft",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      category: blog.category,
      imageUrl: blog.imageUrl,
      tags: blog.tags || [],
      status: blog.status,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setBlogs(blogs.filter((b) => b._id !== id))
        } else {
          const errorData = await response.json()
          alert(errorData.message || "Failed to delete blog post.")
        }
      } catch (error) {
        console.error("Error deleting blog post:", error)
        alert("An error occurred while deleting the blog post.")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingBlog ? `/api/admin/blogs/${editingBlog._id}` : "/api/admin/blogs"
      const method = editingBlog ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchBlogs()
        handleCancel()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to save blog post.")
      }
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("An error occurred while saving the blog post.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBlog(null)
    setFormData({
      title: "",
      author: "",
      content: "",
      category: "General",
      imageUrl: "",
      tags: [],
      status: "draft",
    })
  }

  const handleTagsChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }))
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCancel}>
            ← Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{editingBlog ? "Edit Blog Post" : "Add New Blog Post"}</h1>
            <p className="text-gray-600">Create and manage blog content</p>
          </div>
        </div>

        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Blog Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Top 10 Destinations for Solo Travelers"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog content here..."
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Travel Tips, Destination Guides"
                  />
                </div>
                <div>
                  <Label>Blog Post Image</Label>
                  <FileUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url as string })}
                    multiple={false} // Typically one image for a blog post header
                    label="Upload blog image"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Blog image preview"
                        width={100}
                        height={100}
                        className="rounded object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(", ")}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="adventure, solo travel, budget"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : editingBlog ? "Update Blog Post" : "Create Blog Post"}
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
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your website's blog content</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search blogs..."
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
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Author</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Loading blog posts...
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <Image
                          src={blog.imageUrl || "/placeholder.svg"}
                          alt={blog.title}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{blog.title}</td>
                      <td className="p-4 text-gray-600">{blog.author}</td>
                      <td className="p-4 text-gray-600">{blog.category}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(blog._id)}
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
