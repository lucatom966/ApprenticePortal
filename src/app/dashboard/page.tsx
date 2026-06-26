import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LernenderDashboard } from "@/components/dashboard/lernender-dashboard";
import { TrainerDashboard } from "@/components/dashboard/trainer-dashboard";
import { GbvDashboard } from "@/components/dashboard/gbv-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;

  if (role === "admin")         return <AdminDashboard user={session.user} />;
  if (role === "gbv")           return <GbvDashboard user={session.user} />;
  if (role === "praxisbildner") return <TrainerDashboard user={session.user} />;
  return <LernenderDashboard user={session.user} />;
}
