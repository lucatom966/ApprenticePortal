import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 mb-5">
        <ShieldX size={28} />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">Kein Zugriff</h1>
      <p className="text-[var(--color-muted-foreground)] text-sm max-w-sm mb-7">
        Du hast keine Berechtigung, diese Seite aufzurufen. Wende dich an einen Administrator.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
