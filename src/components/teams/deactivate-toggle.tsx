"use client";

import { useState, useTransition } from "react";
import { EyeOff, Eye, X } from "lucide-react";
import { deactivateTeamAction, activateTeamAction } from "@/app/actions/team-actions";
import { cn } from "@/lib/utils";

interface Props {
  teamId: string;
  teamName: string;
  active: boolean;
  deactivatedUntil?: string;
}

export function DeactivateToggle({ teamId, teamName, active, deactivatedUntil }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [until, setUntil] = useState(deactivatedUntil ?? "");
  const [pending, startTransition] = useTransition();

  function handleDeactivate() {
    startTransition(async () => {
      await deactivateTeamAction(teamId, until || undefined);
      setShowModal(false);
    });
  }

  function handleActivate() {
    startTransition(async () => {
      await activateTeamAction(teamId);
    });
  }

  if (!active) {
    return (
      <button
        onClick={handleActivate}
        disabled={pending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
      >
        <Eye size={13} />
        Reaktivieren
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
      >
        <EyeOff size={13} />
        Deaktivieren
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                <EyeOff size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Onepager deaktivieren</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{teamName}</p>
              </div>
            </div>

            <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
              Der Onepager wird für Lernende ausgeblendet. GBV und Admin sehen ihn weiterhin als inaktiv markiert.
            </p>

            <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1.5">
              Aktiv wieder ab (optional)
            </label>
            <input
              type="date"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors mb-5"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeactivate}
                disabled={pending}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg font-medium transition-opacity",
                  "bg-amber-500 text-white hover:opacity-90 disabled:opacity-50"
                )}
              >
                {pending ? "…" : "Deaktivieren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
