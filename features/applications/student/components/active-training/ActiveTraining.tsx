"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Motion from "@/shared/components/animation/Motion";
import { fadeInUp } from "@/shared/lib/animations";
import { TRAINING_MODE_LABELS } from "./constants";
import { NoActiveTraining } from "./NoActiveTraining";
import { TrialCountdown } from "../../../shared/components/trial-countdown/TrialCountdown";
import type { ActiveApplication } from "../../types";
import ActiveTrainingCard from "./ActiveTrainingCard";
import { useApplications } from "@/shared/components/providers/ApplicationsProvider";

// ActiveTraining: orchestrator — shows the trial /normal /empty presentation.
// The active training is now DERIVED from the shared applications context:
// the newest Accepted application becomes the active training (null when none).
export function ActiveTraining() {
  // --- Shared state + derivation ---------------------------------------------
  const { applications } = useApplications();

  const accepted = applications
    .filter((application) => application.status === "Accepted")
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))[0];

  const active: ActiveApplication | null = accepted
    ? {
        id: accepted.id,
        company: accepted.companyName,
        listingTitle: accepted.listingTitle,
        mode: accepted.trial ? "paid_trial" : "full_time",
        trialDaysRemaining: accepted.trial?.daysRemaining,
        startedOn: accepted.appliedOn,
      }
    : null;

  const isTrial = active?.mode === "paid_trial";

  return (
    <Motion
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center justify-between gap-2">
        {/* Header */}
        <h2 className="text-base font-semibold text-primary-text">
          Active training
        </h2>

        {/* Mode label for paid trial, part-time, full-time */}
        {active ? (
          <span className="shrink-0 rounded-full bg-secondary-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-text">
            {TRAINING_MODE_LABELS[active.mode]}
          </span>
        ) : null}
      </div>

      {/* Active training card */}
      {active ? (
        <div className="mt-4 flex flex-1 flex-col">
          <ActiveTrainingCard
            company={active.company}
            listingTitle={active.listingTitle}
          />

          {/* Start date */}
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Started {active.startedOn}
          </p>

          {/* Trial countdown */}
          {isTrial && active.trialDaysRemaining ? (
            <TrialCountdown daysRemaining={active.trialDaysRemaining} />
          ) : null}

          <Link
            href="/applications"
            className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View application
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      ) : (
        <NoActiveTraining />
      )}
    </Motion>
  );
}
