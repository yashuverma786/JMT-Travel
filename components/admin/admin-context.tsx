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
    console.log("AdminProvider mounted, checking for existing token...")
    checkExistingAuth()
  }, [])

  const checkExistingAuth = async () => {
    try {
      // Check localStorage first
      const savedToken = localStorage.getItem("admin-token")
      console.log("Saved token found:", savedToken ? "Yes" : "No")

      if (savedToken) {
        await verifyToken(savedToken)
      } else {
        // Check cookies as fallback
        await verifyToken()
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyToken = async (tokenToVerify?: string) => {
    try {
      console.log("Verifying token...")

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (tokenToVerify) {
        headers.Authorization = `Bearer ${tokenToVerify}`
      }

      const response = await fetch("/api/admin/auth/verify", {
        method: "GET",
        headers,
        credentials: "include",
      })

      console.log("Verify response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Verify response data:", data)

        if (data.success && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
          if (tokenToVerify) {
            setToken(tokenToVerify)
            localStorage.setItem("admin-token", tokenToVerify)
          }
          console.log("User authenticated successfully")
        } else {
          throw new Error("Invalid response format")
        }
      } else {
        throw new Error(`Verification failed: ${response.status}`)
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      // Clear invalid auth state
      clearAuthState()
    }
  }

  const clearAuthState = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("admin-token")
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      console.log("Attempting login for:", email)

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)

      const data = await response.json()
      console.log("Login response data:", data)

      if (response.ok && data.success) {
        setUser(data.user)
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem("admin-token", data.token)

        console.log("Login successful, user set:", data.user)

        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)

        return { success: true }
      } else {
        console.log("Login failed:", data.message)
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
      console.log("Logging out...")

      if (token) {
        await fetch("/api/admin/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
      }
    } catch (error) {
      console.error("Logout API error:", error)
    }

    // Clear local state
    clearAuthState()
    console.log("Logout complete, redirecting...")
    router.push("/admin")
  }

  const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    })

    // If unauthorized, logout
    if (response.status === 401) {
      console.log("API call returned 401, logging out...")
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
