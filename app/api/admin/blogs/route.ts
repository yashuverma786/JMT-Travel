import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_blogs"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      blogs: blogs.map((blog) => ({
        ...blog,
        _id: blog._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_blogs"])
  if (authCheck) return authCheck

  try {
    const blogData = await request.json()
    const { title, author, content, category, imageUrl, tags, status } = blogData

    if (!title || !author || !content) {
      return NextResponse.json({ success: false, message: "Missing required blog fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const newBlog = {
      title,
      author,
      content,
      category: category || "General",
      imageUrl: imageUrl || "/placeholder.svg",
      tags: tags || [],
      status: status || "draft", // draft, published
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("blogs").insertOne(newBlog)
    const createdBlog = await db.collection("blogs").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog: {
          ...createdBlog,
          _id: createdBlog._id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
