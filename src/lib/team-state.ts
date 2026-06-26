/**
 * In-memory team active/inactive state.
 * Persists as long as the Next.js server process runs — sufficient for the demo.
 * Replace with a DB table (e.g. Supabase) when the backend is wired up.
 */

const deactivatedTeams = new Map<string, { until?: string }>();

export function isTeamActive(teamId: string): boolean {
  return !deactivatedTeams.has(teamId);
}

export function getDeactivatedUntil(teamId: string): string | undefined {
  return deactivatedTeams.get(teamId)?.until;
}

export function deactivateTeam(teamId: string, until?: string): void {
  deactivatedTeams.set(teamId, { until });
}

export function activateTeam(teamId: string): void {
  deactivatedTeams.delete(teamId);
}

export function getDeactivatedTeamIds(): string[] {
  return Array.from(deactivatedTeams.keys());
}
