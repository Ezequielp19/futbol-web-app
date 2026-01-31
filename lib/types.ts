export interface Player {
  id: string
  name: string
  photoUrl: string
  description?: string
  traits?: string[]
  isLegendary?: boolean
  createdAt: number
}

export interface Stat {
  id: string
  playerId: string
  goals: number
  assists: number
  cleanSheets: number
  saves: number
  month: string // Format: "YYYY-MM"
  createdAt: number
}

export interface PlayerWithStats extends Player {
  totalGoals: number
  totalAssists: number
  totalCleanSheets: number
  totalSaves: number
  totalPoints: number
  monthlyStats: {
    [month: string]: {
      goals: number
      assists: number
      cleanSheets: number
      saves: number
      points: number
    }
  }
}
