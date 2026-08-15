"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

import { FIELD_CONFIG } from "../../lib/constants";
import { mockSignIn } from "../../lib/mock-auth";
import { FormField } from "../../shared/components/FormField";
import { SubmitButton } from "../../shared/components/SubmitButton";

export function SignInForm() {
  const router = useRouter();

  // --- State ---------------------------------------------------------------
  const [error, setError] = useState<string | null>(null); // bind this to your error UI
  const [isSubmitting, setIsSubmitting] = useState(false); // bind this to your loading spinner

  // --- Handlers ------------------------------------------------------------
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // 1. Data capture
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    // 2. Empty-field validation
    if (!email || !password) {
      setError("Please enter both your email and password.");
      return; // <-- UI: `error` now holds the message to display
    }

    // 3. Mock async authentication (~1s simulated latency)
    setIsSubmitting(true); // <-- UI: show your loading spinner here
    try {
      const result = await mockSignIn(email, password);

      if (!result.success) {
        setError(result.error); // e.g. "Invalid email or password"
        return; // <-- UI: `error` now holds the message to display
      }

      // 4. Success — token + role are already in localStorage (set by mockSignIn).
      // Redirect to the role's protected route.
      router.push(result.redirectPath);
    } finally {
      setIsSubmitting(false); // <-- UI: hide your loading spinner here
    }
  }

  // --- Render (existing UI, unchanged except the two marked lines) ---------
  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {/* CHANGED: was <form> */}
      <FormField
        name="email"
        label={FIELD_CONFIG.email.label}
        placeholder={FIELD_CONFIG.email.placeholder}
        type={FIELD_CONFIG.email.type}
      />
      <FormField
        name="password"
        label={FIELD_CONFIG.password.label}
        placeholder={FIELD_CONFIG.password.placeholder}
        type={FIELD_CONFIG.password.type}
      />
      {/* UI: render your inline error message here, e.g.
          {error && <p className="text-sm text-destructive">{error}</p>} */}
      <div className="mb-5">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-secondary-text hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      {/* SubmitButton already shows a spinner while the form is pending via
          useFormStatus; `isSubmitting` is available if you prefer to drive
          your own loading UI from state instead. */}
      <SubmitButton>Sign in</SubmitButton>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </form>
  );
}
