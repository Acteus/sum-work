"use server";

import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

async function getEmailRedirectTo() {
  const requestHeaders = await headers();
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const requestOrigin = requestHeaders.get("origin")?.trim();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.trim();
  const forwardedProto =
    requestHeaders.get("x-forwarded-proto")?.trim() ?? "https";
  const forwardedOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : "";
  const isConfiguredLocalhost =
    configuredSiteUrl?.includes("localhost") ||
    configuredSiteUrl?.includes("127.0.0.1");
  const isRequestLocalhost =
    requestOrigin?.includes("localhost") ||
    requestOrigin?.includes("127.0.0.1") ||
    forwardedHost?.includes("localhost") ||
    forwardedHost?.includes("127.0.0.1");
  const siteUrl =
    isConfiguredLocalhost && !isRequestLocalhost
      ? requestOrigin || forwardedOrigin
      : configuredSiteUrl || requestOrigin || forwardedOrigin;

  if (!siteUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL and request origin for auth callback.",
    );
  }

  return new URL("/auth/confirm", siteUrl).toString();
}

function logAuthError(action: string, error: { message: string; status?: number }) {
  console.error(`[auth] ${action} failed`, {
    message: error.message,
    status: error.status,
  });
}

function getAuthErrorMessage(
  fallback: string,
  error: { message: string; status?: number },
) {
  if (error.status === 429) {
    const retryAfter = error.message.match(/after (\d+) seconds/i)?.[1];

    return retryAfter
      ? `Please wait ${retryAfter} seconds before requesting another email.`
      : "Please wait a moment before requesting another email.";
  }

  return fallback;
}

export async function signInWithMagicLink(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { status: "error", message: "A valid email address is required." };
  }

  const supabase = await createClient();
  const emailRedirectTo = await getEmailRedirectTo();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: false,
      emailRedirectTo,
    },
  });

  if (error) {
    logAuthError("sign in", error);
    // Supabase returns "Email not confirmed" or similar if the user doesn't exist
    // and shouldCreateUser is false. Surface a safe message.
    return {
      status: "error",
      message:
        error.status === 422
          ? "No account found for that email address."
          : getAuthErrorMessage(
              "Could not send sign-in link. Please try again.",
              error,
            ),
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
  const emailRedirectTo = await getEmailRedirectTo();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
      data: { display_name: name.trim() },
      emailRedirectTo,
    },
  });

  if (error) {
    logAuthError("sign up", error);
    return {
      status: "error",
      message: getAuthErrorMessage(
        "Could not create account. Please try again.",
        error,
      ),
    };
  }

  return {
    status: "success",
    message:
      "Account created. Check your inbox and click the link to access your ledger.",
  };
}
