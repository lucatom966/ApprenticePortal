"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Clock, MapPin, X, ChevronDown } from "lucide-react";
import { events as initialEvents } from "@/lib/mock-data";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Events</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">{events.length} Events verwalten</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={15} />
          Event erstellen
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((event) => {
          const date = new Date(event.date);
          const day = date.toLocaleDateString("de-CH", { day: "2-digit" });
          const month = date.toLocaleDateString("de-CH", { month: "short" });
          const weekday = date.toLocaleDateString("de-CH", { weekday: "long" });

          return (
            <div
              key={event.id}
              className="flex items-start gap-5 p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
            >
              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-accent)]/10 shrink-0 text-[var(--color-accent)]">
                <span className="text-xl font-bold leading-none">{day}</span>
                <span className="text-xs font-medium uppercase">{month}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--color-foreground)] mb-1">{event.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted-foreground)] mb-2">
                  <span className="flex items-center gap-1"><Calendar size={11} />{weekday}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{event.time} Uhr</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2">{event.description}</p>
              </div>
              <button
                onClick={() => setDeleteTarget(event)}
                className="flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-muted-foreground)] hover:text-red-500 hover:bg-[var(--color-muted)] transition-colors shrink-0"
                title="Event löschen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-muted-foreground)] text-sm mb-3">Noch keine Events erstellt.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            >
              Ersten Event erstellen →
            </button>
          </div>
        )}
      </div>

      {showAdd && (
        <AddEventModal
          onClose={() => setShowAdd(false)}
          onAdd={(e) => setEvents((prev) => [e, ...prev])}
        />
      )}

      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-500 shrink-0">
              <Trash2 size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">Event löschen</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{deleteTarget.title}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
            Dieser Event wird unwiderruflich gelöscht.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => { setEvents((p) => p.filter((e) => e.id !== deleteTarget.id)); setDeleteTarget(null); }}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Löschen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AddEventModal({ onClose, onAdd }: { onClose: () => void; onAdd: (e: Event) => void }) {
  const [form, setForm] = useState({ title: "", date: "", time: "09:00", location: "", description: "" });
  const [error, setError] = useState("");

  function set(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date || !form.location) {
      setError("Titel, Datum und Ort sind Pflichtfelder.");
      return;
    }
    onAdd({ id: crypto.randomUUID(), createdBy: "Admin", ...form });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold text-[var(--color-foreground)] mb-5">Neuen Event erstellen</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Titel *">
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event-Titel" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Datum *">
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Uhrzeit">
            <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Ort *">
          <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="z.B. Regierungsgebäude, Raum A" className={inputCls} />
        </Field>
        <Field label="Beschreibung">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Kurze Beschreibung des Events…" className={cn(inputCls, "resize-none")} />
        </Field>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end mt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors">
            Abbrechen
          </button>
          <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity">
            Erstellen
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
