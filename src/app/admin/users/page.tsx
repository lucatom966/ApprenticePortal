"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, PowerOff, Power, X, ChevronDown } from "lucide-react";
import { mockUsers, type AppUser } from "@/lib/mock-users";
import { cn } from "@/lib/utils";

const ROLES = ["lernender", "praxisbildner", "gbv", "admin"] as const;

const roleLabel: Record<string, string> = {
  admin: "Admin",
  gbv: "GBV",
  praxisbildner: "Praxisbildner",
  lernender: "Lernender",
};

const roleBadge: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  gbv: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  praxisbildner: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  lernender: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AppUser | null>(null);
  const [deactivateUntil, setDeactivateUntil] = useState("");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function toggleActive(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (user.active) {
      setDeactivateTarget(user);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, active: true, deactivatedUntil: undefined } : u)));
    }
  }

  function confirmDeactivate() {
    if (!deactivateTarget) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === deactivateTarget.id
          ? { ...u, active: false, deactivatedUntil: deactivateUntil || undefined }
          : u
      )
    );
    setDeactivateTarget(null);
    setDeactivateUntil("");
  }

  function deleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteTarget(null);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Benutzer</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            {users.length} Benutzer · {users.filter((u) => u.active).length} aktiv · {users.filter((u) => !u.active).length} deaktiviert
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={16} />
          Benutzer hinzufügen
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name oder E-Mail suchen…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer"
          >
            <option value="all">Alle Rollen</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{roleLabel[r]}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
              {["Benutzer", "Rolle", "Status", "Deaktiviert bis", "Aktionen"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-[var(--color-muted-foreground)]">
                  Keine Benutzer gefunden.
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  "border-b border-[var(--color-border)] last:border-0 transition-colors hover:bg-[var(--color-muted)]/30",
                  !user.active && "opacity-60"
                )}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center text-xs font-semibold shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{user.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn("inline-flex text-xs font-medium px-2 py-0.5 rounded-full border", roleBadge[user.role])}>
                    {roleLabel[user.role]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border",
                    user.active
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", user.active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]")} />
                    {user.active ? "Aktiv" : "Deaktiviert"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {user.deactivatedUntil ? (
                    <span className="text-xs text-[var(--color-muted-foreground)]">
                      bis {new Date(user.deactivatedUntil).toLocaleDateString("de-CH")}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-muted-foreground)]">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <ActionButton
                      onClick={() => toggleActive(user.id)}
                      title={user.active ? "Deaktivieren" : "Aktivieren"}
                      className={user.active ? "hover:text-amber-500" : "hover:text-emerald-500"}
                    >
                      {user.active ? <PowerOff size={15} /> : <Power size={15} />}
                    </ActionButton>
                    <ActionButton
                      onClick={() => setDeleteTarget(user)}
                      title="Löschen"
                      className="hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAdd && <AddUserModal onClose={() => setShowAdd(false)} onAdd={(u) => setUsers((prev) => [u, ...prev])} />}

      {/* Deactivate Modal */}
      {deactivateTarget && (
        <Modal onClose={() => setDeactivateTarget(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
              <PowerOff size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">Benutzer deaktivieren</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{deactivateTarget.name}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
            Der Benutzer kann sich nicht mehr einloggen. Optional kannst du ein Reaktivierungsdatum setzen.
          </p>
          <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1.5">
            Aktiv wieder ab (optional)
          </label>
          <input
            type="date"
            value={deactivateUntil}
            onChange={(e) => setDeactivateUntil(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-accent)] mb-5"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeactivateTarget(null)}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={confirmDeactivate}
              className="px-4 py-2 text-sm rounded-lg bg-amber-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Deaktivieren
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-500 shrink-0">
              <Trash2 size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">Benutzer löschen</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">{deleteTarget.name}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
            Dieser Benutzer wird unwiderruflich gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => deleteUser(deleteTarget.id)}
              className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              Endgültig löschen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  title,
  className,
  children,
}: {
  onClick: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onAdd }: { onClose: () => void; onAdd: (u: AppUser) => void }) {
  const [form, setForm] = useState({ name: "", email: "", role: "lernender" as AppUser["role"] });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name und E-Mail sind Pflichtfelder.");
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    });
    onClose();
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold text-[var(--color-foreground)] mb-5">Neuen Benutzer hinzufügen</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name *">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Vorname Nachname"
            className={inputCls}
          />
        </Field>
        <Field label="E-Mail *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="vorname.nachname@example.ch"
            className={inputCls}
          />
        </Field>
        <Field label="Rolle">
          <div className="relative">
            <select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AppUser["role"] }))}
              className={cn(inputCls, "appearance-none pr-8 cursor-pointer")}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{roleLabel[r]}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] pointer-events-none" />
          </div>
        </Field>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end mt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Hinzufügen
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

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
