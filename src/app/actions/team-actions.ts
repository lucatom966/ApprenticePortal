"use server";

import { auth } from "@/auth";
import { deactivateTeam, activateTeam } from "@/lib/team-state";
import { revalidatePath } from "next/cache";

async function requireGbvOrAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "gbv" && role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function deactivateTeamAction(teamId: string, until?: string) {
  await requireGbvOrAdmin();
  deactivateTeam(teamId, until);
  revalidatePath("/teams");
  revalidatePath(`/teams/${teamId}`);
}

export async function activateTeamAction(teamId: string) {
  await requireGbvOrAdmin();
  activateTeam(teamId);
  revalidatePath("/teams");
  revalidatePath(`/teams/${teamId}`);
}
