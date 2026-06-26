"use client";

import Link from "next/link";
import { Users, UserCheck, UserX, GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { mockUsers } from "@/lib/mock-users";
import { teams } from "@/lib/mock-data";
import type { Session } from "next-auth";
import type { Specialty } from "@/types";
import { cn } from "@/lib/utils";

const SPECIALTIES: { key: Specialty; label: string; color: string; bg: string; bar: string }[] = [
  { key: "EDB",                   label: "EDB",                   color: "text-blue-500",    bg: "bg-blue-500/10",    bar: "bg-blue-500" },
  { key: "Plattformentwicklung",  label: "Plattformentwicklung",  color: "text-violet-500",  bg: "bg-violet-500/10",  bar: "bg-violet-500" },
  { key: "Applikationsentwicklung", label: "Applikationsentwicklung", color: "text-emerald-500", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
];

export function GbvDashboard({ user }: { user: Session["user"] }) {
  const lernende    = mockUsers.filter((u) => u.role === "lernender");
  const trainer     = mockUsers.filter((u) => u.role === "praxisbildner");
  const activeL     = lernende.filter((u) => u.active);
  const inactiveL   = lernende.filter((u) => !u.active);
  const activeT     = trainer.filter((u) => u.active);
  const inactiveT   = trainer.filter((u) => !u.active);

  const bySpecialty = SPECIALTIES.map(({ key, ...rest }) => {
    const all    = lernende.filter((u) => u.specialty === key);
    const active = all.filter((u) => u.active);
    return { key, ...rest, total: all.length, active: active.length, inactive: all.length - active.length };
  });

  const maxTotal = Math.max(...bySpecialty.map((s) => s.total), 1);

  const byLehrjahr = [1, 2, 3, 4].map((j) => ({
    j,
    count: lernende.filter((u) => u.lehrjahr === j).length,
  }));
  const maxLj = Math.max(...byLehrjahr.map((l) => l.count), 1);

  const trainerWithTeam = trainer.map((t) => ({
    ...t,
    team: teams.find((team) => team.id === t.teamId),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-1">GBV / Lehrmeister</p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
          Hallo, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">Übersicht Grundbildung</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={<GraduationCap size={18} />}
          label="Lernende total"
          value={lernende.length}
          sub={`${activeL.length} aktiv · ${inactiveL.length} inaktiv`}
          color="blue"
        />
        <KpiCard
          icon={<UserCheck size={18} />}
          label="Aktive Lernende"
          value={activeL.length}
          sub="aktuell in Ausbildung"
          color="emerald"
        />
        <KpiCard
          icon={<Users size={18} />}
          label="Praxisbildner"
          value={trainer.length}
          sub={`${activeT.length} aktiv · ${inactiveT.length} inaktiv`}
          color="violet"
        />
        <KpiCard
          icon={<BookOpen size={18} />}
          label="Ausbildungsteams"
          value={teams.length}
          sub={`${teams.reduce((a, t) => a + t.openSlots, 0)} offene Plätze`}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lernende by Fachrichtung */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-semibold text-[var(--color-foreground)] mb-5">Lernende nach Fachrichtung</h2>
          <div className="flex flex-col gap-5">
            {bySpecialty.map(({ key, label, color, bg, bar, total, active, inactive }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex w-2 h-2 rounded-full", bar)} />
                    <span className="text-sm font-medium text-[var(--color-foreground)]">{label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                    <span className="text-emerald-500 font-medium">{active} aktiv</span>
                    {inactive > 0 && <span className="text-[var(--color-muted-foreground)]">{inactive} inaktiv</span>}
                    <span className={cn("font-bold", color)}>{total} total</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", bar)}
                    style={{ width: `${(total / maxTotal) * 100}%` }}
                  />
                </div>
                {/* Lehrjahr breakdown per specialty */}
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((j) => {
                    const cnt = mockUsers.filter(
                      (u) => u.role === "lernender" && u.specialty === key && u.lehrjahr === j
                    ).length;
                    return (
                      <div key={j} className={cn("flex flex-col items-center px-2 py-1 rounded-md text-xs", bg)}>
                        <span className={cn("font-bold", color)}>{cnt}</span>
                        <span className="text-[var(--color-muted-foreground)]">{j}. Lj</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lehrjahr overview */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-semibold text-[var(--color-foreground)] mb-5">Nach Lehrjahr</h2>
          <div className="flex flex-col gap-4">
            {byLehrjahr.map(({ j, count }) => (
              <div key={j}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-[var(--color-foreground)]">{j}. Lehrjahr</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                    style={{ width: `${(count / maxLj) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-medium text-[var(--color-foreground)] mb-3">Status</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Aktiv
                </span>
                <span className="font-semibold text-emerald-500">{activeL.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-muted-foreground)]" /> Inaktiv
                </span>
                <span className="font-semibold text-[var(--color-muted-foreground)]">{inactiveL.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Praxisbildner Tabelle */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-foreground)]">Praxisbildner</h2>
          <Link href="/admin/users" className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1">
            Verwalten <ArrowRight size={12} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/40">
              {["Name", "Team", "Plätze offen", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainerWithTeam.map((t) => (
              <tr key={t.id} className={cn(
                "border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[var(--color-muted)]/30",
                !t.active && "opacity-60"
              )}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{t.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {t.team ? (
                    <Link href={`/teams/${t.team.id}`} className="text-sm text-[var(--color-accent)] hover:opacity-80">
                      {t.team.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-[var(--color-muted-foreground)]">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full border",
                    (t.team?.openSlots ?? 0) > 0
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                  )}>
                    {t.team?.openSlots ?? 0} offen
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
                    t.active
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", t.active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]")} />
                    {t.active ? "Aktiv" : "Deaktiviert"}
                    {t.deactivatedUntil && (
                      <span className="ml-0.5">bis {new Date(t.deactivatedUntil).toLocaleDateString("de-CH")}</span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lernende Detail-Tabelle */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-foreground)]">Alle Lernenden</h2>
          <Link href="/admin/users" className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1">
            Verwalten <ArrowRight size={12} />
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/40">
              {["Name", "Fachrichtung", "Lehrjahr", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lernende.map((u) => {
              const sp = SPECIALTIES.find((s) => s.key === u.specialty);
              return (
                <tr key={u.id} className={cn(
                  "border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/30 transition-colors",
                  !u.active && "opacity-60"
                )}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] flex items-center justify-center text-xs font-semibold shrink-0">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--color-foreground)]">{u.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {sp ? (
                      <span className={cn("inline-flex text-xs font-medium px-2 py-0.5 rounded-full", sp.bg, sp.color)}>
                        {sp.label}
                      </span>
                    ) : <span className="text-xs text-[var(--color-muted-foreground)]">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--color-foreground)]">
                      {u.lehrjahr ? `${u.lehrjahr}. Lehrjahr` : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
                      u.active
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", u.active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]")} />
                      {u.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  color: "blue" | "emerald" | "violet" | "amber";
}) {
  const colors = {
    blue:    "bg-blue-500/10 text-blue-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    violet:  "bg-violet-500/10 text-violet-500",
    amber:   "bg-amber-500/10 text-amber-500",
  };
  return (
    <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className={cn("inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3", colors[color])}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
      <p className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{label}</p>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>
    </div>
  );
}
