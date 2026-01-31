"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Loader2, ArrowLeft, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(email, password)
      router.push("/admin")
    } catch {
      setError("Email o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-black transform rotate-12 shadow-[0_0_30px_rgba(226,255,0,0.4)]">
            <Trophy className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            <span className="ef-gradient-text text-5xl">eScabionetta</span>
          </h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs mt-2">Acceso Administrador</p>
        </div>

        <div className="ef-card p-8 md:p-10 backdrop-blur-xl bg-white/[0.02] border-white/10 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Oficial</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@scabionetta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary transition-all font-bold placeholder:opacity-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary transition-all font-bold pr-12"
                />
                <Lock className="absolute right-4 top-4 h-6 w-6 text-white/20" />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <p className="text-sm font-bold text-accent text-center italic uppercase leading-none">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-14 bg-primary text-black hover:bg-white font-black italic uppercase tracking-tighter text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(226,255,0,0.2)]" disabled={loading}>
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <Button asChild variant="ghost" className="text-white/40 hover:text-white transition-colors">
              <Link href="/" className="flex items-center gap-2 font-bold uppercase italic text-xs tracking-widest">
                <ArrowLeft className="h-4 w-4" />
                Regresar a la cancha
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

