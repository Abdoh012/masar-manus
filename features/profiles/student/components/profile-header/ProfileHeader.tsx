"use client";

import { useEffect, useState } from "react";

import Motion from "@/shared/components/animation/Motion";
import { fadeInUp } from "@/shared/lib/animations";
import { PROFILE } from "./constants";
import { ProfileCompletionPrompt } from "./ProfileCompletionPrompt";
import {
  getSessionUser,
  type SessionUser,
} from "@/features/auth/lib/mock-auth";

export function ProfileHeader() {
  // --- Session state -----------------------------------------------------------
  // The logged-in user, resolved from localStorage (mock JWT + users array).
  // Falls back to the shared PROFILE mock when nobody is logged in (e.g. when
  // browsing the dashboard without going through the mock sign-in).
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setSessionUser(getSessionUser(PROFILE.name));
  }, []);

  // --- Derived display values ----------------------------------------------------
  // Real session data wins (registration profile fields); the shared PROFILE
  // mock fills gaps for seeded users or logged-out browsing — same rule as
  // the Profile page's info card.
  const name = sessionUser?.name ?? PROFILE.name;
  const field = sessionUser?.userField ?? PROFILE.field;
  const studies = sessionUser?.university ?? PROFILE.studies;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Motion
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        {/* TODO: Change this to a real image */}
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-tint font-semibold text-primary-text">
          {initials}
        </span>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-primary-text sm:text-xl">
            {name}
          </h1>

          <p className="truncate text-sm text-muted-foreground">{field}</p>

          {studies ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {studies}
            </p>
          ) : null}
        </div>
      </div>

      {/* Complete Profile */}
      {true ? <ProfileCompletionPrompt /> : null}
    </Motion>
  );
}
