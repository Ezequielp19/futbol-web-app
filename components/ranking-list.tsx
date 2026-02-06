"use client"

import { useState } from "react"
import { usePlayersWithStats } from "@/hooks/use-firebase-data"
import { getAvailableMonths, formatMonth } from "@/hooks/use-firebase-data"
import { PlayerCard } from "@/components/player-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, TrendingUp } from "lucide-react"

import { Podium } from "@/components/podium"

type SortOption = "goals" | "assists" | "points" | "missedGoals"

export function RankingList() {
  const { players, loading, error } = usePlayersWithStats()
  const selectedMonth = "global"

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-primary font-black italic uppercase tracking-tighter animate-pulse">Cargando Datos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-24 bg-destructive/10 rounded-3xl border border-destructive/20">
        <p className="text-destructive font-bold uppercase tracking-widest text-sm">Error de Conexión</p>
        <p className="text-white/60 mt-1">No se pudo conectar con el servidor.</p>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-24 bg-secondary/20 rounded-3xl border border-white/5">
        <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Sin Datos Registrados</p>
      </div>
    )
  }

  const getSortedPlayers = (sortBy: SortOption) => {
    return [...players].sort((a, b) => {
      const aStats = a.monthlyStats[selectedMonth] || { goals: 0, assists: 0, points: 0, cleanSheets: 0, saves: 0, missedGoals: 0 }
      const bStats = b.monthlyStats[selectedMonth] || { goals: 0, assists: 0, points: 0, cleanSheets: 0, saves: 0, missedGoals: 0 }

      if (sortBy === "goals") return bStats.goals - aStats.goals
      if (sortBy === "assists") return bStats.assists - aStats.assists
      if (sortBy === "missedGoals") return bStats.missedGoals - aStats.missedGoals
      return bStats.points - aStats.points
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Ranking Global</h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">Clasificación de rendimiento</p>
          </div>
        </div>

      </div>

      <Tabs defaultValue="points" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-secondary/30 p-1.5 h-16 rounded-2xl border border-white/5 mb-8">
          <TabsTrigger value="points" className="rounded-xl font-black italic uppercase tracking-tighter text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Puntos</TabsTrigger>
          <TabsTrigger value="goals" className="rounded-xl font-black italic uppercase tracking-tighter text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Goles</TabsTrigger>
          <TabsTrigger value="assists" className="rounded-xl font-black italic uppercase tracking-tighter text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Asistencias</TabsTrigger>
          <TabsTrigger value="missedGoals" className="rounded-xl font-black italic uppercase tracking-tighter text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">Errados</TabsTrigger>
        </TabsList>

        <div className="transition-all duration-500">
          <TabsContent value="points" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Podium players={getSortedPlayers("points")} sortBy="points" />
            <div className="space-y-4">
              {getSortedPlayers("points").slice(3).map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 4}
                  showMonth={selectedMonth}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Podium players={getSortedPlayers("goals")} sortBy="goals" />
            <div className="space-y-4">
              {getSortedPlayers("goals").slice(3).map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 4}
                  showMonth={selectedMonth}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assists" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Podium players={getSortedPlayers("assists")} sortBy="assists" />
            <div className="space-y-4">
              {getSortedPlayers("assists").slice(3).map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 4}
                  showMonth={selectedMonth}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="missedGoals" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Podium players={getSortedPlayers("missedGoals")} sortBy="missedGoals" />
            <div className="space-y-4">
              {getSortedPlayers("missedGoals").slice(3).map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 4}
                  showMonth={selectedMonth}
                />
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

