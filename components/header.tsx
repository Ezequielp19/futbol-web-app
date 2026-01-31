"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, Shield, Trophy } from "lucide-react"

export function Header() {
  const { user, isAdmin, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-xl">
      <div className="container max-w-4xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-black transform group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(226,255,0,0.3)]">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl italic uppercase tracking-tighter leading-none">Scabionetta</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none mt-1">Football Club</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="secondary" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-bold uppercase italic tracking-tighter">
                  <Link href="/admin">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    <span className="hidden sm:inline">Panel Admin</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => signOut()} className="hover:text-accent transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </>
          ) : (
            <Button asChild variant="secondary" size="sm" className="bg-primary text-black hover:bg-white font-bold uppercase italic tracking-tighter rounded-xl px-6">
              <Link href="/login">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

