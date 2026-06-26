"use client";

import Link from "next/link";
import { Users, BookOpen, CalendarDays, GraduationCap, ArrowRight, UserCheck, Shield } from "lucide-react";
import { mockUsers } from "@/lib/mock-users";
import { teams, events } from "@/lib/mock-data";
import { SPECIALTY_COLORS, SPECIALTY_LABELS, type Specialty } from "@/types";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";

const SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin", gbv: "GBV", praxisbildner: "Praxisbildner", lernender: "Lernender",
};

export function ManagerDashboard({ user }: { user: Session["user"] }) {
  const role = user.role;
  const lernende  = mockUsers.filter((u) => u.role === "lernender");
  const trainer   = mockUsers.filter((u) => u.role === "praxisbildner");
  const activeL   = lernende.filter((u) => u.active);
  const activeT   = trainer.filter((u) => u.active);
  const inactiveT = trainer.filter((u) => !u.active);

  const bySpecialty = SPECIALTIES.map((key) => {
    const all    = lernende.filter((u) => u.specialty === key);
    const active = all.filter((u) => u.active);
    return { key, total: all.length, active: active.length };
  });
  const maxTotal = Math.max(...bySpecialty.map((s) => s.total), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-1">
          {ROLE_LABEL[role]}
        </p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
          Hallo, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">Übersicht Grundbildung & Portal</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <GraduationCap size={18} />, label: "Lernende",      value: lernende.length, sub: `${activeL.length} aktiv`,  color: "blue"    },
          { icon: <UserCheck size={18} />,     label: "Praxisbildner", value: trainer.length,  sub: `${activeT.length} aktiv · ${inactiveT.length} inaktiv`, color: "violet"  },
          { icon: <BookOpen size={18} />,      label: "Teams",         value: teams.length,    sub: `${teams.reduce((a, t) => a + t.openSlots, 0)} offene Plätze`, color: "amber"   },
          { icon: <CalendarDays size={18} />,  label: "Events",        value: events.length,   sub: "kommende Termine",          color: "emerald" },
        ].map(({ icon, label, value, sub, color }) => (
          <KpiCard key={label} icon={icon} label={label} value={value} sub={sub} color={color as "blue" | "violet" | "amber" | "emerald"} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Fachrichtung breakdown */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-semibold text-[var(--color-foreground)] mb-5">Lernende nach Fachrichtung</h2>
          <div className="flex flex-col gap-5">
            {bySpecialty.map(({ key, total, active }) => {
              const { bg, text, border } = SPECIALTY_COLORS[key];
              const barColor = bg.replace("/10", "").replace("bg-", "bg-");
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {SPECIALTY_LABELS[key]}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-500 font-medium">{active} aktiv</span>
                      <span className={cn("font-bold", text)}>{total} total</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", bg.replace("/10", "").replace("bg-", "bg-").includes("amber") ? "bg-amber-500" : bg.replace("/10", "").replace("bg-", "bg-").includes("violet") ? "bg-violet-500" : "bg-blue-500")}
                      style={{ width: `${(total / maxTotal) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4].map((j) => {
                      const cnt = mockUsers.filter(
                        (u) => u.role === "lernender" && u.specialty === key && u.lehrjahr === j
                      ).length;
                      return (
                        <div key={j} className={cn("flex flex-col items-center px-2 py-1 rounded-md text-xs", bg)}>
                          <span className={cn("font-bold", text)}>{cnt}</span>
                          <span className="text-[var(--color-muted-foreground)]">{j}. Lj</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <h2 className="font-semibold text-[var(--color-foreground)] mb-3">Verwaltung</h2>
            <div className="flex flex-col gap-1">
              {[
                { href: "/admin/users",  label: "Benutzer",  sub: `${mockUsers.length} Konten` },
                { href: "/admin/teams",  label: "Teams",     sub: `${teams.length} Teams` },
                { href: "/admin/events", label: "Events",    sub: `${events.length} Events` },
              ].map(({ href, label, sub }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{sub}</p>
                  </div>
                  <ArrowRight size={13} className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-accent)] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Praxisbildner table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
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
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainer.map((t) => {
              const team = teams.find((tm) => tm.id === t.teamId);
              return (
                <tr key={t.id} className={cn("border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/30 transition-colors", !t.active && "opacity-60")}>
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
                    {team ? (
                      <Link href={`/teams/${team.id}`} className="text-sm text-[var(--color-accent)] hover:opacity-80">{team.name}</Link>
                    ) : <span className="text-sm text-[var(--color-muted-foreground)]">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border",
                      (team?.openSlots ?? 0) > 0
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                    )}>
                      {team?.openSlots ?? 0} offen
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
                      t.active
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", t.active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]")} />
                      {t.active ? "Aktiv" : "Deaktiviert"}
                      {t.deactivatedUntil && <span className="ml-0.5 opacity-70">bis {new Date(t.deactivatedUntil).toLocaleDateString("de-CH")}</span>}
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

function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number; sub: string;
  color: "blue" | "violet" | "amber" | "emerald";
}) {
  const colors = {
    blue:    "bg-blue-500/10 text-blue-500",
    violet:  "bg-violet-500/10 text-violet-500",
    amber:   "bg-amber-500/10 text-amber-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };
  return (
    <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className={cn("inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3", colors[color])}>{icon}</div>
      <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
      <p className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{label}</p>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>
    </div>
  );
}
