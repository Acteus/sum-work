import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in · Sumwork",
  description: "Sign in to your Sumwork shared ledger.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
