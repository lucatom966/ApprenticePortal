import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User } from "lucide-react";
import { teams } from "@/lib/mock-data";

export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const team = teams.find((t) => t.id === teamId);

  if (!team) notFound();

  const mailtoLink = `mailto:${team.trainerEmail}?cc=${team.gbvEmail}&subject=Stage-Anfrage%3A%20${encodeURIComponent(team.name)}&body=Guten%20Tag%20${encodeURIComponent(team.trainerName)}%2C%0A%0AIch%20interessiere%20mich%20f%C3%BCr%20eine%20Stage%20im%20Team%20${encodeURIComponent(team.name)}.%0A%0AFreundliche%20Gr%C3%BCsse`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-8 transition-colors"
      >
        <ArrowLeft size={14} />
        Zurück zu Teams
      </Link>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium text-[var(--color-accent)] uppercase tracking-wider mb-2">
          {team.department}
        </p>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight mb-4">{team.name}</h1>
        <div className="flex flex-wrap gap-1.5">
          {team.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Onepager */}
      <div className="prose prose-sm max-w-none mb-10">
        <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          {team.onepager.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-[var(--color-foreground)] leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Trainer Info */}
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

      {/* Apply CTA */}
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
    </div>
  );
}
