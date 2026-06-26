"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, ExternalLink, Search } from "lucide-react";
import { teams as initialTeams } from "@/lib/mock-data";
import type { Team } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminTeamsPage() {
  const [teams] = useState<Team[]>(initialTeams);
  const [search, setSearch] = useState("");

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.trainerName.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Teams</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
          {teams.length} Ausbildungsteams · Onepager werden direkt vom Praxisbildner bearbeitet.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Team oder Ausbildner suchen…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
        />
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
              {["Team", "Abteilung", "Ausbildner", "Plätze", "Tags", "Aktionen"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((team) => (
              <tr key={team.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{team.name}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-[var(--color-muted-foreground)]">{team.department}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-sm text-[var(--color-foreground)]">{team.trainerName}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{team.trainerEmail}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full border",
                    team.openSlots > 0
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                  )}>
                    {team.openSlots} offen
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {team.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                        {tag}
                      </span>
                    ))}
                    {team.tags.length > 2 && (
                      <span className="text-xs text-[var(--color-muted-foreground)]">+{team.tags.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/teams/${team.id}/edit`}
                      title="Onepager bearbeiten"
                      className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)] hover:bg-[var(--color-muted)] transition-colors"
                    >
                      <Pencil size={13} />
                    </Link>
                    <Link
                      href={`/teams/${team.id}`}
                      title="Onepager ansehen"
                      className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
                    >
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
