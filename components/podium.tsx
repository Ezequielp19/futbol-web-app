"use client"

import React from "react"
import { Trophy, Medal, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PlayerWithStats } from "@/lib/types"
import { PlayerCard } from "@/components/player-card"

interface PodiumProps {
    players: PlayerWithStats[]
    sortBy: "goals" | "assists" | "points" | "missedGoals"
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
        <div className="relative mt-24 mb-12 py-8 md:py-20 px-4 overflow-hidden rounded-[2rem] md:rounded-[4rem] shadow-2xl stadium-grass border-4 border-white/10" style={{ perspective: "1200px" }}>
            <div className="flex flex-col items-center justify-center gap-16 md:gap-12 lg:gap-24 md:flex-row md:items-end relative z-10 pt-16 md:pt-0">
                {displayOrder.map(({ player, rank }) => {
                    const isFirst = rank === 1
                    const isSecond = rank === 2
                    const isThird = rank === 3

                    const stats = player.monthlyStats["global"] || { goals: 0, assists: 0, points: 0, cleanSheets: 0, saves: 0, missedGoals: 0 }

                    const initials = player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)

                    const statLabel = sortBy === "goals" ? "Goles" : sortBy === "assists" ? "Asist." : sortBy === "missedGoals" ? "Errados" : "Puntos"
                    const statValue = sortBy === "goals" ? stats.goals : sortBy === "assists" ? stats.assists : sortBy === "missedGoals" ? stats.missedGoals : stats.points

                    return (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            rank={rank}
                            showMonth="global"
                            customTrigger={
                                <div
                                    className={`
                      relative flex flex-col items-center group cursor-pointer transition-all duration-300
                      ${isFirst ? "order-1 md:order-2 z-30 animate-winner-entrance" : ""}
                      ${isSecond ? "order-2 md:order-1 z-20 animate-winner-2" : ""}
                      ${isThird ? "order-3 md:order-3 z-10 animate-winner-3" : ""}
                    `}
                                    style={{
                                        transformStyle: "preserve-3d",
                                    }}
                                >
                                    {/* Shadow for grass */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/60 blur-xl rounded-full -z-10" />

                                    {/* Crown/Medal Icon */}
                                    <div className={`
                                      absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 
                                      ${isFirst ? "text-yellow-400 animate-float-slow" : isSecond ? "text-slate-300 animate-float-slow" : "text-amber-600 animate-float-slow"}
                                    `}>
                                        {isFirst ? (
                                            <div className="relative">
                                                <Crown className="h-12 w-12 md:h-16 md:w-16 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
                                                <div className="absolute inset-0 blur-2xl bg-yellow-400 opacity-30 animate-flash" />
                                            </div>
                                        ) : (
                                            <Medal className="h-10 w-10 md:h-12 md:w-12" />
                                        )}
                                    </div>

                                    {/* Avatar Circle */}
                                    <div className={`
                      relative mb-6 p-1 rounded-full border-4 transition-transform group-hover:scale-110 shadow-2xl
                      ${isFirst ? "w-32 h-32 md:w-48 md:h-48 border-yellow-400 animate-pulse border-[6px] md:border-[10px]" :
                                            isSecond ? "w-28 h-28 md:w-40 md:h-40 border-slate-300 border-[4px] md:border-[6px]" :
                                                "w-24 h-24 md:w-36 md:h-36 border-amber-600 border-[4px] md:border-[5px]"}
                    `}>
                                        <Avatar className="w-full h-full rounded-full overflow-hidden border-2 border-background">
                                            <AvatarImage src={player.photoUrl || "/placeholder.svg"} className="object-cover" />
                                            <AvatarFallback className="bg-secondary text-2xl font-black italic">{initials}</AvatarFallback>
                                        </Avatar>

                                        {/* Rank Badge */}
                                        <div className={`
                        absolute -bottom-2 right-1/2 translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black italic border-2 border-background shadow-lg
                        ${isFirst ? "bg-yellow-400 text-black h-14 w-14 text-2xl" :
                                                isSecond ? "bg-slate-300 text-black h-12 w-12 text-xl" :
                                                    "bg-amber-600 text-white h-10 w-10 text-base"}
                      `}>
                                            {rank}
                                        </div>
                                    </div>

                                    {/* Name and Stats */}
                                    <div className="text-center bg-black/60 backdrop-blur-xl px-8 py-4 rounded-[1.5rem] border border-white/10 group-hover:border-primary/50 transition-colors shadow-2xl min-w-[140px] md:min-w-[180px]">
                                        <h4 className={`
                        font-black italic uppercase tracking-tighter mb-2
                        ${isFirst ? "text-2xl md:text-4xl text-yellow-400" : "text-lg md:text-2xl text-white"}
                      `}>
                                            {player.name}
                                        </h4>
                                        <div className={`
                        inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/5
                        ${isFirst ? "scale-110 bg-yellow-400/20 border-yellow-400/20" : "scale-95"}
                      `}>
                                            <span className="text-[11px] font-black uppercase text-white/40 tracking-widest">{statLabel}</span>
                                            <span className="text-lg font-black italic text-white leading-none">{statValue}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    )
                })}
            </div>
        </div>
    )
}
