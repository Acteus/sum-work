import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in · Sumwork",
  description: "Sign in to your Sumwork shared ledger.",
};

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <AuthForm mode="login" initialError={error} />;
}
