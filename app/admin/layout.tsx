"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          console.log("No token found, redirecting to login")
          router.push("/admin")
          return
        }

        console.log("Token found, verifying with server...")

        // Add timeout to prevent hanging
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        try {
          const response = await fetch("/api/admin/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            console.log("Token verified successfully")
            setIsAuthenticated(true)
          } else {
            console.log("Token verification failed:", response.status)
            // Token is invalid, clear storage and redirect
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminAuth")
            localStorage.removeItem("adminUser")
            router.push("/admin")
          }
        } catch (fetchError) {
          clearTimeout(timeoutId)

          if (fetchError.name === "AbortError") {
            console.error("Token verification timed out")
            setError("Authentication check timed out. Please try again.")
          } else {
            console.error("Token verification network error:", fetchError)
            // For network errors, try to continue with cached auth if available
            const cachedAuth = localStorage.getItem("adminAuth")
            if (cachedAuth === "true") {
              console.log("Using cached authentication due to network error")
              setIsAuthenticated(true)
            } else {
              setError("Network error during authentication check")
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Authentication check failed")
        // Clear potentially corrupted auth data
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminUser")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  // Handle retry
  const handleRetry = () => {
    setLoading(true)
    setError("")
    // Trigger re-check
    window.location.reload()
  }

  // Handle manual login redirect
  const goToLogin = () => {
    localStorage.clear()
    router.push("/admin")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
          <p className="text-sm text-gray-400 mt-2">This should only take a moment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              Try Again
            </Button>
            <Button onClick={goToLogin} variant="outline" className="w-full">
              Go to Login
            </Button>
          </div>
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
          <Button onClick={goToLogin}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
