"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken")
        if (token) {
          console.log("Existing token found, verifying...")

          // Add timeout for the verification check
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

          try {
            const response = await fetch("/api/admin/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (response.ok) {
              console.log("Token still valid, redirecting to dashboard")
              router.push("/admin/dashboard")
              return
            } else {
              console.log("Token invalid, clearing storage")
              localStorage.removeItem("adminToken")
              localStorage.removeItem("adminAuth")
              localStorage.removeItem("adminUser")
            }
          } catch (fetchError) {
            clearTimeout(timeoutId)
            console.error("Token verification failed:", fetchError)
            // Clear potentially corrupted auth data
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminAuth")
            localStorage.removeItem("adminUser")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear potentially corrupted auth data
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminAuth")
        localStorage.removeItem("adminUser")
      }
      setChecking(false)
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("Attempting login for:", username)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      console.log("Login response status:", response.status)

      if (response.ok) {
        console.log("Login successful, storing auth data")
        // Store authentication data
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminAuth", "true")
        localStorage.setItem("adminUser", JSON.stringify(data.user))

        // Small delay to ensure storage is complete
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)
      } else {
        console.error("Login failed:", data.message)
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking existing session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">JMT Travel Admin</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">Default Admin Credentials:</p>
            <div className="space-y-1 text-sm text-blue-800">
              <p>
                <span className="font-medium">Username:</span> Trip.jmt
              </p>
              <p>
                <span className="font-medium">Password:</span> QAZqaz#JMT0202
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
