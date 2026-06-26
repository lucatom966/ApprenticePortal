import type { Role } from "@/types";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  teamId?: string;
}

/**
 * Demo credentials — one per role.
 * In production these are replaced by SSO (One Identity OIDC).
 * Passwords are plain-text only for the demo phase.
 */
export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-admin",
    name: "Admin Demo",
    email: "admin@portal.ch",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: "demo-gbv",
    name: "GBV Demo",
    email: "gbv@portal.ch",
    password: "Gbv123!",
    role: "gbv",
  },
  {
    id: "demo-trainer",
    name: "Thomas Müller",
    email: "trainer@portal.ch",
    password: "Trainer123!",
    role: "praxisbildner",
    teamId: "software-dev",
  },
  {
    id: "demo-lernender",
    name: "Jan Huber",
    email: "lernend@portal.ch",
    password: "Lernend123!",
    role: "lernender",
  },
];

export function findDemoUser(email: string, password: string): DemoUser | null {
  return (
    DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    ) ?? null
  );
}
