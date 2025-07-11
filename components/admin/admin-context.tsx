"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  _id: string
  email: string
  role: string
  permissions: string[]
}

interface AdminContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
  apiCall: (url: string, options?: RequestInit) => Promise<Response>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem("admin-token") || getCookie("admin-token")
    if (savedToken) {
      setToken(savedToken)
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return null
  }

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("/api/admin/auth/verify", {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(tokenToVerify)
        localStorage.setItem("admin-token", tokenToVerify)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("admin-token")
        document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("admin-token")
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("admin-token", data.token)
        return { success: true }
      } else {
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Network error occurred" }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("admin-token")
    document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/admin"
  }

  const apiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  const value: AdminContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
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
