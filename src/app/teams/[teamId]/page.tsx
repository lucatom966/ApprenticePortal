import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User, Pencil } from "lucide-react";
import { teams } from "@/lib/mock-data";
import { auth } from "@/auth";
import { isTeamActive, getDeactivatedUntil } from "@/lib/team-state";
import { SpecialtyBadge } from "@/components/ui/specialty-badge";
import { DeactivateToggle } from "@/components/teams/deactivate-toggle";

export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = teams.find((t) => t.id === teamId);
  if (!team) notFound();

  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const userTeamId = session.user.teamId;
  const isManager = role === "gbv" || role === "admin";
  const canEdit = isManager || (role === "praxisbildner" && userTeamId === teamId);
  const canApply = role === "lernender";

  const active = isTeamActive(teamId);
  const deactivatedUntil = getDeactivatedUntil(teamId);

  const mailtoLink = `mailto:${team.trainerEmail}?cc=${team.gbvEmail}&subject=Stage-Anfrage%3A%20${encodeURIComponent(team.name)}&body=Guten%20Tag%20${encodeURIComponent(team.trainerName)}%2C%0A%0AIch%20interessiere%20mich%20f%C3%BCr%20eine%20Stage%20im%20Team%20${encodeURIComponent(team.name)}.%0A%0AFreundliche%20Gr%C3%BCsse`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Zurück zu Teams
        </Link>

        <div className="flex items-center gap-2">
          {isManager && (
            <DeactivateToggle
              teamId={teamId}
              teamName={team.name}
              active={active}
              deactivatedUntil={deactivatedUntil}
            />
          )}
          {canEdit && (
            <Link
              href={`/teams/${teamId}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              <Pencil size={13} />
              Bearbeiten
            </Link>
          )}
        </div>
      </div>

      {/* Deactivated banner — nur für Manager sichtbar */}
      {!active && isManager && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
          <span className="font-medium">Onepager deaktiviert</span>
          {deactivatedUntil && (
            <span className="text-xs opacity-80">
              · reaktiviert am {new Date(deactivatedUntil).toLocaleDateString("de-CH")}
            </span>
          )}
          <span className="ml-auto text-xs opacity-70">Lernende sehen diesen Onepager nicht.</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wider mb-2">
          {team.department}
        </p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight mb-4">{team.name}</h1>

        {team.suitableFor.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-2 uppercase tracking-wide">
              Geeignet für
            </p>
            <div className="flex flex-wrap gap-2">
              {team.suitableFor.map((s) => (
                <SpecialtyBadge key={s} specialty={s} size="md" />
              ))}
            </div>
          </div>
        )}

        {team.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {team.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] mb-10">
        {team.onepager.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-[var(--color-foreground)] leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Trainer info */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          <User size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)]">{team.trainerName}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">Praxisbildner / Ausbildner</p>
        </div>
        {team.openSlots > 0 && (
          <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            {team.openSlots} Platz{team.openSlots > 1 ? "plätze" : ""} offen
          </span>
        )}
      </div>

      {/* Bewerben — nur für Lernende, nur wenn aktiv */}
      {canApply && active && (
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={mailtoLink}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Mail size={16} />
            Für Stage bewerben
          </a>
          <Link
            href="/teams"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] font-medium hover:bg-[var(--color-muted)] transition-colors"
          >
            Andere Teams anschauen
          </Link>
        </div>
      )}
    </div>
  );
}
