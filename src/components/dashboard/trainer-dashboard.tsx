"use client";

import Link from "next/link";
import { Pencil, ArrowRight, CalendarDays, Users, CheckCircle } from "lucide-react";
import { teams, events } from "@/lib/mock-data";
import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

export function TrainerDashboard({ user }: Props) {
  const teamId = user.teamId;
  const myTeam = teamId ? teams.find((t) => t.id === teamId) : null;

  const upcoming = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-1">Praxisbildner</p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
          Hallo, {user.name?.split(" ")[0]}
        </h1>
        {myTeam && (
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Team: <span className="font-medium text-[var(--color-foreground)]">{myTeam.name}</span>
          </p>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Offene Plätze</p>
            <p className="font-bold text-xl text-[var(--color-foreground)]">{myTeam?.openSlots ?? 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Mein Team</p>
            <p className="font-semibold text-[var(--color-foreground)] truncate">{myTeam?.name ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <CalendarDays size={18} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-muted-foreground)]">Nächste Events</p>
            <p className="font-bold text-xl text-[var(--color-foreground)]">{upcoming.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Onepager */}
        {myTeam ? (
          <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[var(--color-foreground)]">Mein Onepager</h2>
              <Link
                href={`/teams/${myTeam.id}`}
                className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1"
              >
                Ansehen <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {myTeam.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-3 leading-relaxed mb-4">
              {myTeam.description}
            </p>
            <Link
              href={`/teams/${myTeam.id}/edit`}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              <Pencil size={14} />
              Onepager bearbeiten
            </Link>
          </section>
        ) : (
          <section className="rounded-xl border border-dashed border-[var(--color-border)] p-5 flex items-center justify-center">
            <p className="text-sm text-[var(--color-muted-foreground)]">Noch kein Team zugewiesen.</p>
          </section>
        )}

        {/* Events */}
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
