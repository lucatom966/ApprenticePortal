import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Team } from "@/types";
import { cn } from "@/lib/utils";
import { SpecialtyBadge } from "@/components/ui/specialty-badge";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "group relative flex flex-col gap-4 p-6 rounded-xl border border-[var(--color-border)]",
        "bg-[var(--color-card)] hover:border-[var(--color-accent)]/40",
        "transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-accent)]/5",
        "hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider mb-1">
            {team.department}
          </p>
          <h3 className="font-semibold text-[var(--color-foreground)] leading-tight">{team.name}</h3>
        </div>
        {team.openSlots > 0 && (
          <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {team.openSlots} offen
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed line-clamp-2">
        {team.description}
      </p>

      {/* Fachrichtungen */}
      {team.suitableFor.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {team.suitableFor.map((s) => (
            <SpecialtyBadge key={s} specialty={s} size="sm" />
          ))}
        </div>
      )}

      {/* Tech tags */}
      {team.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {team.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-md bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border)]">
        <span className="text-xs text-[var(--color-muted-foreground)]">{team.trainerName}</span>
        <ArrowRight
          size={14}
          className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </Link>
  );
}
