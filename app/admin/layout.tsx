"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // For login page, no auth check needed
    if (pathname === "/admin") {
      setLoading(false)
      return
    }

    // Simple auth check for dashboard pages
    const isLoggedIn = localStorage.getItem("jmt_admin_logged_in")
    if (isLoggedIn === "true") {
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      window.location.href = "/admin"
      return
    }

    setLoading(false)
  }, [pathname])

  // Show loading only briefly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login page
  if (pathname === "/admin") {
    return children
  }

  // Show dashboard only if authenticated
  if (isAuthenticated) {
    return children
  }

  // Fallback
  return null
}
