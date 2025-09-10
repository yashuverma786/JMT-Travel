"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  username: string
  role: string
  permissions: string[]
}

interface AdminContextType {
  user: User | null
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  apiCall: (url: string, options?: RequestInit) => Promise<Response>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error("Auth verification failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (userData: User) => {
    setUser(userData)
    localStorage.setItem("admin_user", JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("admin_user")
    }
  }

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, defaultOptions)

    if (response.status === 401) {
      setUser(null)
      localStorage.removeItem("admin_user")
      window.location.href = "/admin"
    }

    return response
  }

  return <AdminContext.Provider value={{ user, login, logout, loading, apiCall }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
