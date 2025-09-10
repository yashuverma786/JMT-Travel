import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_blogs"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })

    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      blog: {
        ...blog,
        _id: blog._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_blogs"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const updateData = await request.json()
    const { db } = await connectToDatabase()

    const updatedBlog = {
      title: updateData.title,
      author: updateData.author,
      content: updateData.content,
      category: updateData.category || "General",
      imageUrl: updateData.imageUrl || "/placeholder.svg",
      tags: updateData.tags || [],
      status: updateData.status || "draft",
      updatedAt: new Date(),
    }

    const result = await db.collection("blogs").updateOne({ _id: new ObjectId(id) }, { $set: updatedBlog })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
    }

    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog: {
        ...blog,
        _id: blog._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authCheck = await checkPermissions(request, ["manage_blogs"])
  if (authCheck) return authCheck

  try {
    const { id } = params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
