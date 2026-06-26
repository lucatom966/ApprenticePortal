import { Users, BookOpen, CalendarDays, TrendingUp } from "lucide-react";
import { mockUsers } from "@/lib/mock-users";
import { teams, events } from "@/lib/mock-data";

const stats = [
  {
    label: "Benutzer",
    value: mockUsers.length,
    sub: `${mockUsers.filter((u) => u.active).length} aktiv`,
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Teams",
    value: teams.length,
    sub: `${teams.reduce((a, t) => a + t.openSlots, 0)} offene Plätze`,
    icon: BookOpen,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Events",
    value: events.length,
    sub: "kommende Events",
    icon: CalendarDays,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Lernende",
    value: mockUsers.filter((u) => u.role === "lernender").length,
    sub: "aktive Lernende",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function AdminPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Übersicht über das ApprenticePortal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${bg} ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-foreground)]">{value}</p>
            <p className="text-sm font-medium text-[var(--color-foreground)] mt-0.5">{label}</p>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-foreground)]">Neueste Benutzer</h2>
          <a href="/admin/users" className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity">
            Alle anzeigen →
          </a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {["Name", "Rolle", "Status"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockUsers.slice(0, 5).map((user) => (
              <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/40 transition-colors">
                <td className="px-6 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">{user.name}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge active={user.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; className: string }> = {
    admin: { label: "Admin", className: "bg-red-500/10 text-red-500 border-red-500/20" },
    gbv: { label: "GBV", className: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
    praxisbildner: { label: "Praxisbildner", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    lernender: { label: "Lernender", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  };
  const { label, className } = map[role] ?? { label: role, className: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]" };
  return (
    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${
      active
        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-[var(--color-muted-foreground)]"}`} />
      {active ? "Aktiv" : "Deaktiviert"}
    </span>
  );
}
