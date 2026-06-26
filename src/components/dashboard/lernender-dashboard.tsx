"use client";

import Link from "next/link";
import { CalendarDays, Users, ArrowRight, BookOpen } from "lucide-react";
import { events } from "@/lib/mock-data";
import { mockUsers } from "@/lib/mock-users";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

export function LernenderDashboard({ user }: Props) {
  const me = mockUsers.find((u) => u.email === user.email);
  const upcoming = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Greeting */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-1">Willkommen zurück</p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
          Hallo, {user.name?.split(" ")[0]} 👋
        </h1>
        {me?.specialty && (
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Fachrichtung: <span className="font-medium text-[var(--color-foreground)]">{me.specialty}</span>
            {me.lehrjahr && <span className="ml-2 text-sm">· {me.lehrjahr}. Lehrjahr</span>}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<BookOpen size={18} />}
          label="Fachrichtung"
          value={me?.specialty ?? "—"}
          color="blue"
        />
        <StatCard
          icon={<Users size={18} />}
          label="Lehrjahr"
          value={me?.lehrjahr ? `${me.lehrjahr}. Lehrjahr` : "—"}
          color="violet"
        />
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Nächste Events"
          value={`${upcoming.length} bald`}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teams */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-foreground)]">Stages entdecken</h2>
            <Link href="/teams" className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1">
              Alle Teams <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4">
            Schau dir die Ausbildungsteams an und bewirb dich für deine nächste Stage. Ein Klick auf das Team öffnet den Onepager des Ausbildners.
          </p>
          <Link
            href="/teams"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Teams anzeigen
          </Link>
        </section>

        {/* Upcoming Events */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-foreground)]">Nächste Events</h2>
            <Link href="/events" className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1">
              Alle <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcoming.map((event) => {
              const d = new Date(event.date);
              return (
                <div key={event.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors">
                  <div className="flex flex-col items-center w-10 shrink-0 text-[var(--color-accent)]">
                    <span className="text-lg font-bold leading-none">
                      {d.toLocaleDateString("de-CH", { day: "2-digit" })}
                    </span>
                    <span className="text-[10px] uppercase font-medium">
                      {d.toLocaleDateString("de-CH", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{event.title}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] truncate">{event.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "violet" | "amber" | "emerald";
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500",
    violet: "bg-violet-500/10 text-violet-500",
    amber: "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-[var(--color-muted-foreground)]">{label}</p>
        <p className="font-semibold text-[var(--color-foreground)]">{value}</p>
      </div>
    </div>
  );
}
