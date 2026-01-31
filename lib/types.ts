export interface Player {
  id: string
  name: string
  photoUrl: string
  description?: string
  traits?: string[]
  createdAt: number
}

export interface Stat {
  id: string
  playerId: string
  goals: number
  assists: number
  month: string // Format: "YYYY-MM"
  createdAt: number
}

export interface PlayerWithStats extends Player {
  totalGoals: number
  totalAssists: number
  totalPoints: number
  monthlyStats: {
    [month: string]: {
      goals: number
      assists: number
      points: number
    }
  }
}
