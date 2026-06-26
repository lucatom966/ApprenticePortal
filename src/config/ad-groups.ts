import type { Role } from "@/types";

/**
 * Maps Active Directory group names to application roles.
 *
 * When One Identity SSO (OIDC) is connected, the ID token will contain a
 * "groups" claim with the user's AD group memberships. Pass that array to
 * resolveRoleFromGroups() — the rest is automatic.
 *
 * AD group names must match exactly what One Identity sends in the token.
 * Example claim: { "groups": ["APP_Admins", "IT_Staff", ...] }
 */
export const AD_GROUP_ROLE_MAP: Record<string, Role> = {
  APP_Admins: "admin",
  APP_GBV: "gbv",
  APP_Praxisbildner: "praxisbildner",
  APP_Lernende: "lernender",
};

const ROLE_PRIORITY: Role[] = ["admin", "gbv", "praxisbildner", "lernender"];

/**
 * Resolves a single app role from an array of AD group names.
 * If a user is in multiple groups, the highest-priority role wins.
 */
export function resolveRoleFromGroups(groups: string[]): Role | null {
  const matched = new Set(
    groups.map((g) => AD_GROUP_ROLE_MAP[g]).filter(Boolean) as Role[]
  );
  return ROLE_PRIORITY.find((r) => matched.has(r)) ?? null;
}

export const ROLE_PERMISSIONS = {
  admin: {
    canEditTeams: true,
    canManageUsers: true,
    canManageEvents: true,
    canViewAdmin: true,
    canApply: false,
  },
  gbv: {
    canEditTeams: true,
    canManageUsers: true,
    canManageEvents: true,
    canViewAdmin: true,
    canApply: false,
  },
  praxisbildner: {
    canEditTeams: true,
    canManageUsers: false,
    canManageEvents: true,
    canViewAdmin: false,
    canApply: false,
  },
  lernender: {
    canEditTeams: false,
    canManageUsers: false,
    canManageEvents: false,
    canViewAdmin: false,
    canApply: true,
  },
} satisfies Record<Role, Record<string, boolean>>;
