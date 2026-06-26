import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { teams } from "@/lib/mock-data";
import { isTeamActive, getDeactivatedUntil } from "@/lib/team-state";
import { TeamCard } from "@/components/teams/team-card";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function TeamsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const userTeamId = session.user.teamId;

  const isManager = role === "gbv" || role === "admin";
  const isTrainer = role === "praxisbildner";

  // Praxisbildner sieht nur das eigene Team
  if (isTrainer) {
    const ownTeam = userTeamId ? teams.find((t) => t.id === userTeamId) : null;
    if (ownTeam) redirect(`/teams/${ownTeam.id}`);
    // Kein Team zugewiesen
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-[var(--color-muted-foreground)] text-sm">Dir ist noch kein Team zugewiesen.</p>
      </div>
    );
  }

  // Lernende: nur aktive Teams
  // GBV/Admin: alle Teams inkl. inaktiver
  const visibleTeams = teams.filter((t) =>
    isManager ? true : isTeamActive(t.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight mb-2">
          Ausbildungsteams
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          {isManager
            ? `${teams.length} Teams · ${teams.filter((t) => !isTeamActive(t.id)).length} deaktiviert`
            : `${visibleTeams.length} Teams für deine Stage`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTeams.map((team) => {
          const active = isTeamActive(team.id);
          const until = getDeactivatedUntil(team.id);

          if (!active && isManager) {
            return (
              <div key={team.id} className="relative opacity-60">
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[var(--color-background)]/60 backdrop-blur-[2px] gap-2">
                  <EyeOff size={20} className="text-[var(--color-muted-foreground)]" />
                  <p className="text-xs font-medium text-[var(--color-muted-foreground)]">Deaktiviert</p>
                  {until && (
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      bis {new Date(until).toLocaleDateString("de-CH")}
                    </p>
                  )}
                </div>
                <TeamCard team={team} />
              </div>
            );
          }

          return <TeamCard key={team.id} team={team} />;
        })}
      </div>

      {visibleTeams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-[var(--color-muted-foreground)]">Keine aktiven Teams verfügbar.</p>
        </div>
      )}
    </div>
  );
}
