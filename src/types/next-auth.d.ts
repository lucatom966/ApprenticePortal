import type { DefaultSession } from "next-auth";
import type { Role } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
      teamId: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    teamId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    teamId?: string | null;
  }
}
