export type Role = "lernender" | "praxisbildner" | "gbv" | "admin";

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
  openSlots: number;
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
