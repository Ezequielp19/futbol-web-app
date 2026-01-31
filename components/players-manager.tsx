"use client"

import React from "react"

import { useState } from "react"
import { usePlayers, addPlayer, updatePlayer, deletePlayer } from "@/hooks/use-firebase-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Loader2, Upload, UserPlus, Check } from "lucide-react"
import type { Player } from "@/lib/types"

import { AVAILABLE_TRAITS } from "@/lib/constants"

export function PlayersManager() {
  const { players, loading, error } = usePlayers()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [isLegendary, setIsLegendary] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")

  const resetForm = () => {
    setName("")
    setDescription("")
    setSelectedTraits([])
    setIsLegendary(false)
    setPhotoFile(null)
    setPhotoPreview("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleTrait = (traitId: string) => {
    setSelectedTraits(prev =>
      prev.includes(traitId)
        ? prev.filter(t => t !== traitId)
        : [...prev, traitId]
    )
  }

  const handleAddPlayer = async () => {
    if (!name.trim()) return
    setIsSubmitting(true)
    try {
      await addPlayer(name.trim(), photoFile || undefined, description, selectedTraits, isLegendary)
      resetForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding player:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditPlayer = async () => {
    if (!editingPlayer || !name.trim()) return
    setIsSubmitting(true)
    try {
      await updatePlayer(editingPlayer.id, {
        name: name.trim(),
        photoFile: photoFile || undefined,
        description,
        traits: selectedTraits,
        isLegendary
      })
      resetForm()
      setEditingPlayer(null)
    } catch (error) {
      console.error("Error updating player:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    try {
      await deletePlayer(playerId)
    } catch (error) {
      console.error("Error deleting player:", error)
    }
  }

  const openEditDialog = (player: Player) => {
    setEditingPlayer(player)
    setName(player.name)
    setDescription(player.description || "")
    setSelectedTraits(player.traits || [])
    setIsLegendary(player.isLegendary || false)
    setPhotoPreview(player.photoUrl)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-primary font-bold italic uppercase tracking-widest animate-pulse">Cargando Plantilla...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-2xl">
        <p className="text-destructive font-black uppercase italic tracking-tighter">Error de Base de Datos</p>
      </div>
    )
  }

  const PlayerFormFields = (
    <div className="space-y-6 py-6 overflow-y-auto max-h-[70vh] px-1">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-white/40">Nombre Completo</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Lionel Messi"
          className="bg-white/5 border-white/10 h-12 focus:border-primary transition-colors text-white font-bold italic"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-white/40">Descripción / Bio</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Cuenta algo sobre este jugador..."
          className="bg-white/5 border-white/10 min-h-[100px] focus:border-primary transition-colors text-white font-medium italic"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-black uppercase tracking-widest text-white/40">Estado del Jugador</Label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsLegendary(!isLegendary)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black italic uppercase transition-all border w-full
              ${isLegendary
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }
            `}
          >
            <div className={`
              w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${isLegendary ? "border-yellow-500 bg-yellow-500" : "border-white/20"}
            `}>
              {isLegendary && <Check className="h-3 w-3 text-black" />}
            </div>
            <span>🌟 Jugador Legendario (Retirado)</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-black uppercase tracking-widest text-white/40">Rasgos / Badges</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TRAITS.map(trait => (
            <button
              key={trait.id}
              onClick={() => toggleTrait(trait.id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                ${selectedTraits.includes(trait.id)
                  ? `${trait.color} text-white border-transparent scale-105`
                  : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                }
              `}
              type="button"
            >
              <span className="text-sm">{trait.icon}</span>
              {trait.label}
              {selectedTraits.includes(trait.id) && <Check className="h-3 w-3 ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="photo" className="text-xs font-black uppercase tracking-widest text-white/40">Foto de Perfil</Label>
        <div className="flex items-center gap-6">
          {photoPreview && (
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={photoPreview || "/placeholder.svg"} className="object-cover" />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          )}
          <label className="flex-1">
            <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-primary active:scale-95 transition-all bg-white/[0.02] hover:bg-white/[0.05]">
              <Upload className="h-6 w-6 text-white/40" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-2">Subir Archivo</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Plantilla</h3>
          <span className="text-primary font-bold">{players.length} JUGADORES</span>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary text-black hover:bg-white font-black italic uppercase tracking-tighter rounded-xl px-6 py-6 h-auto">
              <UserPlus className="h-5 w-5 mr-2" />
              Nuevo Fichaje
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-secondary border-white/10 rounded-3xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Agregar Jugador</DialogTitle>
              <DialogDescription className="text-white/60 font-medium">
                Completa los datos para registrar un nuevo integrante
              </DialogDescription>
            </DialogHeader>
            {PlayerFormFields}
            <DialogFooter className="gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl h-12">
                Cancelar
              </Button>
              <Button onClick={handleAddPlayer} disabled={isSubmitting || !name.trim()} className="bg-primary text-black hover:bg-white font-black italic uppercase tracking-tighter rounded-xl h-12 flex-1">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Fichaje"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {players.length === 0 ? (
        <div className="py-16 text-center bg-secondary/20 rounded-3xl border border-white/5 border-dashed">
          <p className="text-white/20 font-black italic uppercase tracking-tighter text-xl">Sin Jugadores Activos</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {players.map((player) => {
            const initials = player.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <div key={player.id} className="ef-card p-4 group">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white/5 transition-transform group-hover:scale-110">
                    <AvatarImage src={player.photoUrl || "/placeholder.svg"} alt={player.name} className="object-cover" />
                    <AvatarFallback className="bg-white/5 text-primary font-black">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-black italic uppercase tracking-tighter truncate group-hover:text-primary transition-colors">{player.name}</p>
                      {player.traits && player.traits.length > 0 && (
                        <div className="flex gap-1 overflow-hidden h-5">
                          {player.traits.map(tId => {
                            const trait = AVAILABLE_TRAITS.find(at => at.id === tId)
                            return trait ? (
                              <div key={tId} className={`w-2 h-full rounded-sm ${trait.color} opacity-40`} title={trait.label} />
                            ) : null
                          })}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">{player.description || "Sin descripción"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingPlayer?.id === player.id} onOpenChange={(open) => !open && setEditingPlayer(null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(player)} className="bg-white/5 border-white/10 hover:bg-primary hover:text-black rounded-xl h-12 w-12 transition-all">
                          <Pencil className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-secondary border-white/10 rounded-3xl max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Editar Jugador</DialogTitle>
                        </DialogHeader>
                        {PlayerFormFields}
                        <DialogFooter className="gap-3">
                          <Button variant="ghost" onClick={() => setEditingPlayer(null)} className="bg-white/5 hover:bg-white/10 rounded-xl h-12">
                            Cerrar
                          </Button>
                          <Button onClick={handleEditPlayer} disabled={isSubmitting || !name.trim()} className="bg-primary text-black hover:bg-white font-black italic uppercase tracking-tighter rounded-xl h-12 flex-1">
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Actualizar Datos"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-white/5 border-white/10 hover:bg-accent text-white rounded-xl h-12 w-12 transition-all">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#151518] border-white/10 rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black italic uppercase tracking-tighter text-accent">Eliminar Jugador</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60 font-medium pt-2">
                            ¿Estas seguro de eliminar a <span className="text-white font-bold">{player.name}</span>?
                            Esta acción es irreversible y se perderán todos sus registros.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3 mt-4">
                          <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-12">Volver</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlayer(player.id)}
                            className="bg-accent text-white hover:bg-red-600 font-bold uppercase italic tracking-tighter rounded-xl h-12 flex-1"
                          >
                            Eliminar Permanentemente
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

