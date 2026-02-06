"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"
import { PlayerWithStats } from "@/lib/types"

interface PlayerRadarProps {
    player: PlayerWithStats
}

export function PlayerRadar({ player }: PlayerRadarProps) {
    const isPortero = player.traits?.includes("portero")

    let data = []

    if (isPortero) {
        data = [
            { subject: "ATAJADAS", A: Math.min(95, 20 + player.totalSaves * 5), fullMark: 100 },
            { subject: "SEGURIDAD", A: Math.min(95, 20 + player.totalCleanSheets * 15), fullMark: 100 },
            { subject: "REFLEJOS", A: Math.min(95, 40 + (player.totalSaves * 3)), fullMark: 100 },
            { subject: "SALIDA", A: Math.min(95, 30 + (player.totalAssists * 12)), fullMark: 100 },
            { subject: "PUNTOS", A: Math.min(95, 10 + player.totalPoints * 5), fullMark: 100 },
        ]
    } else {
        const accuracy = player.totalGoals > 0
            ? (player.totalGoals / (player.totalGoals + (player.totalMissedGoals || 0.1))) * 100
            : 0

        data = [
            { subject: "ATAQUE", A: Math.min(95, 20 + player.totalGoals * 8), fullMark: 100 },
            { subject: "CREACIÓN", A: Math.min(95, 20 + player.totalAssists * 10), fullMark: 100 },
            { subject: "PUNTERÍA", A: Math.min(95, accuracy), fullMark: 100 },
            { subject: "PUNTOS", A: Math.min(95, 10 + player.totalPoints * 3.5), fullMark: 100 },
            { subject: "DEFENSA", A: Math.min(95, 20 + (player.totalSaves * 12) + (player.totalCleanSheets * 8)), fullMark: 100 },
        ]
    }

    return (
        <div className="w-full h-[300px] flex items-center justify-center bg-black/20 rounded-3xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#ffffff60", fontSize: 10, fontWeight: "bold" }}
                    />
                    <Radar
                        name={player.name}
                        dataKey="A"
                        stroke="#e2ff00"
                        fill="#e2ff00"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
