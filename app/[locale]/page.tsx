import { BabyfootCards } from "@/components/features/BabyfootCards";
import { MvpPlayerCard } from "@/components/features/MvpPlayerCard";
import { UserStats } from "@/components/features/UserStats";
import DotGrid from "@/components/DotGrid";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="relative min-h-screen bg-gray-950 overflow-hidden">
      {/* Background dot-grid de ReactBits */}
      <div className="absolute inset-0">
        <DotGrid
          dotSize={2}
          gap={25}
          baseColor="#1e293b"
          activeColor="#06b6d4"
          proximity={150}
          shockRadius={300}
          shockStrength={8}
          resistance={800}
          returnDuration={1.8}
        />
      </div>

      {/* Vue non connecté */}
      {!user && (
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-500 to-cyan-400">
              Babyfoot Booking
            </h1>
            <p className="text-xl text-gray-400">
              Réservez votre table de babyfoot, affrontez vos amis et grimpez
              dans le classement ELO !
            </p>
            <div className="pt-8">
              <p className="text-gray-500">
                Connectez-vous pour accéder à votre dashboard et commencer à
                jouer
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vue connecté - Dashboard utilisateur */}
      {user && (
        <div className="relative z-10 container mx-auto px-4 py-8 space-y-12">
          {/* Section 1 : Sélection des Babyfoots */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
                Tables disponibles
              </h2>
              <p className="text-gray-400">
                Choisissez votre table et réservez votre créneau
              </p>
            </div>
            <BabyfootCards />
          </section>

          {/* Section 2 : MVP Player */}
          <section className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Joueur MVP du Campus
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                Le meilleur joueur du moment
              </p>
            </div>
            <MvpPlayerCard />
          </section>

          {/* Section 3 : Statistiques utilisateur */}
          <section className="max-w-7xl mx-auto">
            <UserStats />
          </section>
        </div>
      )}
    </main>
  );
}
