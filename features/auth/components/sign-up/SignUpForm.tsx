"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "../../shared/components/FormField";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { RoleSelector } from "./role-selector/RoleSelector";
import { FIELD_CONFIG } from "../../lib/constants";
import { saveRegisterDraft } from "../../lib/mock-auth";
import Footer from "./footer/Footer";

export function SignUpForm() {
  const router = useRouter();

  // --- Step 1 state ----------------------------------------------------------
  const [role, setRole] = useState<"student" | "company">("student");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({}); // bind to your field-level error UI

  const isCompany = role === "company";

  // --- Next action: validate Step 1, persist the draft, go to Step 2 ---------
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Data capture
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const companyName = String(formData.get("companyName") ?? "").trim();

    // 2. Validation (per-field errors keyed by input name)
    const nextErrors: Record<string, string> = {};

    if (!fullName) nextErrors.fullName = "Full name is required.";
    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords don't match.";
    }
    if (isCompany && !companyName) {
      nextErrors.companyName = "Company name is required.";
    }
    if (!termsAccepted) {
      nextErrors.terms = "You must agree to the Terms of Service.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return; // <-- UI: `errors` holds the messages to display

    // 3. Persist the Step 1 draft (sessionStorage) so Step 2 can combine it
    //    without losing data, then proceed.
    saveRegisterDraft({
      role,
      fullName,
      email,
      password,
      companyName: isCompany ? companyName : undefined,
    });

    router.push("/profile-information");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <RoleSelector value={role} onChange={setRole} />
      <input type="hidden" name="role" value={role} />

      <FormField
        name="fullName"
        label={FIELD_CONFIG.fullName.label}
        type={FIELD_CONFIG.fullName.type}
        placeholder={FIELD_CONFIG.fullName.placeholder}
      />

      <FormField
        name="email"
        label={FIELD_CONFIG.email.label}
        type={FIELD_CONFIG.email.type}
        placeholder={FIELD_CONFIG.email.placeholder}
      />

      <FormField
        name="password"
        type={FIELD_CONFIG.password.type}
        label={FIELD_CONFIG.password.label}
        placeholder={FIELD_CONFIG.password.placeholder}
      />

      <FormField
        name="confirmPassword"
        label={FIELD_CONFIG.confirmPassword.label}
        type={FIELD_CONFIG.confirmPassword.type}
        placeholder={FIELD_CONFIG.confirmPassword.placeholder}
      />

      {isCompany ? (
        <FormField
          name="companyName"
          label={FIELD_CONFIG.companyName.label}
          type={FIELD_CONFIG.companyName.type}
          placeholder={FIELD_CONFIG.companyName.placeholder}
        />
      ) : null}

      {/* Terms checkbox — controlled so its state survives validation re-renders.
          The Radix Checkbox does not submit through FormData reliably, so the
          checked state is tracked here and validated manually above. */}
      <Footer termsAccepted={termsAccepted} onTermsChange={setTermsAccepted} />

      {/* UI: render your inline error summary here, e.g.
          {Object.values(errors)[0] && (
            <p className="text-sm text-error-fg">{Object.values(errors)[0]}</p>
          )} */}

      <SubmitButton>Next</SubmitButton>
      {/* UI: render your inline error summary here, e.g.*/}
      {Object.values(errors)[0] && (
        <p className="text-sm text-error-fg">{Object.values(errors)[0]}</p>
      )}
    </form>
  );
}
