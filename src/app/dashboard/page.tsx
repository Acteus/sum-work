import type { Metadata } from "next";
import { Dashboard } from "@/features/ledger/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard · Sumwork",
  description: "Your Sumwork ledger dashboard.",
};

type DashboardPageProps = {
  searchParams: Promise<{ group?: string | string[] }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { group } = await searchParams;
  const activeGroupId = Array.isArray(group) ? group[0] : group;

  return <Dashboard activeGroupId={activeGroupId} />;
}
