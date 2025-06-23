"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check for login page
      if (pathname === "/admin") {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("adminToken")
        if (!token) {
          router.push("/admin")
          return
        }

        // Verify token with server
        const response = await fetch("/api/admin/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          setIsAuthenticated(true)
        } else {
          // Token is invalid, clear storage and redirect
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminAuth")
          localStorage.removeItem("adminUser")
          router.push("/admin")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Authentication check failed")
        // Clear potentially corrupted auth data
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminUser")
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Show login page
  if (pathname === "/admin") {
    return <>{children}</>
  }

  // Show dashboard content only if authenticated
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
