"use server";

import { createClient } from "@/utils/supabase/server";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function signInWithMagicLink(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { status: "error", message: "A valid email address is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    // Supabase returns "Email not confirmed" or similar if the user doesn't exist
    // and shouldCreateUser is false. Surface a safe message.
    return {
      status: "error",
      message:
        error.status === 422
          ? "No account found for that email address."
          : "Could not send sign-in link. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Sign-in link sent. Check your inbox and click the link to access your ledger.",
  };
}

export async function signUpWithEmail(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const name = formData.get("name");

  if (typeof email !== "string" || !email.trim()) {
    return { status: "error", message: "A valid email address is required." };
  }

  if (typeof name !== "string" || !name.trim()) {
    return { status: "error", message: "A display name is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
      data: { display_name: name.trim() },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "Could not create account. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Account created. Check your inbox and click the link to access your ledger.",
  };
}
