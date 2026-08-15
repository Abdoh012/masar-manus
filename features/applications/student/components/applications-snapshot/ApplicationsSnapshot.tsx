"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import Motion from "@/shared/components/animation/Motion";
import { fadeInUp } from "@/shared/lib/animations";
import {
  APPLICATION_STATUSES,
  STATUS_COUNT_KEYS,
} from "./constants";
import type { StatusCounts } from "../../types";
import { RecentApplicationRow } from "./RecentApplicationRow";
import { StatusCountBadge } from "./StatusCountBadge";
import { useApplications } from "@/shared/components/providers/ApplicationsProvider";
import { formatApplicationDate } from "../my-applications/constants";

const COUNTS_ZERO: StatusCounts = {
  applied: 0,
  accepted: 0,
  rejected: 0,
  withdrawn: 0,
};

// ApplicationsSnapshot: status-count tiles + up to 3 recent rows, or the empty
// state. Metrics are now CALCULATED from the shared applications context (the
// same live list as the My Applications page) — nothing is hardcoded.
export function ApplicationsSnapshot() {
  // --- Shared state ----------------------------------------------------------
  const { applications, recentApplications } = useApplications();

  // --- Calculated metrics ----------------------------------------------------
  // Total per status, derived from the live list.
  const statusCounts: StatusCounts = applications.reduce<StatusCounts>(
    (counts, application) => {
      const key = STATUS_COUNT_KEYS[application.status];
      counts[key] += 1;
      return counts;
    },
    { ...COUNTS_ZERO },
  );

  // Up to 3 most recent rows, shaped for the existing RecentApplicationRow UI.
  const recentRows = recentApplications(3).map((application) => ({
    id: application.id,
    companyName: application.companyName,
    listingTitle: application.listingTitle,
    status: application.status,
    appliedOn: formatApplicationDate(application.appliedOn),
  }));

  const isEmpty =
    statusCounts.applied === COUNTS_ZERO.applied &&
    statusCounts.accepted === COUNTS_ZERO.accepted &&
    statusCounts.rejected === COUNTS_ZERO.rejected &&
    statusCounts.withdrawn === COUNTS_ZERO.withdrawn &&
    recentRows.length === 0;

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
          Applications snapshot
        </h2>

        {/* If there are applications, show "View all applications" button */}
        {!isEmpty ? (
          <Link
            href="/applications"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary-text transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View all applications
          </Link>
        ) : null}
      </div>

      {/* If there are no applications, show the empty state */}
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center">
          <FileText
            aria-hidden="true"
            className="size-6 text-muted-foreground"
          />
          <p className="text-sm font-semibold text-foreground">
            No applications yet
          </p>
          <p className="text-xs text-muted-foreground">
            Applications you submit will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Status count tiles — always 4 columns (2 on mobile) */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {APPLICATION_STATUSES.map((status) => (
              <StatusCountBadge
                key={status}
                label={status}
                count={statusCounts[STATUS_COUNT_KEYS[status]]}
                status={status}
              />
            ))}
          </div>

          {/* Recent applications list (up to 3 rows) */}
          <ul className="mt-2">
            {recentRows.map((row) => (
              <RecentApplicationRow key={row.id} row={row} />
            ))}
          </ul>
        </>
      )}
    </Motion>
  );
}
