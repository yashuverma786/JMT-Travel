"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  email: string
  username: string
  role: string
  permissions: string[]
}

interface AdminContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  apiCall: (url: string, options?: RequestInit) => Promise<Response>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem("admin-token")
    if (savedToken) {
      setToken(savedToken)
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          setToken(tokenToVerify)
          setIsAuthenticated(true)
          localStorage.setItem("admin-token", tokenToVerify)
        } else {
          throw new Error("Invalid response")
        }
      } else {
        throw new Error("Token verification failed")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      // Clear invalid token
      localStorage.removeItem("admin-token")
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem("admin-token", data.token)

        // Redirect to dashboard
        router.push("/admin/dashboard")

        return { success: true }
      } else {
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Network error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout API error:", error)
    }

    // Clear local state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("admin-token")

    // Redirect to login
    router.push("/admin")
  }

  const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // If unauthorized, logout
    if (response.status === 401) {
      logout()
    }

    return response
  }

  const value: AdminContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
    apiCall,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
