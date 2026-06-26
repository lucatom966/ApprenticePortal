import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { findDemoUser } from "@/lib/demo-users";
import type { Role } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = findDemoUser(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.teamId ?? null,
        };
      },
    }),
    /**
     * SSO placeholder — add One Identity OIDC provider here:
     *
     * import OneIdentity from "next-auth/providers/..."
     * OneIdentity({
     *   clientId: process.env.SSO_CLIENT_ID,
     *   clientSecret: process.env.SSO_CLIENT_SECRET,
     *   issuer: process.env.SSO_ISSUER_URL,
     * }),
     *
     * Then in the jwt callback below, read the groups claim and call
     * resolveRoleFromGroups(token.groups as string[]) to set token.role.
     */
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.teamId = (user as { teamId?: string }).teamId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as Role;
      session.user.teamId = token.teamId as string | null;
      return session;
    },
  },
  session: { strategy: "jwt" },
});
