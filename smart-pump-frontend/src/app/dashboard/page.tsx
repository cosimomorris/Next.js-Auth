import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { Session } from "next-auth";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions)) as Session;

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardContent session={session} />;
}
