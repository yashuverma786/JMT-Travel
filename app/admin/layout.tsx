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
      const checkAuth = () => {
        const authCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("jmt_admin_auth="))
          ?.split("=")[1]

        if (authCookie === "true") {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.replace("/admin")
        }
      }

      checkAuth()
    }
  }, [pathname, router])

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
