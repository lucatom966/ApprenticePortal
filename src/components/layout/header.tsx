"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  gbv: "GBV",
  praxisbildner: "Praxisbildner",
  lernender: "Lernender",
};

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500",
  gbv: "bg-violet-500/10 text-violet-500",
  praxisbildner: "bg-blue-500/10 text-blue-500",
  lernender: "bg-emerald-500/10 text-emerald-500",
};

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  const navItems = [
    { label: "Teams", href: "/teams" },
    { label: "Events", href: "/events" },
    ...(role === "admin" || role === "gbv" ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)]">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:block">ApprenticePortal</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {status === "authenticated" && session.user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-medium text-[var(--color-foreground)] leading-none">
                    {session.user.name}
                  </p>
                  {role && (
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 inline-block", ROLE_COLOR[role])}>
                      {ROLE_LABEL[role]}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Abmelden"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
            >
              <Shield size={13} />
              Login
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
