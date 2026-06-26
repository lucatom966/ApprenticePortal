import { teams } from "@/lib/mock-data";
import { TeamCard } from "@/components/teams/team-card";

export default function TeamsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight mb-2">Ausbildungsteams</h1>
        <p className="text-[var(--color-muted-foreground)]">
          {teams.length} Teams stehen für deine nächste Stage zur Verfügung. Klicke auf ein Team um mehr zu erfahren.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
