"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Credenciales de admin hardcodeadas
const ADMIN_EMAIL = "admin@admin.com"
const ADMIN_PASSWORD = "123456"

interface AdminUser {
  email: string
}

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesion guardada en localStorage
    const savedUser = localStorage.getItem("admin_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Verificar credenciales hardcodeadas
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email }
      setUser(adminUser)
      localStorage.setItem("admin_user", JSON.stringify(adminUser))
    } else {
      throw new Error("Credenciales incorrectas")
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem("admin_user")
  }

  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
