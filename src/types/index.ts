export type Role = "lernender" | "praxisbildner" | "gbv" | "admin";
export type Specialty = "EDB" | "Plattformentwicklung" | "Applikationsentwicklung";

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  EDB:                    "EDB – Entwickler digitales Business",
  Plattformentwicklung:   "Plattformentwicklung",
  Applikationsentwicklung:"Applikationsentwicklung",
};

export const SPECIALTY_COLORS: Record<Specialty, { bg: string; text: string; border: string }> = {
  EDB:                    { bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",   border: "border-amber-500/30" },
  Plattformentwicklung:   { bg: "bg-violet-500/10",  text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/30" },
  Applikationsentwicklung:{ bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400",     border: "border-blue-500/30" },
};

export interface Team {
  id: string;
  name: string;
  department: string;
  trainerName: string;
  trainerEmail: string;
  gbvEmail: string;
  description: string;
  onepager: string;
  tags: string[];
  suitableFor: Specialty[];
  openSlots: number;
  active: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
