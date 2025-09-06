"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminProvider } from "@/components/admin/admin-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Skip auth check for login page completely
    if (pathname === "/admin") {
      setIsAuthenticated(null) // No auth needed for login page
      return
    }

    // Only check auth for dashboard routes
    if (pathname.startsWith("/admin/dashboard")) {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("admin-token") || getCookie("admin-token")

          if (!token) {
            setIsAuthenticated(false)
            router.replace("/admin")
            return
          }

          const response = await fetch("/api/admin/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
            localStorage.removeItem("admin-token")
            router.replace("/admin")
          }
        } catch (error) {
          console.error("Auth check error:", error)
          setIsAuthenticated(false)
          router.replace("/admin")
        }
      }

      checkAuth()
    }
  }, [pathname, router])

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return null
  }

  // Login page - no auth check needed
  if (pathname === "/admin") {
    return (
      <AdminProvider>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </AdminProvider>
    )
  }

  // Dashboard routes - check auth
  if (pathname.startsWith("/admin/dashboard")) {
    if (isAuthenticated === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (isAuthenticated === false) {
      return null // Will redirect to login
    }

    return (
      <AdminProvider>
        <div className="min-h-screen bg-gray-50">{children}</div>
      </AdminProvider>
    )
  }

  // Other admin routes
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">{children}</div>
    </AdminProvider>
  )
}
