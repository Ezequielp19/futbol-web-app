"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayersManager } from "@/components/players-manager"
import { StatsManager } from "@/components/stats-manager"
import { Users, BarChart3 } from "lucide-react"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("players")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary/30 p-1.5 h-16 rounded-2xl border border-white/5 mb-8">
        <TabsTrigger value="players" className="group flex items-center gap-2 rounded-xl font-black italic uppercase tracking-tighter text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
          <Users className="h-5 w-5 opacity-50 group-data-[state=active]:opacity-100" />
          Jugadores
        </TabsTrigger>
        <TabsTrigger value="stats" className="group flex items-center gap-2 rounded-xl font-black italic uppercase tracking-tighter text-base data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
          <BarChart3 className="h-5 w-5 opacity-50 group-data-[state=active]:opacity-100" />
          Estadísticas
        </TabsTrigger>
      </TabsList>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TabsContent value="players" className="mt-0 outline-none">
          <PlayersManager />
        </TabsContent>

        <TabsContent value="stats" className="mt-0 outline-none">
          <StatsManager />
        </TabsContent>
      </div>
    </Tabs>
  )
}

