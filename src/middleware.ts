import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { Role } from "@/types";

const { auth } = NextAuth(authConfig);

// Only /admin/* needs a hard role-gate at middleware level.
// All other access differences are handled via show/hide buttons on the same pages.
const ADMIN_ONLY: Role[] = ["admin", "gbv"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const role = session?.user?.role as Role | undefined;

  if (/^\/admin/.test(nextUrl.pathname)) {
    if (!role || !ADMIN_ONLY.includes(role)) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
