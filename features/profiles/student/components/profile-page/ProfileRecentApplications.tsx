"use client";

// Section 3 — Recent Applications: the 3 most recent applications from the
// SHARED applications context. Because this subscribes to the same provider
// the Trainings page applies into, a new application appears here instantly —
// no refresh, no manual sync.

import { FileText } from "lucide-react";

import { useApplications } from "@/shared/components/providers/ApplicationsProvider";
import { formatApplicationDate } from "@/features/applications/student/components/my-applications/constants";
import { STATUS_BADGE_CLASSES } from "@/features/applications/student/components/applications-snapshot/constants";

export function ProfileRecentApplications() {
  const { recentApplications } = useApplications();
  const recent = recentApplications(3);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-medium text-primary-text">
          <FileText className="h-5 w-5" />
          Recent Applications
        </h2>
      </div>

      {recent.length > 0 ? (
        <ul className="flex flex-col">
          {recent.map((app) => (
            <li
              key={app.id}
              className="flex flex-col gap-1.5 border-t border-border py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-medium text-foreground">
                  {app.companyName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {app.listingTitle}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <time className="font-mono text-xs text-muted-foreground">
                  {formatApplicationDate(app.appliedOn)}
                </time>
                <span
                  className={
                    "rounded-full px-2.5 py-0.5 text-xs font-medium " +
                    STATUS_BADGE_CLASSES[app.status]
                  }
                >
                  {app.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No applications yet — applications you submit will appear here.
        </p>
      )}
    </section>
  );
}
