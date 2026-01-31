"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { AdminPanel } from "@/components/admin-panel"
import { Loader2, Settings } from "lucide-react"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
    if (!loading && user && !isAdmin) {
      router.push("/")
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-primary font-black italic uppercase tracking-tighter animate-pulse text-lg">Verificando Credenciales...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-12 flex items-center gap-4 px-2">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
              Panel de Control
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs opacity-60">
              Administración de Plantilla y Estadísticas
            </p>
          </div>
        </div>
        <AdminPanel />
      </main>
    </div>
  )
}

