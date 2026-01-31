"use client"

import React from "react"
import { Trophy, Medal, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PlayerWithStats } from "@/lib/types"

interface PodiumProps {
    players: PlayerWithStats[]
    sortBy: "goals" | "assists" | "points"
}

export function Podium({ players, sortBy }: PodiumProps) {
    if (players.length === 0) return null

    // Ensure we have exactly 3 spots (filled with null if less than 3 players)
    const top3 = [players[0], players[1], players[2]].filter(Boolean)

    // Reorder for visualization: 2nd, 1st, 3rd
    const displayOrder = []
    if (top3[1]) displayOrder.push({ player: top3[1], rank: 2 })
    if (top3[0]) displayOrder.push({ player: top3[0], rank: 1 })
    if (top3[2]) displayOrder.push({ player: top3[2], rank: 3 })

    if (displayOrder.length === 0) return null

    return (
        <div className="flex flex-col items-center justify-end gap-4 md:gap-0 md:flex-row md:items-end md:justify-center pt-24 pb-12 px-4">
            {displayOrder.map(({ player, rank }) => {
                const isFirst = rank === 1
                const isSecond = rank === 2
                const isThird = rank === 3

                const stats = player.monthlyStats["global"] || { goals: 0, assists: 0, points: 0, cleanSheets: 0, saves: 0 }

                const initials = player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)

                const statLabel = sortBy === "goals" ? "Goles" : sortBy === "assists" ? "Asist." : "Puntos"
                const statValue = sortBy === "goals" ? stats.goals : sortBy === "assists" ? stats.assists : stats.points

                return (
                    <div
                        key={player.id}
                        className={`
              relative flex flex-col items-center group transition-all duration-500 hover:z-20
              ${isFirst ? "order-1 md:order-2 z-10 scale-110 -mt-12 md:mx-4" : ""}
              ${isSecond ? "order-2 md:order-1 scale-100 opacity-90 hover:opacity-100" : ""}
              ${isThird ? "order-3 md:order-3 scale-95 opacity-80 hover:opacity-100" : ""}
            `}
                    >
                        {/* Crown/Medal Icon */}
                        <div className={`
              absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 animate-float
              ${isFirst ? "text-yellow-400" : isSecond ? "text-slate-300" : "text-amber-600"}
            `}>
                            {isFirst ? (
                                <div className="relative">
                                    <Crown className="h-10 w-10 md:h-14 md:w-14 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                    <div className="absolute inset-0 blur-xl bg-yellow-400 opacity-20 animate-pulse" />
                                </div>
                            ) : (
                                <Medal className="h-8 w-8 md:h-10 md:w-10" />
                            )}
                        </div>

                        {/* Avatar Circle */}
                        <div className={`
              relative mb-4 p-1 rounded-full border-4 transition-transform group-hover:scale-105
              ${isFirst ? "w-28 h-28 md:w-40 md:h-40 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]" :
                                isSecond ? "w-24 h-24 md:w-32 md:h-32 border-slate-300" :
                                    "w-20 h-20 md:w-28 md:h-28 border-amber-600"}
            `}>
                            <Avatar className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                                <AvatarImage src={player.photoUrl || "/placeholder.svg"} className="object-cover" />
                                <AvatarFallback className="bg-secondary text-2xl font-black italic">{initials}</AvatarFallback>
                            </Avatar>

                            {/* Rank Badge */}
                            <div className={`
                absolute -bottom-2 right-1/2 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black italic border-2 border-background
                ${isFirst ? "bg-yellow-400 text-black h-10 w-10 text-xl" :
                                    isSecond ? "bg-slate-300 text-black h-8 w-8" :
                                        "bg-amber-600 text-white h-7 w-7 text-xs"}
              `}>
                                {rank}
                            </div>
                        </div>

                        {/* Name and Stats */}
                        <div className="text-center">
                            <h4 className={`
                font-black italic uppercase tracking-tighter mb-1
                ${isFirst ? "text-xl md:text-2xl text-yellow-400" : "text-base md:text-lg text-white"}
              `}>
                                {player.name}
                            </h4>
                            <div className={`
                inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10
                ${isFirst ? "scale-110" : "scale-90"}
              `}>
                                <span className="text-[10px] font-black uppercase text-white/40">{statLabel}</span>
                                <span className="font-black italic text-white line-height-none">{statValue}</span>
                            </div>
                        </div>

                        {/* Platform Base (Hidden on mobile, stylized on desktop) */}
                        <div className={`
              hidden md:block absolute -bottom-12 w-full h-2 rounded-full blur-md opacity-20
              ${isFirst ? "bg-yellow-400" : isSecond ? "bg-slate-300" : "bg-amber-600"}
            `} />
                    </div>
                )
            })}
        </div>
    )
}
