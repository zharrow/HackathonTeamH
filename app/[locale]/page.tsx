import { BabyfootCards } from "@/components/features/BabyfootCards";
import { LeaderboardPodium } from "@/components/features/LeaderboardPodium";
import { UserStats } from "@/components/features/UserStats";
import { MyReservations } from "@/components/features/MyReservations";
import DotGrid from "@/components/DotGrid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBabyfoots } from "@/lib/actions/babyfoot";
import { getTopPlayers } from "@/lib/actions/leaderboard";
import { getUserStats } from "@/lib/actions/user-stats";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const t = await getTranslations();

  // Fetch data in parallel
  let babyfoots:any = [];
  let topPlayers:any = [];
  let userStats:any = null;

  if (session) {
    [babyfoots, topPlayers, userStats] = await Promise.all([
      getBabyfoots(),
      getTopPlayers(3),
      getUserStats(session.user.id),
    ]);
  }
  
  return (
    <main className="relative min-h-screen bg-[#0D0D0D] overflow-hidden">
      {/* Background dot-grid avec couleurs Brand */}
      <div className="absolute inset-0">
        <DotGrid
          dotSize={6}
          gap={20}
          baseColor="#1a1a1a"
          activeColor="#00FFF7"
          proximity={150}
          shockRadius={300}
          shockStrength={8}
          resistance={800}
          returnDuration={1.8}
        />
      </div>

      {/* Vue non connecté */}
      {!session && (
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="font-heading text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#00FFF7] via-[#FF00FF] to-[#00FFF7] animate-gradient-x">
              {t('home.title')}
            </h1>
            <p className="font-subheading text-2xl text-[#B0B0B0]">
              {t('home.subtitle')}
            </p>
            <div className="pt-8">
              <p className="font-body text-[#B0B0B0]">
                {t('home.signInCta')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vue connecté - Dashboard utilisateur */}
      {session && (
        <div className="relative z-10 container mx-auto px-4 py-8 space-y-12">
          {/* Section 0: My Reservations */}
          <section>
            <div className="mb-6">
              <h2 className="font-heading text-4xl text-[#F2F2F2] mb-2 text-glow-cyan">
                Mes Réservations
              </h2>
              <p className="font-body text-[#B0B0B0]">
                Gérez vos réservations et votre position dans la file d&apos;attente
              </p>
            </div>
            <MyReservations />
          </section>

          {/* Section 1 : Sélection des Babyfoots */}
          <section>
            <div className="mb-6">
              <h2 className="font-heading text-4xl text-[#F2F2F2] mb-2 text-glow-cyan">
                {t('home.availableTables')}
              </h2>
              <p className="font-body text-[#B0B0B0]">
                {t('home.availableTablesDesc')}
              </p>
            </div>
            <BabyfootCards babyfoots={babyfoots} />
          </section>

          {/* Section 2: Leaderboard Podium */}
          <section>
            <div className="text-center mb-8">
              <h2 className="font-heading text-4xl text-[#F2F2F2] mb-2 text-glow-cyan">
                TOP 3 LEADERBOARD
              </h2>
              <p className="font-body text-[#B0B0B0]">
                Les meilleurs joueurs du campus
              </p>
            </div>
            <LeaderboardPodium players={topPlayers} />
          </section>

          {/* Section 3 : Statistiques utilisateur */}
          <section className="max-w-7xl mx-auto">
            <UserStats
              user={userStats?.user}
              eloProgression={userStats?.eloProgression}
              matchFormatsData={userStats?.matchFormatsData}
              recentGames={userStats?.recentGames}
            />
          </section>
        </div>
      )}
    </main>
  );
}
