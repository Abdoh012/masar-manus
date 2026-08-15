"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { showError, showSuccess } from "@/shared/lib/notifications";
import { useApplications } from "@/shared/components/providers/ApplicationsProvider";

import { APPLY_COPY } from "./constants";

interface ApplyCtaProps {
  listingId: string;
  listingTitle: string;
  companyName: string;
  mayLeadToHire?: boolean;
  appliedByDefault?: boolean;
}

// Student apply CTA (FR-016). "use client": applies through the SHARED
// applications context — the new application is written to localStorage and
// is immediately visible on the My Applications page and in the Profile
// page's Recent Applications section. Duplicate applies are rejected with an
// error toast, and the CTA switches to the already-applied status (FR-017).

export function ApplyCta({
  listingId,
  listingTitle,
  companyName,
  mayLeadToHire,
  appliedByDefault = false,
}: ApplyCtaProps) {
  // --- Shared state ----------------------------------------------------------
  const { apply, hasApplied } = useApplications();

  // --- Local UI state --------------------------------------------------------
  const [error, setError] = useState<string | null>(null); // bind to your error UI

  // Applied if the shared store already contains this listing (persists across
  // reloads via localStorage), or the mock marks it as applied by default.
  const alreadyApplied = appliedByDefault || hasApplied(listingId);

  // --- Handler ---------------------------------------------------------------
  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = apply(listingId, { listingTitle, companyName, mayLeadToHire });

    if (!result.success) {
      setError(result.error);      // <-- UI: inline error message
      showError(result.error);     // <-- UI: toast feedback
      return;
    }

    showSuccess(APPLY_COPY.success); // <-- UI: success toast; button now shows "Applied"
  }

  if (alreadyApplied) {
    return (
      <div role="status" className="rounded-xl border border-primary-tint bg-primary-tint/50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary-text">
          <CheckCircle2 aria-hidden="true" className="size-5 text-primary" />
          {APPLY_COPY.applied}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{APPLY_COPY.appliedMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-4">
      <h2 className="font-sans text-base font-semibold text-foreground">{APPLY_COPY.title}</h2>
      <div className="space-y-1.5">
        <Label htmlFor={`apply-note-${listingId}`}>{APPLY_COPY.noteLabel}</Label>
        <Input
          id={`apply-note-${listingId}`}
          name="note"
          placeholder={APPLY_COPY.notePlaceholder}
        />
      </div>

      {/* UI: render your inline error message here, e.g.
          {error && <p className="text-sm text-error-fg">{error}</p>} */}

      <Button type="submit">{APPLY_COPY.button}</Button>
    </form>
  );
}
