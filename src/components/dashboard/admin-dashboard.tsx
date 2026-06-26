"use client";

import Link from "next/link";
import { Users, BookOpen, CalendarDays, Shield, ArrowRight, UserX } from "lucide-react";
import { mockUsers } from "@/lib/mock-users";
import { teams, events } from "@/lib/mock-data";
import type { Session } from "next-auth";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin", gbv: "GBV", praxisbildner: "Praxisbildner", lernender: "Lernender",
};
const ROLE_COLOR: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  gbv: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  praxisbildner: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  lernender: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export function AdminDashboard({ user }: { user: Session["user"] }) {
  const active   = mockUsers.filter((u) => u.active);
  const inactive = mockUsers.filter((u) => !u.active);
  const lernende = mockUsers.filter((u) => u.role === "lernender");
  const trainer  = mockUsers.filter((u) => u.role === "praxisbildner");

  const recentUsers = mockUsers.slice(0, 6);

  const stats = [
    { label: "Benutzer gesamt", value: mockUsers.length, sub: `${active.length} aktiv`, icon: <Users size={18} />, color: "blue" as const },
    { label: "Lernende",        value: lernende.length,  sub: `${lernende.filter(u=>u.active).length} aktiv`, icon: <Shield size={18} />, color: "emerald" as const },
    { label: "Praxisbildner",   value: trainer.length,   sub: `${trainer.filter(u=>u.active).length} aktiv`, icon: <Users size={18} />, color: "violet" as const },
    { label: "Teams",           value: teams.length,     sub: `${teams.reduce((a,t)=>a+t.openSlots,0)} Plätze offen`, icon: <BookOpen size={18} />, color: "amber" as const },
    { label: "Events",          value: events.length,    sub: "kommende Termine", icon: <CalendarDays size={18} />, color: "blue" as const },
    { label: "Deaktiviert",     value: inactive.length,  sub: "Konten inaktiv", icon: <UserX size={18} />, color: "red" as const },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-[var(--color-accent)] mb-1">Administrator</p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">
          Hallo, {user.name?.split(" ")[0]}
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-1">Systemübersicht ApprenticePortal</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon, color }) => {
          const colors: Record<string, string> = {
            blue:    "bg-blue-500/10 text-blue-500",
            emerald: "bg-emerald-500/10 text-emerald-500",
            violet:  "bg-violet-500/10 text-violet-500",
            amber:   "bg-amber-500/10 text-amber-500",
            red:     "bg-red-500/10 text-red-500",
          };
          return (
            <div key={label} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className={cn("inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3", colors[color])}>
                {icon}
              </div>
              <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
              <p className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{label}</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="font-semibold text-[var(--color-foreground)] mb-4">Schnellzugriff</h2>
          <div className="flex flex-col gap-2">
            {[
              { href: "/admin/users",  label: "Benutzer verwalten",  sub: `${mockUsers.length} Konten` },
              { href: "/admin/teams",  label: "Teams verwalten",     sub: `${teams.length} Teams` },
              { href: "/admin/events", label: "Events verwalten",    sub: `${events.length} Events` },
              { href: "/dashboard",    label: "GBV-Übersicht",       sub: "Statistiken Grundbildung" },
            ].map(({ href, label, sub }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[var(--color-muted)] transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{label}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{sub}</p>
                </div>
                <ArrowRight size={14} className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-accent)] transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="font-semibold text-[var(--color-foreground)]">Benutzer</h2>
            <Link href="/admin/users" className="text-xs text-[var(--color-accent)] hover:opacity-80 flex items-center gap-1">
              Alle <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {recentUsers.map((u) => (
              <div key={u.id} className={cn("flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-muted)]/30 transition-colors", !u.active && "opacity-60")}>
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                  {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{u.name}</p>
                </div>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", ROLE_COLOR[u.role])}>
                  {ROLE_LABEL[u.role]}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
                  u.active
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", u.active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]")} />
                  {u.active ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
