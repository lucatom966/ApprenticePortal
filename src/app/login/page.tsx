"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { role: "Lernender", email: "lernend@portal.ch", password: "Lernend123!" },
  { role: "Praxisbildner", email: "trainer@portal.ch", password: "Trainer123!" },
  { role: "GBV", email: "gbv@portal.ch", password: "Gbv123!" },
  { role: "Admin", email: "admin@portal.ch", password: "Admin123!" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-Mail oder Passwort ungültig.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  function fillDemo(acc: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-background)]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-accent)]">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--color-foreground)]">ApprenticePortal</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-7">
          <h1 className="text-xl font-bold text-[var(--color-foreground)] mb-1">Anmelden</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
            Melde dich mit deinem Konto an.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1.5">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.ch"
                required
                autoComplete="email"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-foreground)] mb-1.5">Passwort</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={cn(inputCls, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Anmelden
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/50 p-5">
          <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
            Demo-Zugänge
          </p>
          <div className="flex flex-col gap-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors text-left group"
              >
                <div>
                  <span className="text-xs font-medium text-[var(--color-foreground)]">{acc.role}</span>
                  <span className="text-xs text-[var(--color-muted-foreground)] ml-2">{acc.email}</span>
                </div>
                <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Ausfüllen →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";
