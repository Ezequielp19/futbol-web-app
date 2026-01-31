import { Header } from "@/components/header"
import { RankingList } from "@/components/ranking-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-black">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <section className="relative mb-12 py-12 px-6 overflow-hidden rounded-3xl bg-secondary/30 border border-white/5">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

          <div className="relative text-center">
            <span className="inline-block ef-badge mb-4">Temporada 2024/25</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">
              <span className="ef-gradient-text">La Scabionetta</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-medium">
              Panel oficial de estadísticas, goles y asistencias del equipo más determinante de la liga.
            </p>
          </div>
        </section>

        <RankingList />
      </main>

      <footer className="py-12 text-center text-muted-foreground border-t border-white/5 mt-12">
        <p className="text-sm font-medium tracking-widest uppercase italic border border-white/10 inline-block px-4 py-2">
          Powered by <span className="text-primary font-black ml-1">eScabionetta</span>
        </p>
      </footer>
    </div>
  )
}

