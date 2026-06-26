import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { teams, events } from "@/lib/mock-data";
import { TeamCard } from "@/components/teams/team-card";
import { EventCard } from "@/components/events/event-card";

export default function Home() {
  const upcomingEvents = events.slice(0, 2);
  const featuredTeams = teams.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[var(--color-accent)] mb-3 tracking-wide uppercase">
            Willkommen
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-foreground)] leading-tight tracking-tight mb-4">
            Dein Portal für die
            <br />
            <span className="text-[var(--color-accent)]">Lehrzeit</span>
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-8">
            Entdecke Teams, lies Onepager deiner künftigen Ausbildner und beantrage deine nächste Stage — alles an einem Ort.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/teams"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Teams entdecken
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] font-medium text-sm hover:bg-[var(--color-muted)] transition-colors"
            >
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* Teams Preview */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Teams</h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">{teams.length} Ausbildungsteams verfügbar</p>
          </div>
          <Link
            href="/teams"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
          >
            Alle anzeigen
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </section>

      {/* Events Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Nächste Events</h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-0.5">Veranstaltungen und Termine</p>
          </div>
          <Link
            href="/events"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
          >
            Alle anzeigen
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}
