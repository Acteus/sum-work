import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Create an account · Sumwork",
  description: "Create an account for your Sumwork shared ledger.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
