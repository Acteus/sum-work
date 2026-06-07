import type { Metadata } from "next";
import { Dashboard } from "@/features/ledger/components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard · Sumwork",
  description: "Your Sumwork ledger dashboard.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
