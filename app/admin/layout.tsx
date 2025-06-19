"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuth")
      if (authStatus === "true") {
        setIsAuthenticated(true)
      } else if (pathname !== "/admin") {
        router.push("/admin")
      }
      setLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin") {
    return null
  }

  return <>{children}</>
}
