"use client"

import { useState } from "react"
import { usePlayers, useStats, addOrUpdateStat, getAvailableMonths, formatMonth } from "@/hooks/use-firebase-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Loader2, Target, HandHelping, Calendar, Shield, Hand, XCircle } from "lucide-react"
import type { Player } from "@/lib/types"

export function StatsManager() {
  const { players, loading: playersLoading, error: playersError } = usePlayers()
  const { stats, loading: statsLoading, error: statsError } = useStats()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const selectedMonth = "global"


  // Form state
  const [selectedPlayerId, setSelectedPlayerId] = useState("")
  const [goals, setGoals] = useState("0")
  const [assists, setAssists] = useState("0")
  const [cleanSheets, setCleanSheets] = useState("0")
  const [saves, setSaves] = useState("0")
  const [missedGoals, setMissedGoals] = useState("0")
  const [formMonth, setFormMonth] = useState(selectedMonth)

  const resetForm = () => {
    setSelectedPlayerId("")
    setGoals("0")
    setAssists("0")
    setCleanSheets("0")
    setSaves("0")
    setMissedGoals("0")
    setFormMonth(selectedMonth)
  }

  const handleSubmit = async () => {
    if (!selectedPlayerId) return
    setIsSubmitting(true)
    try {
      await addOrUpdateStat(
        selectedPlayerId,
        parseInt(goals) || 0,
        parseInt(assists) || 0,
        parseInt(cleanSheets) || 0,
        parseInt(saves) || 0,
        parseInt(missedGoals) || 0
      )
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error adding stat:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDialogForPlayer = (player: Player) => {
    setSelectedPlayerId(player.id)
    setFormMonth(selectedMonth)

    // Always start with 0 for new additions
    setGoals("0")
    setAssists("0")
    setCleanSheets("0")
    setSaves("0")
    setMissedGoals("0")

    setIsDialogOpen(true)
  }

  if (playersLoading || statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-primary font-bold italic uppercase tracking-widest animate-pulse">Sincronizando Estadísticas...</p>
      </div>
    )
  }

  if (playersError || statsError) {
    return (
      <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-2xl">
        <p className="text-destructive font-black uppercase italic tracking-tighter">Error de Conexión Datos</p>
      </div>
    )
  }

  if (players.length === 0) {
    return (
      <div className="p-12 text-center bg-secondary/20 rounded-3xl border border-white/5">
        <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Primero debes agregar jugadores</p>
      </div>
    )
  }

  // Get stats for selected month
  const monthStats = stats.filter((s) => s.month === selectedMonth)

  // Create a map of player stats for the month
  const playerStatsMap = new Map<string, { goals: number; assists: number; cleanSheets: number; saves: number; missedGoals: number }>()
  monthStats.forEach((stat) => {
    playerStatsMap.set(stat.playerId, {
      goals: stat.goals,
      assists: stat.assists,
      cleanSheets: stat.cleanSheets || 0,
      saves: stat.saves || 0,
      missedGoals: stat.missedGoals || 0
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Registro de Goles</h3>
        </div>

      </div>

      <div className="bg-secondary/20 border border-white/5 rounded-3xl overflow-hidden">
        <div className="bg-white/5 p-4 border-b border-white/5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary text-center">Registro Histórico Acumulado</p>
        </div>
        <div className="p-4 grid gap-3">
          {players.map((player) => {
            const initials = player.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            const playerStat = playerStatsMap.get(player.id) || { goals: 0, assists: 0, cleanSheets: 0, saves: 0, missedGoals: 0 }
            const isPortero = player.traits?.includes("portero")

            return (
              <div
                key={player.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
              >
                <Avatar className="h-12 w-12 border border-white/10">
                  <AvatarImage src={player.photoUrl || "/placeholder.svg"} alt={player.name} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white group-hover:text-primary transition-colors truncate uppercase italic tracking-tighter">{player.name}</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  {isPortero ? (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-primary font-black text-xl leading-none italic">{playerStat.cleanSheets || 0}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Vallas</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-white font-black text-xl leading-none italic">{playerStat.saves || 0}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Atajadas</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center">
                        <span className="text-primary font-black text-xl leading-none italic">{playerStat.goals}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Goles</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-white font-black text-xl leading-none italic">{playerStat.assists}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Asist.</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-red-500 font-black text-xl leading-none italic">{playerStat.missedGoals || 0}</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Errados</span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialogForPlayer(player)}
                  className="bg-primary text-black hover:bg-white border-none rounded-xl font-black italic uppercase tracking-tighter ml-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Cargar
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-secondary border-white/10 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Sumar Estadísticas</DialogTitle>
            <DialogDescription className="text-white/60">
              Ingresa los goles y asistencias de hoy. Se sumarán automáticamente al total.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6 font-sans">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-white/40">Jugador Seleccionado</Label>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="font-bold italic uppercase tracking-tighter text-lg">
                  {players.find(p => p.id === selectedPlayerId)?.name || 'Seleccionar...'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {players.find(p => p.id === selectedPlayerId)?.traits?.includes("portero") ? (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="cleanSheets" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                      <Shield className="h-4 w-4 text-primary" /> Vallas Invictas
                    </Label>
                    <Input
                      id="cleanSheets"
                      type="number"
                      min="0"
                      value={cleanSheets}
                      onChange={(e) => setCleanSheets(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 text-2xl font-black italic focus:border-primary text-center"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="saves" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                      <Hand className="h-4 w-4 text-white" /> Atajadas
                    </Label>
                    <Input
                      id="saves"
                      type="number"
                      min="0"
                      value={saves}
                      onChange={(e) => setSaves(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 text-2xl font-black italic focus:border-white text-center"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="goals" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                      <Target className="h-4 w-4 text-primary" /> Goles
                    </Label>
                    <Input
                      id="goals"
                      type="number"
                      min="0"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 text-2xl font-black italic focus:border-primary text-center"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="assists" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                      <HandHelping className="h-4 w-4 text-white" /> Asistencias
                    </Label>
                    <Input
                      id="assists"
                      type="number"
                      min="0"
                      value={assists}
                      onChange={(e) => setAssists(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 text-2xl font-black italic focus:border-white text-center"
                    />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <Label htmlFor="missedGoals" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                      <XCircle className="h-4 w-4 text-red-500" /> Goles Errados
                    </Label>
                    <Input
                      id="missedGoals"
                      type="number"
                      min="0"
                      value={missedGoals}
                      onChange={(e) => setMissedGoals(e.target.value)}
                      className="bg-white/5 border-white/10 h-14 text-2xl font-black italic focus:border-red-500 text-center"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="bg-white/5 hover:bg-white/10 rounded-xl h-12 font-bold">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !selectedPlayerId} className="bg-primary text-black hover:bg-white font-black italic uppercase tracking-tighter rounded-xl h-12 flex-1">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sumar al Total"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

