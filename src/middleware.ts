import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { Role } from "@/types";

const { auth } = NextAuth(authConfig);

const ROLE_ROUTES: { pattern: RegExp; allow: Role[] }[] = [
  { pattern: /^\/admin/, allow: ["admin", "gbv"] },
  { pattern: /^\/teams\/[^/]+\/edit/, allow: ["admin", "gbv", "praxisbildner"] },
];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const role = session?.user?.role as Role | undefined;

  for (const { pattern, allow } of ROLE_ROUTES) {
    if (pattern.test(nextUrl.pathname)) {
      if (!role || !allow.includes(role)) {
        return Response.redirect(new URL("/unauthorized", nextUrl));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
