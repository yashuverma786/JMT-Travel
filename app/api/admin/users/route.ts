import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { checkPermissions } from "@/lib/auth-middleware"
import bcrypt from "bcryptjs"
import { ROLES_PERMISSIONS, type PermissionValue } from "@/lib/permissions"

export async function GET(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_users"])
  if (authCheck) return authCheck

  try {
    const { db } = await connectToDatabase()

    const users = await db
      .collection("admin_users")
      .find(
        {},
        {
          projection: { password: 0 }, // Exclude password from response
        },
      )
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await checkPermissions(request, ["manage_users"])
  if (authCheck) return authCheck

  try {
    const userData = await request.json()
    const { username, email, password, role, status } = userData

    if (!username || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Validate role - only allow these specific roles
    const allowedRoles = ["super_admin", "admin", "hotel_manager", "transfer_manager", "trip_manager"]
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role specified" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("admin_users").findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this username or email already exists" },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Explicitly set permissions based on role
    const assignedPermissions: PermissionValue[] = ROLES_PERMISSIONS[role] || []

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      permissions: assignedPermissions,
      status: status || "active",
      createdAt: new Date(),
      lastLogin: null,
    }

    const result = await db.collection("admin_users").insertOne(newUser)

    // Return user without password
    const { password: _, ...userResponse } = newUser

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: {
          ...userResponse,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
