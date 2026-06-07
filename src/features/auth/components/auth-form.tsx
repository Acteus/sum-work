"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInWithMagicLink,
  signUpWithEmail,
  type AuthActionState,
} from "@/server/actions/auth";

type AuthFormProps = {
  mode: "login" | "register";
  /** Optional error forwarded from the confirm callback (e.g. invalid-link). */
  initialError?: string;
};

const content = {
  login: {
    eyebrow: "Welcome back",
    title: "Your shared life,\nback in balance.",
    description:
      "Enter your email and we will send you a secure link to your ledger.",
    submitLabel: "Email me a sign-in link",
    alternatePrompt: "New to Sumwork?",
    alternateLabel: "Create an account",
    alternateHref: "/register",
  },
  register: {
    eyebrow: "Start a shared ledger",
    title: "Less awkward math.\nMore good plans.",
    description:
      "Create your account, then invite the people you split everyday life with.",
    submitLabel: "Create my account",
    alternatePrompt: "Already have an account?",
    alternateLabel: "Sign in",
    alternateHref: "/login",
  },
} as const;

const idle: AuthActionState = { status: "idle", message: "" };

export function AuthForm({ mode, initialError }: AuthFormProps) {
  const action = mode === "login" ? signInWithMagicLink : signUpWithEmail;
  const [state, formAction, isPending] = useActionState(action, idle);

  const copy = content[mode];
  const isRegister = mode === "register";

  const statusMessage =
    state.status !== "idle"
      ? state.message
      : initialError === "invalid-link"
        ? "That sign-in link is invalid or has expired. Please request a new one."
        : "We will only use your email for account access and ledger updates.";

  const statusColor =
    state.status === "error" ||
    (state.status === "idle" && initialError)
      ? "var(--orange)"
      : state.status === "success"
        ? "#8fc4ad"
        : "rgba(242, 239, 230, 0.58)";

  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link className="brand" href="/" aria-label="Sumwork home">
          sum<span>/</span>work
        </Link>
        <p>Shared expenses, settled fairly.</p>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>
            {copy.title.split("\n").map((line, index) => (
              <span key={line}>
                {index === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
          <p className="auth-description">{copy.description}</p>

          <div className="auth-assurance" aria-label="Account benefits">
            <span>01</span>
            <p>
              <strong>One link. No password.</strong>
              Secure access without another password to remember.
            </p>
          </div>
          <div className="auth-assurance" aria-label="Account benefits">
            <span>02</span>
            <p>
              <strong>Your records stay private.</strong>
              Only people in your groups can see shared activity.
            </p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-heading">
            <span>{isRegister ? "New account" : "Account access"}</span>
            <b aria-hidden="true">{isRegister ? "02" : "01"}</b>
          </div>

          {state.status === "success" ? (
            <div className="auth-success" aria-live="polite">
              <p>{state.message}</p>
              <p className="auth-success-hint">
                Didn&apos;t receive it?{" "}
                <button
                  className="auth-resend"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form className="auth-form" action={formAction}>
              {isRegister ? (
                <label>
                  <span>Display name</span>
                  <input
                    autoComplete="name"
                    name="name"
                    placeholder="How friends know you"
                    required
                    type="text"
                    disabled={isPending}
                  />
                </label>
              ) : null}

              <label>
                <span>Email address</span>
                <input
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  disabled={isPending}
                />
              </label>

              <button
                className="auth-submit"
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
              >
                {isPending ? "Sending…" : copy.submitLabel}
                <span aria-hidden="true">→</span>
              </button>

              <p
                className="auth-status"
                aria-live="polite"
                style={{ color: statusColor }}
              >
                {statusMessage}
              </p>
            </form>
          )}

          <div className="auth-alternate">
            <span>{copy.alternatePrompt}</span>
            <Link href={copy.alternateHref}>{copy.alternateLabel}</Link>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <Link href="/">← Back to the public demo</Link>
        <span>PHP · private groups · exact-cent records</span>
      </footer>
    </main>
  );
}
