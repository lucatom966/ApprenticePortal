"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { teams as initialTeams } from "@/lib/mock-data";
import { SPECIALTY_LABELS, SPECIALTY_COLORS, type Team, type Specialty } from "@/types";
import { cn } from "@/lib/utils";
import { SpecialtyBadge } from "@/components/ui/specialty-badge";

const ALL_SPECIALTIES = Object.keys(SPECIALTY_LABELS) as Specialty[];

export default function EditTeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [team, setTeam] = useState<Team | null>(null);
  const [onepager, setOnepager] = useState("");
  const [description, setDescription] = useState("");
  const [openSlots, setOpenSlots] = useState(0);
  const [suitableFor, setSuitableFor] = useState<Specialty[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = initialTeams.find((t) => t.id === teamId);
    if (!found) { router.push("/teams"); return; }

    // Access: Praxisbildner only edits own team; GBV/Admin edit all
    const role = session?.user?.role;
    const canEdit =
      role === "admin" ||
      role === "gbv" ||
      (role === "praxisbildner" && session?.user?.teamId === teamId);
    if (!canEdit) { router.push(`/teams/${teamId}`); return; }

    setTeam(found);
    setOnepager(found.onepager);
    setDescription(found.description);
    setOpenSlots(found.openSlots);
    setSuitableFor(found.suitableFor);
  }, [teamId, session, router]);

  function toggleSpecialty(s: Specialty) {
    setSuitableFor((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!team) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8 gap-4">
        <Link
          href={`/teams/${teamId}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Zurück zum Onepager
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href={`/teams/${teamId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <Eye size={14} />
            Vorschau
          </Link>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg font-medium transition-all",
              saved ? "bg-emerald-500 text-white" : "bg-[var(--color-accent)] text-white hover:opacity-90"
            )}
          >
            <Save size={14} />
            {saved ? "Gespeichert!" : "Speichern"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight mb-1">
          {team.name} bearbeiten
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Dein Team-Onepager für Lernende.</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Fachrichtungen ── */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <label className="block text-sm font-semibold text-[var(--color-foreground)] mb-1">
            Geeignet für Fachrichtung
          </label>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-4">
            Wähle aus, für welche Lernenden diese Stage geeignet ist. Mehrfachauswahl möglich.
          </p>
          <div className="flex flex-col gap-2.5">
            {ALL_SPECIALTIES.map((s) => {
              const checked = suitableFor.includes(s);
              const { bg, text, border } = SPECIALTY_COLORS[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all",
                    checked
                      ? cn(bg, border, text)
                      : "border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-muted)]"
                  )}
                >
                  {/* Checkbox */}
                  <span className={cn(
                    "flex items-center justify-center w-4 h-4 rounded border-2 shrink-0 transition-all",
                    checked ? cn("border-current", bg) : "border-[var(--color-muted-foreground)]"
                  )}>
                    {checked && (
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-current">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1">
                    <p className={cn("text-sm font-medium", checked ? text : "text-[var(--color-foreground)]")}>
                      {SPECIALTY_LABELS[s]}
                    </p>
                  </div>
                  {checked && <SpecialtyBadge specialty={s} size="sm" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Kurzbeschreibung ── */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Kurzbeschreibung
          </label>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-2">
            Erscheint auf der Team-Karte (max. 120 Zeichen).
          </p>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={120}
            className={inputCls}
          />
          <p className="text-xs text-[var(--color-muted-foreground)] mt-1 text-right">{description.length}/120</p>
        </div>

        {/* ── Offene Plätze ── */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Offene Stage-Plätze
          </label>
          <input
            type="number"
            min={0}
            max={10}
            value={openSlots}
            onChange={(e) => setOpenSlots(Number(e.target.value))}
            className={cn(inputCls, "w-24")}
          />
        </div>

        {/* ── Onepager ── */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Onepager — Teamvorstellung
          </label>
          <p className="text-xs text-[var(--color-muted-foreground)] mb-2">
            Absätze mit Leerzeile trennen.
          </p>
          <textarea
            value={onepager}
            onChange={(e) => setOnepager(e.target.value)}
            rows={16}
            className={cn(inputCls, "resize-y leading-relaxed")}
          />
        </div>

        {/* ── Live Preview ── */}
        <div>
          <p className="text-sm font-medium text-[var(--color-foreground)] mb-3">Live-Vorschau</p>
          {suitableFor.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suitableFor.map((s) => <SpecialtyBadge key={s} specialty={s} size="md" />)}
            </div>
          )}
          <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30">
            {onepager.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-[var(--color-foreground)] leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all",
              saved ? "bg-emerald-500 text-white" : "bg-[var(--color-accent)] text-white hover:opacity-90"
            )}
          >
            <Save size={16} />
            {saved ? "Gespeichert!" : "Änderungen speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
