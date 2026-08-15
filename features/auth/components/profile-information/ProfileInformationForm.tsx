"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PROFILE_INFO_FIELDS } from "../../lib/constants";
import {
  mockRegister,
  readRegisterDraft,
  type RegisterDraft,
} from "../../lib/mock-auth";
import { SubmitButton } from "../../shared/components/SubmitButton";
import { ProfileField } from "./ProfileField";

export function ProfileInformationForm() {
  const router = useRouter();

  // --- Step 2 state ----------------------------------------------------------
  // The Step 1 draft (role/fullName/email/password/companyName), loaded from
  // sessionStorage on mount. `null` while loading, `undefined` when missing.
  const [draft, setDraft] = useState<RegisterDraft | null>(null);
  const [draftMissing, setDraftMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);      // bind to your error UI
  const [isSubmitting, setIsSubmitting] = useState(false);      // bind to your loading spinner

  // Load the Step 1 draft on mount. If the user landed here without completing
  // Step 1 (direct URL entry, cleared session), send them back to sign-up.
  useEffect(() => {
    const stored = readRegisterDraft();
    if (stored) {
      setDraft(stored);
    } else {
      setDraftMissing(true);
      router.replace("/sign-up");
    }
  }, [router]);

  // --- Register action: combine Step 1 + Step 2, write to the mock DB --------
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!draft) return; // draft still loading or redirecting back to Step 1

    // 1. Data capture (Step 2 fields)
    const formData = new FormData(event.currentTarget);
    const profile = {
      userField: String(formData.get("userField") ?? "").trim(),
      specialist: String(formData.get("specialist") ?? "").trim(),
      university: String(formData.get("university") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || undefined,
    };

    // 2. Required-field validation (description is optional)
    if (!profile.userField || !profile.specialist || !profile.university) {
      setError("Please fill in your field, specialist, and university.");
      return; // <-- UI: `error` now holds the message to display
    }

    // 3. Mock async registration (~1s latency). Checks the localStorage users
    //    array for a duplicate email, then saves the combined user object.
    setIsSubmitting(true); // <-- UI: show your loading spinner here
    try {
      const result = await mockRegister(draft, profile);

      if (!result.success) {
        setError(result.error); // e.g. "An account with this email already exists."
        return; // <-- UI: `error` now holds the message to display
      }

      // 4. Success — the user is now in the localStorage users array and can
      //    log in immediately. Redirect to the Login page.
      router.push("/sign-in");
    } finally {
      setIsSubmitting(false); // <-- UI: hide your loading spinner here
    }
  }

  // While the draft loads (or while redirecting back to Step 1), render the
  // form inert — fields stay visible but submission is a no-op.
  if (draftMissing) return null;

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ProfileField
        name="userField"
        label={PROFILE_INFO_FIELDS.userField.label}
        placeholder={PROFILE_INFO_FIELDS.userField.placeholder}
      />

      <ProfileField
        name="specialist"
        label={PROFILE_INFO_FIELDS.specialist.label}
        placeholder={PROFILE_INFO_FIELDS.specialist.placeholder}
      />

      <ProfileField
        name="university"
        label={PROFILE_INFO_FIELDS.university.label}
        placeholder={PROFILE_INFO_FIELDS.university.placeholder}
      />

      <ProfileField
        name="description"
        label={PROFILE_INFO_FIELDS.description.label}
        placeholder={PROFILE_INFO_FIELDS.description.placeholder}
        optional
      />

      {/* UI: render your inline error message here, e.g.
          {error && <p className="text-sm text-error-fg">{error}</p>} */}

      <SubmitButton>Register</SubmitButton>
    </form>
  );
}
