import { NextResponse } from "next/server"
import { checkPermissions } from "@/lib/auth-middleware"

export async function GET(request: Request) {
  const permissionError = await checkPermissions(request, ["manage_transfers"])
  if (permissionError) return permissionError

  try {
    // Your GET logic here
    return NextResponse.json({ message: "GET Transfers" }, { status: 200 })
  } catch (error) {
    console.error("Error in GET:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const permissionError = await checkPermissions(request, ["manage_transfers"])
  if (permissionError) return permissionError

  try {
    // Your POST logic here
    const body = await request.json() // Assuming you're sending JSON data
    return NextResponse.json({ message: "POST Transfers", data: body }, { status: 201 })
  } catch (error) {
    console.error("Error in POST:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
