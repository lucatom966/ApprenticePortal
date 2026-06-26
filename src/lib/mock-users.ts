export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "lernender" | "praxisbildner" | "gbv" | "admin";
  active: boolean;
  teamId?: string;
  createdAt: string;
  deactivatedUntil?: string;
}

export const mockUsers: AppUser[] = [
  { id: "1", name: "Admin User", email: "admin@example.ch", role: "admin", active: true, createdAt: "2024-08-01" },
  { id: "2", name: "Franziska Meier", email: "franziska.meier@example.ch", role: "gbv", active: true, createdAt: "2024-08-05" },
  { id: "3", name: "Thomas Müller", email: "thomas.mueller@example.ch", role: "praxisbildner", active: true, teamId: "software-dev", createdAt: "2024-08-10" },
  { id: "4", name: "Sandra Keller", email: "sandra.keller@example.ch", role: "praxisbildner", active: true, teamId: "infrastruktur", createdAt: "2024-08-10" },
  { id: "5", name: "Michael Brun", email: "michael.brun@example.ch", role: "praxisbildner", active: false, teamId: "datenschutz", createdAt: "2024-08-10", deactivatedUntil: "2025-03-01" },
  { id: "6", name: "Lisa Vogt", email: "lisa.vogt@example.ch", role: "praxisbildner", active: true, teamId: "projektmanagement", createdAt: "2024-08-10" },
  { id: "7", name: "Kevin Ziegler", email: "kevin.ziegler@example.ch", role: "praxisbildner", active: true, teamId: "data-analytics", createdAt: "2024-08-10" },
  { id: "8", name: "Anna Schmid", email: "anna.schmid@example.ch", role: "praxisbildner", active: true, teamId: "support", createdAt: "2024-08-10" },
  { id: "9", name: "Jan Huber", email: "jan.huber@example.ch", role: "lernender", active: true, createdAt: "2025-01-15" },
  { id: "10", name: "Mia Baumann", email: "mia.baumann@example.ch", role: "lernender", active: true, createdAt: "2025-01-15" },
  { id: "11", name: "Luca Roth", email: "luca.roth@example.ch", role: "lernender", active: true, createdAt: "2025-01-15" },
  { id: "12", name: "Sofia Wagner", email: "sofia.wagner@example.ch", role: "lernender", active: true, createdAt: "2025-01-15" },
  { id: "13", name: "Nils Zimmermann", email: "nils.zimmermann@example.ch", role: "lernender", active: false, createdAt: "2025-01-15" },
];
