import type { Role, Specialty } from "@/types";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  teamId?: string;
  specialty?: Specialty;
  lehrjahr?: 1 | 2 | 3 | 4;
  createdAt: string;
  deactivatedUntil?: string;
}

export const mockUsers: AppUser[] = [
  // Admin
  { id: "1", name: "Admin User", email: "admin@example.ch", role: "admin", active: true, createdAt: "2024-08-01" },

  // GBV
  { id: "2", name: "Franziska Meier", email: "franziska.meier@example.ch", role: "gbv", active: true, createdAt: "2024-08-05" },

  // Praxisbildner
  { id: "3", name: "Thomas Müller", email: "thomas.mueller@example.ch", role: "praxisbildner", active: true, teamId: "software-dev", createdAt: "2024-08-10" },
  { id: "4", name: "Sandra Keller", email: "sandra.keller@example.ch", role: "praxisbildner", active: true, teamId: "infrastruktur", createdAt: "2024-08-10" },
  { id: "5", name: "Michael Brun", email: "michael.brun@example.ch", role: "praxisbildner", active: false, teamId: "datenschutz", createdAt: "2024-08-10", deactivatedUntil: "2025-09-01" },
  { id: "6", name: "Lisa Vogt", email: "lisa.vogt@example.ch", role: "praxisbildner", active: true, teamId: "projektmanagement", createdAt: "2024-08-10" },
  { id: "7", name: "Kevin Ziegler", email: "kevin.ziegler@example.ch", role: "praxisbildner", active: true, teamId: "data-analytics", createdAt: "2024-08-10" },
  { id: "8", name: "Anna Schmid", email: "anna.schmid@example.ch", role: "praxisbildner", active: true, teamId: "support", createdAt: "2024-08-10" },

  // Lernende — EDB
  { id: "9",  name: "Jan Huber",          email: "jan.huber@example.ch",         role: "lernender", active: true,  specialty: "EDB",                   lehrjahr: 2, createdAt: "2025-01-15" },
  { id: "10", name: "Mia Baumann",        email: "mia.baumann@example.ch",       role: "lernender", active: true,  specialty: "EDB",                   lehrjahr: 1, createdAt: "2025-01-15" },
  { id: "11", name: "Noah Gerber",        email: "noah.gerber@example.ch",       role: "lernender", active: true,  specialty: "EDB",                   lehrjahr: 3, createdAt: "2024-08-15" },
  { id: "12", name: "Lena Fischer",       email: "lena.fischer@example.ch",      role: "lernender", active: true,  specialty: "EDB",                   lehrjahr: 4, createdAt: "2023-08-15" },

  // Lernende — Plattformentwicklung
  { id: "13", name: "Luca Roth",          email: "luca.roth@example.ch",         role: "lernender", active: true,  specialty: "Plattformentwicklung",  lehrjahr: 2, createdAt: "2025-01-15" },
  { id: "14", name: "Sofia Wagner",       email: "sofia.wagner@example.ch",      role: "lernender", active: true,  specialty: "Plattformentwicklung",  lehrjahr: 1, createdAt: "2025-01-15" },
  { id: "15", name: "Tim Müller",         email: "tim.mueller@example.ch",       role: "lernender", active: false, specialty: "Plattformentwicklung",  lehrjahr: 3, createdAt: "2024-08-15" },

  // Lernende — Applikationsentwicklung
  { id: "16", name: "Nils Zimmermann",    email: "nils.zimmermann@example.ch",   role: "lernender", active: true,  specialty: "Applikationsentwicklung", lehrjahr: 2, createdAt: "2025-01-15" },
  { id: "17", name: "Emma Keller",        email: "emma.keller@example.ch",       role: "lernender", active: true,  specialty: "Applikationsentwicklung", lehrjahr: 1, createdAt: "2025-01-15" },
  { id: "18", name: "Jonas Weber",        email: "jonas.weber@example.ch",       role: "lernender", active: true,  specialty: "Applikationsentwicklung", lehrjahr: 3, createdAt: "2024-08-15" },
  { id: "19", name: "Sara Brunner",       email: "sara.brunner@example.ch",      role: "lernender", active: true,  specialty: "Applikationsentwicklung", lehrjahr: 4, createdAt: "2023-08-15" },
  { id: "20", name: "Felix Maier",        email: "felix.maier@example.ch",       role: "lernender", active: false, specialty: "Applikationsentwicklung", lehrjahr: 2, createdAt: "2025-01-15" },
];
