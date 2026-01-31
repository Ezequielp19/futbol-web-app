"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, HandHelping, Info, Calendar, User, Shield, Hand } from "lucide-react"
import type { PlayerWithStats } from "@/lib/types"
import { AVAILABLE_TRAITS } from "@/lib/constants"

interface PlayerCardProps {
  player: PlayerWithStats
  rank: number
  showMonth?: string
  customTrigger?: React.ReactNode
}

export function PlayerCard({ player, rank, showMonth, customTrigger }: PlayerCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const stats = showMonth && player.monthlyStats[showMonth]
    ? player.monthlyStats[showMonth]
    : {
      goals: player.totalGoals,
      assists: player.totalAssists,
      cleanSheets: player.totalCleanSheets,
      saves: player.totalSaves,
      points: player.totalPoints
    }

  const isPortero = player.traits?.includes("portero")

  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const playerTraits = player.traits?.map(tId =>
    AVAILABLE_TRAITS.find(at => at.id === tId)
  ).filter(t => !!t) || []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <div className="ef-card group cursor-pointer hover:scale-[1.01] transition-all">
            {/* Card Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-colors" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full -ml-12 -mb-12 blur-2xl" />
            {player.isLegendary && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-500/5 rounded-[2rem] border-2 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)] pointer-events-none animate-pulse-slow" />
            )}

            {/* Card Body */}
            <div className="relative p-4 md:p-6 flex items-center gap-4 md:gap-8">
              {/* Rank Badge */}
              <div className={`
                flex flex-col items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-xl border-2 italic font-black text-xl md:text-2xl 
                ${rank === 1 ? "bg-primary border-primary text-black shadow-[0_0_15px_rgba(226,255,0,0.5)]" :
                  rank === 2 ? "bg-white/10 border-white/20 text-white" :
                    rank === 3 ? "bg-accent border-accent text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]" :
                      "bg-secondary/50 border-white/5 text-muted-foreground opacity-70"
                }
              `}>
                <span className="leading-none">{rank}</span>
                <span className="text-[10px] uppercase tracking-tighter not-italic mt-0.5 opacity-80">POS</span>
              </div>

              {/* Player Photo */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                <Avatar className={`h-16 w-16 md:h-24 md:w-24 border-2 p-1 bg-white/[0.02] ${player.isLegendary ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-white/10'}`}>
                  <AvatarImage src={player.photoUrl || "/placeholder.svg"} alt={player.name} className="object-cover rounded-full" />
                  <AvatarFallback className={`${player.isLegendary ? 'bg-yellow-500/20 text-yellow-500' : 'bg-secondary text-primary'} font-black text-xl md:text-2xl`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">
                    {player.name}
                  </h3>
                  <div className="hidden md:flex gap-1">
                    {playerTraits.slice(0, 3).map(trait => (
                      <span key={trait.id} className="text-lg" title={trait.label}>{trait.icon}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {player.isLegendary ? (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-[12px] font-black italic uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center gap-1">
                      LEYENDA <Trophy className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none">
                      {stats.points} PTS
                    </span>
                  )}
                  {player.description && (
                    <>
                      <div className="hidden md:block h-1 w-1 bg-white/20 rounded-full" />
                      <span className="hidden md:block text-[10px] font-bold text-white/30 uppercase tracking-tighter">
                        {player.description}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              {!player.isLegendary && (
                <div className="flex gap-4 md:gap-8 pr-2">
                  {isPortero ? (
                    <>
                      <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black italic leading-none text-primary">{stats.cleanSheets || 0}</p>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-tighter text-nowrap">Vallas</p>
                      </div>
                      <div className="w-[1px] h-10 bg-white/5" />
                      <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black italic leading-none text-white">{stats.saves || 0}</p>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-tighter text-nowrap">Atajadas</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black italic leading-none text-primary">{stats.goals}</p>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Goles</p>
                      </div>
                      <div className="w-[1px] h-10 bg-white/5" />
                      <div className="text-center">
                        <p className="text-2xl md:text-4xl font-black italic leading-none text-white">{stats.assists}</p>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Asist.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Futuristic Lines */}
            <div className="absolute bottom-0 right-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/10 rounded-[2rem] md:rounded-[2.5rem] w-[95vw] sm:max-w-2xl p-0 overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] outline-none scrollbar-hide">
        <div className="relative">
          {/* Header/Banner */}
          <div className="h-32 md:h-48 bg-gradient-to-br from-secondary to-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px] -ml-24 -mb-24" />
          </div>

          {/* Profile Overlay */}
          <div className="relative px-4 md:px-8 -mt-16 md:-mt-24 pb-20 md:pb-12">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full opacity-50 transition-opacity" />
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background bg-secondary rounded-[1.5rem] md:rounded-[2rem] relative z-10 p-1">
                  <AvatarImage src={player.photoUrl || "/placeholder.svg"} className="object-cover rounded-[1.3rem] md:rounded-[1.8rem]" />
                  <AvatarFallback className="text-4xl md:text-5xl font-black italic text-primary">{initials}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 mb-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <Badge className="bg-primary text-black font-black italic uppercase px-4 py-1 rounded-lg"># {rank} GLOBAL</Badge>
                  {playerTraits.map(t => (
                    <span key={t.id} className="text-2xl" title={t.label}>{t.icon}</span>
                  ))}
                </div>
                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter ef-gradient-text leading-tight md:leading-none mb-2">
                  {player.name}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-3 text-white/40 font-bold uppercase tracking-widest text-xs">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> Player ID: {player.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {new Date(player.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Bio/Description - Order 2 on mobile, Order 1 on desktop */}
              <div className="md:col-span-2 space-y-6 order-2 md:order-1">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                    <Info className="h-4 w-4" /> Biografía Oficial
                  </h4>
                  <p className="text-lg text-white/80 font-medium italic leading-relaxed">
                    {player.description || "Este jugador prefiere que su fútbol hable por él. No hay descripción disponible todavía."}
                  </p>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary mb-4">
                    Rasgos Especiales
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {playerTraits.length > 0 ? playerTraits.map(trait => (
                      <div key={trait.id} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                        <span className="text-xl">{trait.icon}</span>
                        <span className="font-bold italic uppercase tracking-tighter">{trait.label}</span>
                      </div>
                    )) : (
                      <p className="text-white/20 text-sm font-bold italic uppercase">Aún no se han asignado rasgos...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Summary - Order 1 on mobile, Order 2 on desktop */}
              <div className="space-y-4 order-1 md:order-2">
                {!player.isLegendary && (
                  <>
                    <div className="bg-primary text-black rounded-[2rem] p-6 text-center shadow-[0_20px_40px_rgba(226,255,0,0.15)]">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Puntos</p>
                      <p className="text-6xl font-black italic leading-none">{player.totalPoints}</p>
                    </div>

                    <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex justify-around">
                      {isPortero ? (
                        <>
                          <div className="text-center">
                            <p className="text-3xl font-black italic text-primary leading-none">{player.totalCleanSheets}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase mt-1">Vallas Inv.</p>
                          </div>
                          <div className="w-[1px] h-full bg-white/10 mx-2" />
                          <div className="text-center">
                            <p className="text-3xl font-black italic text-white leading-none">{player.totalSaves}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase mt-1">Atajadas</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <p className="text-3xl font-black italic text-primary leading-none">{player.totalGoals}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase mt-1">Goles</p>
                          </div>
                          <div className="w-[1px] h-full bg-white/10 mx-2" />
                          <div className="text-center">
                            <p className="text-3xl font-black italic text-white leading-none">{player.totalAssists}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase mt-1">Asist.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className="bg-accent/10 border border-accent/20 rounded-[2rem] p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-accent mb-1">
                    <Trophy className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Estado</span>
                  </div>
                  <p className="text-xl font-black italic uppercase text-white">
                    {player.isLegendary ? "RETIRADO (LEYENDA)" : "ACTIVO"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

