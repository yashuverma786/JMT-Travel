import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection("blogs").find({}).toArray()
    return NextResponse.json({ blogs })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST a new blog
export async function POST(request: NextRequest) {
  try {
    const blogData = await request.json()
    const { title, author, content, category, imageUrl, tags, status } = blogData

    if (!title || !author || !content) {
      return NextResponse.json({ message: "Missing required blog fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("blogs").insertOne({
      title,
      author,
      content,
      category: category || "General",
      imageUrl: imageUrl || "/placeholder.svg",
      tags: tags || [],
      status: status || "draft", // draft, published
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Blog created successfully",
        blog: { _id: result.insertedId, ...blogData },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
