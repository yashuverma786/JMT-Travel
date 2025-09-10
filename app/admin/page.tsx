"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, User, Lock, Loader2 } from "lucide-react"
import { useAdmin } from "@/components/admin/admin-context"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminCreated, setAdminCreated] = useState(false)
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null)

  const { login, user, isAuthenticated } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated, redirecting to dashboard")
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("Login form submitted with:", { email, password: "***" })

    if (!email || !password) {
      setError("Please enter both email and password")
      setLoading(false)
      return
    }

    try {
      const result = await login(email, password)
      console.log("Login result:", result)

      if (!result.success) {
        setError(result.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const createAdminUser = async () => {
    try {
      setLoading(true)
      setError("")

      console.log("Creating admin user...")

      const response = await fetch("/api/seed-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("Seed admin response:", data)

      if (data.success) {
        setAdminCreated(true)
        setCredentials(data.credentials)
        setError("")
      } else {
        setError(data.message || "Failed to create admin user")
      }
    } catch (error) {
      console.error("Create admin error:", error)
      setError("Failed to create admin user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fillCredentials = () => {
    if (credentials) {
      setEmail(credentials.email)
      setPassword(credentials.password)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">JMT Travel Admin</CardTitle>
          <CardDescription>Sign in to access the JMT Travel admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminCreated && credentials && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p>Admin user created successfully!</p>
                  <div className="text-sm">
                    <p>
                      <strong>Email:</strong> {credentials.email}
                    </p>
                    <p>
                      <strong>Password:</strong> {credentials.password}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={fillCredentials} className="mt-2 bg-transparent">
                    Fill Login Form
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading || !email || !password}
            >
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

          <div className="text-center">
            <Button
              type="button"
              variant="outline"
              onClick={createAdminUser}
              disabled={loading}
              className="w-full bg-transparent"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Admin User"
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Need help? Create an admin user first, then use the provided credentials to login.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
