"use client"

import { useEffect, useState } from "react"
import { ref, onValue, push, set, remove, update } from "firebase/database"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { database, storage } from "@/lib/firebase"
import type { Player, Stat, PlayerWithStats } from "@/lib/types"

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] usePlayers: Iniciando conexion a Firebase...")
    console.log("[v0] Database instance:", database)
    
    const playersRef = ref(database, "players")
    console.log("[v0] playersRef:", playersRef)
    
    // Timeout para no quedarse cargando infinitamente
    const timeout = setTimeout(() => {
      console.log("[v0] usePlayers: Timeout alcanzado, deteniendo carga")
      setLoading(false)
    }, 5000)
    
    const unsubscribe = onValue(
      playersRef, 
      (snapshot) => {
        console.log("[v0] usePlayers: Datos recibidos!", snapshot.val())
        clearTimeout(timeout)
        const data = snapshot.val()
        if (data) {
          const playersList = Object.entries(data).map(([id, player]) => ({
            id,
            ...(player as Omit<Player, "id">),
          }))
          setPlayers(playersList)
        } else {
          setPlayers([])
        }
        setLoading(false)
      },
      (err) => {
        clearTimeout(timeout)
        console.error("[v0] Firebase error:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  return { players, loading, error }
}

export function useStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const statsRef = ref(database, "stats")
    
    // Timeout para no quedarse cargando infinitamente
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)
    
    const unsubscribe = onValue(
      statsRef, 
      (snapshot) => {
        clearTimeout(timeout)
        const data = snapshot.val()
        if (data) {
          const statsList = Object.entries(data).map(([id, stat]) => ({
            id,
            ...(stat as Omit<Stat, "id">),
          }))
          setStats(statsList)
        } else {
          setStats([])
        }
        setLoading(false)
      },
      (err) => {
        clearTimeout(timeout)
        console.error("[v0] Firebase stats error:", err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  return { stats, loading, error }
}

export function usePlayersWithStats() {
  const { players, loading: playersLoading, error: playersError } = usePlayers()
  const { stats, loading: statsLoading, error: statsError } = useStats()

  const playersWithStats: PlayerWithStats[] = players.map((player) => {
    const playerStats = stats.filter((stat) => stat.playerId === player.id)
    
    // Calculate total points (2 for goal, 1 for assist)
    const totalGoals = playerStats.reduce((sum, stat) => sum + stat.goals, 0)
    const totalAssists = playerStats.reduce((sum, stat) => sum + stat.assists, 0)
    const totalPoints = totalGoals * 2 + totalAssists
    
    return {
      ...player,
      totalGoals,
      totalAssists,
      totalPoints,
      monthlyStats: {
        "global": {
          goals: totalGoals,
          assists: totalAssists,
          points: totalPoints
        }
      }
    }
  })

  return { 
    players: playersWithStats, 
    loading: playersLoading || statsLoading,
    error: playersError || statsError
  }
}

export async function addPlayer(
  name: string, 
  photoFile?: File, 
  description?: string, 
  traits?: string[]
): Promise<string> {
  console.log("[v0] addPlayer: Iniciando con nombre:", name)
  let photoUrl = ""
  
  if (photoFile) {
    console.log("[v0] addPlayer: Subiendo foto...")
    const fileRef = storageRef(storage, `players/${Date.now()}_${photoFile.name}`)
    await uploadBytes(fileRef, photoFile)
    photoUrl = await getDownloadURL(fileRef)
    console.log("[v0] addPlayer: Foto subida:", photoUrl)
  }

  console.log("[v0] addPlayer: Guardando en database...")
  const playersRef = ref(database, "players")
  const newPlayerRef = push(playersRef)
  
  await set(newPlayerRef, {
    name,
    photoUrl,
    description: description || "",
    traits: traits || [],
    createdAt: Date.now(),
  })

  console.log("[v0] addPlayer: Jugador guardado con ID:", newPlayerRef.key)
  return newPlayerRef.key!
}

export async function updatePlayer(
  playerId: string, 
  data: { name?: string; photoFile?: File; description?: string; traits?: string[] }
): Promise<void> {
  const updates: any = {}
  
  if (data.name !== undefined) updates.name = data.name
  if (data.description !== undefined) updates.description = data.description
  if (data.traits !== undefined) updates.traits = data.traits
  
  if (data.photoFile) {
    const fileRef = storageRef(storage, `players/${Date.now()}_${data.photoFile.name}`)
    await uploadBytes(fileRef, data.photoFile)
    updates.photoUrl = await getDownloadURL(fileRef)
  }

  const playerRef = ref(database, `players/${playerId}`)
  await update(playerRef, updates)
}

export async function deletePlayer(playerId: string): Promise<void> {
  const playerRef = ref(database, `players/${playerId}`)
  await remove(playerRef)
  
  // Also delete all stats for this player
  const statsRef = ref(database, "stats")
  onValue(statsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      Object.entries(data).forEach(([statId, stat]) => {
        if ((stat as Stat).playerId === playerId) {
          remove(ref(database, `stats/${statId}`))
        }
      })
    }
  }, { onlyOnce: true })
}

export async function addOrUpdateStat(
  playerId: string, 
  goals: number, 
  assists: number
): Promise<void> {
  const statsRef = ref(database, "stats")
  const globalMonth = "global"
  
  return new Promise((resolve) => {
    onValue(statsRef, async (snapshot) => {
      const data = snapshot.val()
      let existingStatId: string | null = null
      
      if (data) {
        Object.entries(data).forEach(([statId, stat]) => {
          const s = stat as Stat
          if (s.playerId === playerId && s.month === globalMonth) {
            existingStatId = statId
          }
        })
      }
      
      if (existingStatId) {
        const statRef = ref(database, `stats/${existingStatId}`)
        await update(statRef, { goals, assists })
      } else {
        const newStatRef = push(statsRef)
        await set(newStatRef, {
          playerId,
          goals,
          assists,
          month: globalMonth,
          createdAt: Date.now(),
        })
      }
      
      resolve()
    }, { onlyOnce: true })
  })
}

export async function deleteStat(statId: string): Promise<void> {
  const statRef = ref(database, `stats/${statId}`)
  await remove(statRef)
}

export function getAvailableMonths(): string[] {
  const months: string[] = []
  const now = new Date()
  
  // Generate last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    months.push(month)
  }
  
  return months
}

export function formatMonth(month: string): string {
  const [year, monthNum] = month.split("-")
  const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
  return date.toLocaleDateString("es-AR", { month: "long", year: "numeric" })
}
